/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	ChatChunk,
	ChatMessage,
	ChatRequest,
	ILLMProvider
} from '../../common/llmProvider.js';

import { watsonxConfig } from "./watsonxConfig.js";
import { PromptComposer } from "../../pipeline/promptComposer.js";
import { GenerationProfileResolver } from "../../pipeline/generationProfileResolver.js";
import { RewritePipeline } from "../../rewriting/rewritePipeline.js";
import { RewriteDetector } from "../../rewriting/rewriteDetector.js";
import { PromptResolver } from "../../pipeline/promptResolver.js";
import { RewriteType } from "../../rewriting/rewriteType.js";
import { NATURAL_REWRITE_PROMPT } from "../../prompts/naturalRewritePrompt.js";
import { humanize } from "../../rewriting/humanizer/humanizer.js";
export class WatsonxProvider implements ILLMProvider {

	private accessToken?: string;

	private tokenExpiry = 0;
	private readonly profileResolver = new GenerationProfileResolver();

	private readonly rewritePipeline = new RewritePipeline();

	private readonly rewriteDetector = new RewriteDetector();

	private readonly promptResolver = new PromptResolver();

	private async authenticate(): Promise<string> {

		if (
			this.accessToken &&
			Date.now() < this.tokenExpiry
		) {
			return this.accessToken;
		}

		const response = await fetch(
			"https://iam.cloud.ibm.com/identity/token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: new URLSearchParams({
					grant_type: "urn:ibm:params:oauth:grant-type:apikey",
					apikey: watsonxConfig.apiKey
				})
			}
		);

		if (!response.ok) {
			throw new Error(
				`IBM IAM Authentication failed (${response.status})`
			);
		}

		const json = await response.json() as {
			access_token: string;
			expires_in: number;
		};
		console.log("[WATSONX] authenticate()");
		console.log("[WATSONX] POST", watsonxConfig.region);
		console.log("[WATSONX] model =", watsonxConfig.modelId);
		this.accessToken = json.access_token;

		this.tokenExpiry =
			Date.now() + ((json.expires_in - 60) * 1000);

		return this.accessToken;

	}

	private async generate(
		systemPrompt: string,
		messages: ReadonlyArray<ChatMessage>,
		profile: ReturnType<GenerationProfileResolver["resolve"]>
	): Promise<string> {

		const token = await this.authenticate();

		const payload = {
			model_id: watsonxConfig.modelId,
			project_id: watsonxConfig.projectId,
			messages: [
				{
					role: "system",
					content: systemPrompt
				},
				...messages
			],
			parameters: {
				decoding_method: profile.decodingMethod,
				max_tokens: profile.maxTokens,
				temperature: profile.temperature,
				top_p: profile.topP,
				repetition_penalty: profile.repetitionPenalty
			}
		};

		console.log("[CALL IBM] Payload");
		console.log(JSON.stringify(payload, null, 2));

		const response = await fetch(
			`https://${watsonxConfig.region}.ml.cloud.ibm.com/ml/v1/text/chat?version=${watsonxConfig.version}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify(payload)
			}
		);

		if (!response.ok) {
			throw new Error(
				`Watsonx request failed (${response.status})`
			);
		}

		const json = await response.json() as {
			choices: {
				message: {
					content: string;
				};
			}[];
		};

		return json.choices[0].message.content;
	}

	private async rewriteNaturally(
		originalDraft: string,
		reconstructedEmail: string,
		profile: ReturnType<GenerationProfileResolver["resolve"]>
	): Promise<string> {

		console.log("[NATURAL REWRITE] Starting");

		const composer = new PromptComposer();

		const systemPrompt = composer.compose(
			NATURAL_REWRITE_PROMPT
		);

		const rewritten = await this.generate(
			systemPrompt,
			[
				{
					role: "user",
					content: `Original Model Draft (REFERENCE ONLY)

${originalDraft}

The draft above exists only so you can preserve every factual detail.

Do NOT copy:
- wording
- sentence structure
- paragraph order
- transitions
- expressions
- writing style

----------------------------------------

Current Reconstructed Email

${reconstructedEmail}

Write a new email using the same facts.

Write like a real employee sending a genuine workplace email.

The email should feel naturally written instead of carefully edited.

It is acceptable to:
- reorganize paragraphs
- merge or split sentences
- use contractions
- simplify wording
- vary sentence lengths
- remove unnecessary formalities
- sound conversational
- leave some sentences straightforward instead of polished

Do NOT introduce grammar mistakes.

Do NOT invent information.

Preserve every fact from the reconstructed email.

Return only the rewritten email.`
				}
			],
			profile
		);

		console.log("[NATURAL REWRITE] Complete");

		return rewritten;

	}


	private async callIBM(request: ChatRequest): Promise<string> {
		console.log("[CALL IBM] Request Messages");
		console.log(JSON.stringify(request.messages, null, 2));
		console.log("[CALL IBM] skipRewrite =", request.skipRewrite);
		const composer = new PromptComposer();

		const userText =
			request.messages
				.map(m => m.content)
				.join("\n");


		const rewriteType =
			this.rewriteDetector.detect(userText);

		const isSimpleMessage =
			userText.toLowerCase().includes("short update message") ||
			userText.toLowerCase().includes("update message") ||
			userText.toLowerCase().includes("inform") ||
			userText.toLowerCase().includes("announcement");

		if (isSimpleMessage) {
			console.log("[CALL IBM] Simple message detected");
		}

		console.log(
			"[REWRITE TYPE]",
			RewriteType[rewriteType]
		);


		const promptModules =
			this.promptResolver.resolve(
				rewriteType
			);


		const systemPrompt = {

			role: "system",

			content: composer.compose(
				...promptModules
			)

		};

		const profile = this.profileResolver.resolve(request);

		let draft = await this.generate(
			systemPrompt.content,
			request.messages,
			profile
		);

		console.log("[WATSONX] First Draft");
		console.log(draft);

		draft = draft
			.replace(/^Here's a short update message:\s*/i, '')
			.replace(/^Here's a .*?:\s*/i, '')
			.replace(/^["']|["']$/g, '')
			.trim();

		if (request.skipRewrite) {
			console.log("[CALL IBM] Returning draft without rewrite");
			return draft;
		}

		console.log("[CALL IBM] Draft BEFORE Rewrite");
		console.log(draft);

		if (isSimpleMessage) {
			console.log("[CALL IBM] Returning draft without rewrite");
			return draft;
		}

		console.log("[CALL IBM] Invoking RewritePipeline");

		const reconstructed = await this.rewritePipeline.rewrite(
			request.messages.map(m => m.content).join("\n"),
			draft
		);

		console.log("[CALL IBM] Draft AFTER Rewrite");
		console.log(reconstructed);

		const naturalRewrite = await this.rewriteNaturally(
			draft,
			reconstructed,
			profile
		);

		console.log("[CALL IBM] Final Natural Rewrite");
		console.log(naturalRewrite);


		const finalEmail = humanize(naturalRewrite);

		console.log("[CALL IBM] Humanized Email");
		console.log(finalEmail);


		return finalEmail;
	}

	async * chat(request: ChatRequest): AsyncIterable<ChatChunk> {
		try {
			const response = await this.callIBM(request);
			yield {
				text: response
			};
		} catch (error) {

			const message =
				error instanceof Error ?
					error.message :
					"Unknown Watsonx error";

			yield {
				text: `${message}`
			};

		}

	}
}
