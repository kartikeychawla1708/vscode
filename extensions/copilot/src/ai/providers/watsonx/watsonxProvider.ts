/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	ChatChunk,
	ChatRequest,
	ILLMProvider
} from '../../common/llmProvider.js';

import { watsonxConfig } from "./watsonxConfig.js";
import { PromptComposer } from "../../pipeline/promptComposer.js";
import { BASE_PROMPT } from "../../prompts/basePrompt.js";
import { GenerationProfileResolver } from "../../pipeline/generationProfileResolver.js";
import { RewritePipeline } from "../../rewriting/rewritePipeline.js";

export class WatsonxProvider implements ILLMProvider {

	private accessToken?: string;

	private tokenExpiry = 0;
	private readonly profileResolver = new GenerationProfileResolver();
	private readonly rewritePipeline = new RewritePipeline();

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


	private async callIBM(request: ChatRequest): Promise<string> {
		console.log("[CALL IBM] Request Messages");
		console.log(JSON.stringify(request.messages, null, 2));
		console.log("[CALL IBM] skipRewrite =", request.skipRewrite);
		const token = await this.authenticate();
		const composer = new PromptComposer();

		const systemPrompt = {

			role: "system",

			content: composer.compose(
				BASE_PROMPT
			)

		};

		const profile = this.profileResolver.resolve(request);

		const payload = {
			model_id: watsonxConfig.modelId,
			project_id: watsonxConfig.projectId,
			messages: [
				systemPrompt,
				...request.messages
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
		console.log(
			"[WATSONX] Generation Profile",
			JSON.stringify(profile, null, 2)
		);
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

		const draft = json.choices[0].message.content;

		console.log("[WATSONX] First Draft");
		console.log(draft);

		if (request.skipRewrite) {
			console.log("[CALL IBM] Returning draft without rewrite");
			return draft;
		}

		console.log("[CALL IBM] Draft BEFORE Rewrite");
		console.log(draft);

		console.log("[CALL IBM] Invoking RewritePipeline");

		const rewritten = await this.rewritePipeline.rewrite(
			request.messages.map(m => m.content).join("\n"),
			draft
		);

		console.log("[CALL IBM] Draft AFTER Rewrite");
		console.log(rewritten);

		return rewritten;

	}

	async *chat(request: ChatRequest): AsyncIterable<ChatChunk> {
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
