/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//import { IAIService } from '../common/aiService.js';
import { BRANDING } from '../common/branding.js';
import { IAIService, AIChatMessage, AIChatChunk } from "../common/aiService.js";
import { ProviderRegistry } from "./providerRegistry.js";

export class AIService implements IAIService {

	declare readonly _serviceBrand: undefined;

	private readonly registry = new ProviderRegistry();

	getAgentName(): string {
		return BRANDING.agentName;
	}

	getIdeName(): string {
		return BRANDING.ideName;
	}

	isAvailable(): boolean {
		return true;
	}

	async *chat(
		messages: readonly AIChatMessage[]
	): AsyncIterable<AIChatChunk> {

		const provider = this.registry.getDefaultProvider();

		for await (const chunk of provider.chat({
			messages
		})) {
			yield chunk;
		}
	}
}
