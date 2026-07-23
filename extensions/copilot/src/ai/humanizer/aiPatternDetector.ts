/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

export class AIPatternDetector {


	private readonly patterns: RegExp[] = [

		/\bI am grateful\b/gi,

		/\bI appreciate\b/gi,

		/\bI sincerely appreciate\b/gi,

		/\bYour expertise and guidance\b/gi,

		/\bvaluable insights\b/gi,

		/\binstrumental role\b/gi,

		/\bsignificant impact\b/gi,

		/\bmeaningful difference\b/gi,

		/\bcommitment to excellence\b/gi,

		/\bhas not gone unnoticed\b/gi,

		/\blook forward to working with you\b/gi,

		/\bopportunity to collaborate\b/gi,

		/\btestament to\b/gi,

		/\bthroughout the process\b/gi,

		/\bdelivered a high[- ]quality solution\b/gi

	];


	public detect(text: string): string[] {

		const matches: string[] = [];

		for (const pattern of this.patterns) {

			const result = text.match(pattern);

			if (result) {
				matches.push(...result);
			}

		}

		console.log("[AI PATTERN DETECTOR]");
		console.log(matches);

		return matches;

	}

}
