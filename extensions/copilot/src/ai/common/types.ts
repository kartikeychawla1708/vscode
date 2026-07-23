/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export interface AIChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface AIChatChunk {
	text: string;
}
