/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { BRANDING } from '../common/branding.js';
import { AIChatMessage, AIChatChunk } from '../common/types.js';
import { ProviderRegistry } from './providerRegistry.js';
import { AgentRouter } from '../agents/agentRouter.js';
import { CodingAgent } from '../agents/codingAgent/codingAgent.js';

export class AIService {

	private readonly registry: ProviderRegistry;
	private readonly agentRouter: AgentRouter;

	constructor() {

		this.registry =
			new ProviderRegistry();

		this.agentRouter =
			new AgentRouter(
				new CodingAgent(
					this.registry.getDefaultProvider()
				)
			);
	}

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
		const lastMessage =
			messages[messages.length - 1]?.content ?? '';

		const intent =
			this.agentRouter.detectIntent(lastMessage);

		console.log(
			'[YUKTI AGENT ROUTER]',
			intent
		);

		if (intent === 'code_generation') {
			console.log('[YUKTI] Coding Agent selected');

			const result =
				this.agentRouter.executeCodingAgent(lastMessage);

			for await (const chunk of result) {
				yield {
					text: chunk
				};
			}

			return;
		}

		const provider = this.registry.getDefaultProvider();

		for await (const chunk of provider.chat({
			messages
		})) {
			yield chunk;
		}
	}
}
