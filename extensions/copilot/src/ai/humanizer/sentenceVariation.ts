/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

export class SentenceVariation {

	public transform(text: string): string {

		const sentences = text
			.split(/(?<=[.!?])\s+/)
			.filter(sentence => sentence.trim().length > 0);

		const rewritten: string[] = [];

		for (let i = 0; i < sentences.length; i++) {

			let sentence = sentences[i].trim();

			// Merge very short sentences with the previous one
			if (
				sentence.split(/\s+/).length < 5 &&
				rewritten.length > 0
			) {
				rewritten[rewritten.length - 1] += " " + sentence;
				continue;
			}

			// Insert a paragraph break after every third sentence
			if (
				i > 0 &&
				i % 3 === 0
			) {
				rewritten.push("\n" + sentence);
				continue;
			}

			rewritten.push(sentence);

		}

		return rewritten.join(" ");

	}

}
