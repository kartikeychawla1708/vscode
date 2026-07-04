import { ILLMProvider } from '../providers/llmProvider.js';
import { WatsonxProvider } from '../providers/ibm/watsonxProvider.js';

export class ProviderRegistry {

	private readonly provider = new WatsonxProvider();

	getDefaultProvider(): ILLMProvider {
		return this.provider;
	}

}
