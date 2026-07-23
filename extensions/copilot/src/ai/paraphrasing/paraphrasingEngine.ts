/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

import { ParaphraseMode } from "./paraphraseMode.js";
import { SemanticParaphraser } from "./semanticParaphraser.js";
import { StructuralParaphraser } from "./structuralParaphraser.js";
import { WatsonxParaphrasingProvider } from "../providers/paraphrasing/watsonxParaphrasingProvider.js";

export class ParaphrasingEngine {

	private readonly semantic =
		new SemanticParaphraser();

	private readonly structural =
		new StructuralParaphraser(
			new WatsonxParaphrasingProvider()
		);

	public async paraphrase(

		text: string,

		facts: string[],

		mode: ParaphraseMode

	): Promise<string> {

		switch (mode) {

			case ParaphraseMode.Off:
				return text;

			case ParaphraseMode.Fast:
				return this.semantic.paraphrase(text);

			case ParaphraseMode.Deep:
				return this.structural.paraphrase(
					text,
					facts
				);

			default:
				return text;

		}

	}

}
