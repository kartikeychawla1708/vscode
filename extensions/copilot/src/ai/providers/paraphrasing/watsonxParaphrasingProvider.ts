/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { IParaphrasingProvider } from "./paraphrasingProvider.js";
import { watsonxConfig } from "../watsonx/watsonxConfig.js";
import { buildReconstructionPrompt } from "../../prompts/reconstructionPrompt.js";

export class WatsonxParaphrasingProvider implements IParaphrasingProvider {

	private accessToken?: string;

	private tokenExpiry = 0;

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

		this.accessToken = json.access_token;

		this.tokenExpiry =
			Date.now() + ((json.expires_in - 60) * 1000);

		return this.accessToken;

	}

	async paraphrase(
		text: string,
		facts: string[]
	): Promise<string> {

		console.log("[PARAPHRASER] Starting");

		const token = await this.authenticate();

		const payload = {
			model_id: watsonxConfig.modelId,
			project_id: watsonxConfig.projectId,
			messages: [
				{
					role: "system",
					content: buildReconstructionPrompt(facts)
				},
				{
					role: "user",
					content:
						`Write a completely new version of the document from these facts.

Do not paraphrase sentence-by-sentence.

Do not preserve sentence order.

Produce a naturally written document.

Facts:

${facts.map(f => "- " + f).join("\n")}`
				}
			],
			parameters: {
				decoding_method: "sample",
				max_tokens: 1024,
				temperature: 0.35,
				top_p: 0.85,
				repetition_penalty: 1.12
			}
		};

		console.log("[PARAPHRASER] Payload");
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
				`Watsonx paraphrasing failed (${response.status})`
			);
		}

		const json = await response.json() as {
			choices: {
				message: {
					content: string;
				};
			}[];
		};

		const rewritten = json.choices[0].message.content;

		console.log("[PARAPHRASER] Result");
		console.log(rewritten);

		return rewritten;

	}

}
