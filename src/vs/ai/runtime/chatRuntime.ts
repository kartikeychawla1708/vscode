import { ChatRequest, ILLMProvider } from '../providers/llmProvider.js';

export class ChatRuntime {

	constructor(
		private readonly provider: ILLMProvider
	) { }

	chat(request: ChatRequest) {
		return this.provider.chat(request);
	}
}
