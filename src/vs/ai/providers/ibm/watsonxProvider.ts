import {
	ChatChunk,
	ChatRequest,
	ILLMProvider
} from '../llmProvider.js';

export class WatsonxProvider implements ILLMProvider {

	async *chat(request: ChatRequest): AsyncIterable<ChatChunk> {

		yield { text: "Hello " };

		await new Promise(r => setTimeout(r, 300));

		yield { text: "from " };

		await new Promise(r => setTimeout(r, 300));

		yield { text: "Yukti!" };
	}
}
