/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

import { IParaphrasingProvider } from "../providers/paraphrasing/paraphrasingProvider.js";

export class StructuralParaphraser {

	constructor(
		private readonly provider: IParaphrasingProvider
	) { }

	public async paraphrase(
		text: string,
		facts: string[]
	): Promise<string> {
		console.log("[STRUCTURAL] Before");
		console.log(text);

		const rewritten =
			await this.provider.paraphrase(
				text,
				facts
			);

		console.log("[STRUCTURAL] After");
		console.log(rewritten);

		return rewritten;
		//return this.provider.paraphrase(text);


	}

}
