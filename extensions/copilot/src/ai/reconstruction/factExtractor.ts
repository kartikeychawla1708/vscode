/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

import { DocumentFacts } from "./documentFacts.js";

export interface IFactExtractor {

	extract(
		text: string
	): Promise<DocumentFacts>;

}
