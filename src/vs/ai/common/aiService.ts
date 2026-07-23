/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../platform/instantiation/common/instantiation.js';

export interface AIChatMessage {
	readonly role: 'system' | 'user' | 'assistant';
	readonly content: string;
}

export interface AIChatChunk {
	readonly text: string;
}


export interface IAIService {

	readonly _serviceBrand: undefined;

	chat(messages: readonly AIChatMessage[]): AsyncIterable<AIChatChunk>;
}

export const IAIService = createDecorator<IAIService>('aiService');
