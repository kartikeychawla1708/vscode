import { RewriteType } from "./rewriteType.js";

export class RewriteDetector {

	detect(prompt: string): RewriteType {

		const text = prompt.toLowerCase();

		if (
			text.includes("email") ||
			text.includes("mail")
		) {
			return RewriteType.Email;
		}

		if (
			text.includes("documentation") ||
			text.includes("design document") ||
			text.includes("technical document") ||
			text.includes("specification")
		) {
			return RewriteType.Documentation;
		}

		if (
			text.includes("appreciation") ||
			text.includes("recognition")
		) {
			return RewriteType.Appreciation;
		}

		if (
			text.includes("linkedin")
		) {
			return RewriteType.LinkedIn;
		}

		if (
			text.includes("report")
		) {
			return RewriteType.Report;
		}

		if (
			text.includes("fix code") ||
			text.includes("fix this code") ||
			text.includes("correct code") ||
			text.includes("debug") ||
			text.includes("bug") ||
			text.includes("error") ||
			text.includes("issue in code") ||
			text.includes("why is this failing")
		) {
			return RewriteType.CodeCorrection;
		}

		return RewriteType.None;

	}

}
