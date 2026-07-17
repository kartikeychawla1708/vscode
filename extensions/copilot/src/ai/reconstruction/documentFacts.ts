/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

export interface DocumentFacts {

	documentType: string;

	subject?: string;

	sender?: string;

	recipient?: string;

	purpose: string;

	tone: string;

	keyFacts: string[];

}
