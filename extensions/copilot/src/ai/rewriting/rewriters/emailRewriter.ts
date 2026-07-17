/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

import { HumanizerPipeline } from "../../humanizer/humanizerPipeline.js";
import { ReconstructionEngine } from "../../reconstruction/reconstructionEngine.js";
import { EmailComposer } from "../../email/emailComposer.js";

export class EmailRewriter {

	private readonly reconstruction =
		new ReconstructionEngine();

	private readonly humanizer =
		new HumanizerPipeline();

	private readonly composer =
		new EmailComposer();

	public async rewrite(
		text: string
	): Promise<string> {

		console.log("[EMAIL REWRITER] Starting rewrite");

		/* ---------------------------------------------------------
		 * Phase 1 - Extract document facts
		 * ------------------------------------------------------- */

		const facts =
			await this.reconstruction.extract(text);

		console.log("========================================");
		console.log("[FACT EXTRACTION]");
		console.log(JSON.stringify(facts, null, 2));
		console.log("========================================");

		/* ---------------------------------------------------------
		 * Phase 2 - Structural paraphrasing
		 * ------------------------------------------------------- */

		console.log("[EMAIL REWRITER] Composing email from extracted facts...");

		const paraphrased =
			this.composer.compose(facts);

		/* ---------------------------------------------------------
		 * Phase 3 - Humanization
		 * ------------------------------------------------------- */

		console.log("[EMAIL REWRITER] Humanizing...");

		const humanized =
			this.humanizer.transform(paraphrased);

		console.log("[EMAIL REWRITER] Rewrite complete");

		return humanized;

	}

}
