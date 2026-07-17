/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ILLMProvider } from '../common/llmProvider.js';
import { WatsonxProvider } from '../providers/watsonx/watsonxProvider.js';

export class ProviderRegistry {

	private readonly provider = new WatsonxProvider();

	getDefaultProvider(): ILLMProvider {
		return this.provider;
	}

}
