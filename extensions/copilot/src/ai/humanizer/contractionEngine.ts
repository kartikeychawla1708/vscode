/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

export class ContractionEngine {

	private readonly replacements: Array<[RegExp, string]> = [

		[/\bI am\b/g, "I'm"],
		[/\bI have\b/g, "I've"],
		[/\bI will\b/g, "I'll"],
		[/\bI would\b/g, "I'd"],

		[/\byou are\b/gi, "you're"],
		[/\byou will\b/gi, "you'll"],
		[/\byou have\b/gi, "you've"],

		[/\bwe are\b/gi, "we're"],
		[/\bwe have\b/gi, "we've"],
		[/\bwe will\b/gi, "we'll"],

		[/\bthey are\b/gi, "they're"],
		[/\bthey have\b/gi, "they've"],

		[/\bit is\b/gi, "it's"],
		[/\bthat is\b/gi, "that's"],
		[/\bthere is\b/gi, "there's"],

		[/\bdo not\b/gi, "don't"],
		[/\bdoes not\b/gi, "doesn't"],
		[/\bdid not\b/gi, "didn't"],

		[/\bcannot\b/gi, "can't"],
		[/\bcan not\b/gi, "can't"],

		[/\bwill not\b/gi, "won't"],

		[/\bis not\b/gi, "isn't"],
		[/\bare not\b/gi, "aren't"],
		[/\bwas not\b/gi, "wasn't"],
		[/\bwere not\b/gi, "weren't"],

		[/\bshould not\b/gi, "shouldn't"],
		[/\bcould not\b/gi, "couldn't"],
		[/\bwould not\b/gi, "wouldn't"]
	];

	public transform(text: string): string {

		let result = text;

		for (const [pattern, replacement] of this.replacements) {
			result = result.replace(pattern, replacement);
		}

		return result;
	}
}
