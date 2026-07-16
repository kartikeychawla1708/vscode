/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

export interface ExtractedFacts {

	documentType: string;

	recipient?: string;

	sender?: string;

	subject?: string;

	purpose?: string;

	tone?: string;

	keyFacts: string[];

}


export class SimpleFactExtractor {


	public async extract(
		text: string
	): Promise<ExtractedFacts> {

		console.log("[FACT EXTRACTOR] Starting");

		const facts: string[] = [];

		const subjectMatch =
			text.match(/subject:\s*(.+)/i);

		const recipientMatch =
			text.match(/(?:Dear|Hi|Hello)\s+([A-Za-z ]+)/i);

		const senderMatch =
			text.match(
				/(?:Regards,|Thanks,|Best regards,|Sincerely,)\s*\n?([A-Za-z ]+)/i
			);


		const subject =
			subjectMatch?.[1]?.trim();


		const recipient =
			recipientMatch?.[1]?.trim();


		const sender =
			senderMatch?.[1]?.trim();


		/*
			Remove email formatting
		*/
		const cleanText = text
			.replace(/Subject:.*\n/i, "")
			.replace(/Dear.*\n/i, "")
			.replace(/Best regards,[\s\S]*/i, "")
			.trim();


		/*
	Build clean semantic facts instead of copying sentences.
*/

		const cleaned = cleanText
			.replace(/Here's an email:?/gi, "")
			.replace(/Here's an appreciation email:?/gi, "")
			.replace(/Subject:.*$/gim, "")
			.replace(/Dear .*$/gim, "")
			.replace(/Best regards[\s\S]*$/i, "")
			.replace(/\s+/g, " ")
			.trim();

		const sentences = cleaned
			.split(/[.!?]/)
			.map(s => s.trim())
			.filter(Boolean);

		for (const sentence of sentences) {

			if (sentence.length < 15) {
				continue;
			}

			// Skip obvious email formatting
			if (/^(hi|hello|dear|thanks|best regards|regards)/i.test(sentence)) {
				continue;
			}

			// Skip generic AI openings
			if (/^(i wanted to take a moment|i just wanted|here'?s an email)/i.test(sentence)) {
				continue;
			}

			facts.push(sentence);
		}


		/*
			Detect basic purpose
		*/
		let purpose = "general";

		const lower =
			text.toLowerCase();


		if (
			lower.includes("appreciat") ||
			lower.includes("thank")
		) {
			purpose = "appreciation";
		}

		else if (
			lower.includes("update") ||
			lower.includes("progress")
		) {
			purpose = "project update";
		}

		else if (
			lower.includes("request") ||
			lower.includes("please")
		) {
			purpose = "request";
		}

		const uniqueFacts = [...new Set(facts)];

		const result: ExtractedFacts = {

			documentType: "email",

			recipient,

			sender,

			subject,

			purpose,

			tone: "professional",

			keyFacts: uniqueFacts

		};


		console.log("========================================");
		console.log("[FACT EXTRACTION RESULT]");
		console.log(
			JSON.stringify(result, null, 2)
		);
		console.log("========================================");


		return result;

	}

}
