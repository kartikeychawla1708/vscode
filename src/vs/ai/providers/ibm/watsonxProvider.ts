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


export class WatsonxProvider implements ILLMProvider {

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

	private async callIBM(request: ChatRequest): Promise<string> {

		const token = await this.authenticate();

		const response = await fetch(
			`https://${watsonxConfig.region}.ml.cloud.ibm.com/ml/v1/text/chat?version=${watsonxConfig.version}`,
			{
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({
					model_id: watsonxConfig.modelId,
					project_id: watsonxConfig.projectId,
					messages: request.messages,
					parameters: {
						max_tokens: 1024,
						temperature: 0.2
					}
				})
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

	async *chat(request: ChatRequest): AsyncIterable<ChatChunk> {
		try {
			const response = await this.callIBM(request);
			yield {
				text: response
			};
		} catch (error) {
			yield {
				text: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}
}
