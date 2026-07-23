/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

export class FillerRemoval {

	private readonly replacements: Array<[RegExp, string]> = [

		[/\bI wanted to take a moment to\b/gi, "I'd like to"],

		[/\bI wanted to take a moment\b/gi, "I'd like to"],

		[/\bI am writing to\b/gi, "I'm writing to"],

		[/\bit is with great pleasure that\b/gi, ""],

		[/\bI would like to express my heartfelt appreciation\b/gi, "I sincerely appreciate"],

		[/\bheartfelt appreciation\b/gi, "appreciation"],

		[/\boutstanding achievement\b/gi, "excellent work"],

		[/\bexceptional work\b/gi, "great work"],

		[/\bsignificant impact\b/gi, "real impact"],

		[/\bgame[- ]changing\b/gi, "valuable"],

		[/\bpoured your heart and soul into\b/gi, "put a lot of effort into"],

		[/\bhas not gone unnoticed\b/gi, "has been noticed"],

		[/\bI would like to thank you\b/gi, "Thank you"],

		[/\bPlease accept my sincere appreciation\b/gi, "Thank you"],

		[/\bI look forward to your continued success\b/gi, "Wishing you continued success"],

		[/\bonce again,\s*/gi, ""],

		[/\bneedless to say\b/gi, ""],

		[/\bwithout a doubt\b/gi, ""],

		[/\bit goes without saying\b/gi, ""],

		[/\bvery unique\b/gi, "unique"],

		[/\bhighly appreciated\b/gi, "appreciated"],

		[/\bkindly\b/gi, "please"]

	];

	public transform(text: string): string {

		let result = text;

		for (const [pattern, replacement] of this.replacements) {
			result = result.replace(pattern, replacement);
		}

		// remove duplicate spaces
		result = result.replace(/[ \t]{2,}/g, " ");

		// remove 3+ blank lines
		result = result.replace(/\n{3,}/g, "\n\n");

		// remove spaces before punctuation
		result = result.replace(/\s+([.,!?;:])/g, "$1");

		return result.trim();
	}
}
