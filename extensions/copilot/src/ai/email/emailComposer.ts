/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

import { DocumentFacts } from "../reconstruction/documentFacts.js";

function pick<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

export class EmailComposer {

	public compose(facts: DocumentFacts): string {

		const recipient = facts.recipient ?? "";
		const sender = facts.sender ?? "";
		const subject = facts.subject ?? "";

		const greeting =
			recipient
				? `${pick(["Hi", "Hello", "Dear"])} ${recipient},`
				: pick(["Hi,", "Hello,", "Dear,"]);

		let body = "";

		// Opening
		switch (facts.purpose) {

			case "appreciation":
				body += "I wanted to take a moment to thank you for all your support.\n\n";
				break;

			case "documentation":
				body += "Please find the requested information below.\n\n";
				break;

			case "report":
				body += "Here's a quick summary.\n\n";
				break;

			case "linkedin":
				body += "I wanted to share a quick update.\n\n";
				break;

			default:
				body += "I wanted to reach out regarding the following.\n\n";
		}

		// Main content

		const factsToUse = facts.keyFacts
			.map(f => f.trim())
			.filter(Boolean);

		if (factsToUse.length > 0) {

			const intro = factsToUse.shift();

			if (intro) {
				body += intro + "\n\n";
			}

			for (const fact of factsToUse) {

				const sentence =
					fact.charAt(0).toLowerCase() + fact.slice(1);

				body += `Also, ${sentence}`;

				if (!/[.!?]$/.test(sentence)) {
					body += ".";
				}

				body += "\n";
			}
		}

		// Closing
		if (facts.purpose === "appreciation") {

			body += "\n";
			body += pick([
				"I really appreciate everything you did.",
				"Working with you made the project much easier.",
				"Your support truly made a difference.",
				"Thanks again for everything."
			]);
			body += "\n";
		}

		body += "\n";

		if (sender) {
			body += sender;
		}

		return `Subject: ${subject}

${greeting}

${body}`;
	}

}
