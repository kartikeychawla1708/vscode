/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface ChatRequest {
	messages: readonly ChatMessage[];
}

export interface ChatChunk {
	text: string;
}

export interface ILLMProvider {

	chat(request: ChatRequest): AsyncIterable<ChatChunk>;

}
