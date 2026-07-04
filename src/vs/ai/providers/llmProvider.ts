export interface ChatRequest {
	prompt: string;
}

export interface ChatChunk {
	text: string;
}

export interface ILLMProvider {

	chat(request: ChatRequest): AsyncIterable<ChatChunk>;

}
