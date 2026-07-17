/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

import { IFactExtractor } from "./factExtractor.js";
import { SimpleFactExtractor } from "./simpleFactExtractor.js";
import { DocumentFacts } from "./documentFacts.js";

export class ReconstructionEngine {

	private readonly extractor: IFactExtractor =
		new SimpleFactExtractor();

	public async extract(
		text: string
	): Promise<DocumentFacts> {

		return this.extractor.extract(text);

	}

}
