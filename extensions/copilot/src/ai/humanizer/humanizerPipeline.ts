/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

import { ContractionEngine } from "./contractionEngine.js";
import { FillerRemoval } from "./fillerRemoval.js";
import { SentenceVariation } from "./sentenceVariation.js";
import { LexicalVariation } from "./lexicalVariation.js";
import { AIPatternDetector } from "./aiPatternDetector.js";



export class HumanizerPipeline {

	private readonly fillerRemoval = new FillerRemoval();
	private readonly lexicalVariation = new LexicalVariation();

	private readonly contractionEngine = new ContractionEngine();

	private readonly sentenceVariation = new SentenceVariation();
	private readonly aiPatternDetector = new AIPatternDetector();

	public transform(text: string): string {

		console.log("========================================");
		console.log("[HUMANIZER] Original");
		console.log(text);

		let result = text;
		this.aiPatternDetector.detect(result);
		result = this.fillerRemoval.transform(result);

		console.log("----------------------------------------");
		console.log("[After FillerRemoval]");
		console.log(result);

		result = this.contractionEngine.transform(result);

		console.log("----------------------------------------");
		console.log("[After ContractionEngine]");
		console.log(result);

		result = this.lexicalVariation.transform(result);

		console.log("----------------------------------------");
		console.log("[After LexicalVariation]");
		console.log(result);

		result = this.sentenceVariation.transform(result);

		console.log("----------------------------------------");
		console.log("[After SentenceVariation]");
		console.log(result);

		console.log("========================================");

		return result;

	}

}
