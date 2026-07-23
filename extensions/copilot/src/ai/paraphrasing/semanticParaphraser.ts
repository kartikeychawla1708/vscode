/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

import { HumanizerPipeline } from "../humanizer/humanizerPipeline.js";

export class SemanticParaphraser {

	private readonly pipeline = new HumanizerPipeline();

	public async paraphrase(
		text: string
	): Promise<string> {

		return this.pipeline.transform(text);

	}

}
