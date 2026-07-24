import { ChatRequest } from "../common/llmProvider.js";

import { CODING_PROFILE } from "../prompts/codingProfile.js";
import { DOCUMENTATION_PROFILE } from "../prompts/documentationPrompt.js";
import { EMAIL_PROFILE } from "../prompts/emailPrompt.js";

export interface GenerationProfile {
	decodingMethod: "greedy" | "sample";
	maxTokens: number;
	temperature?: number;
	topP?: number;
	repetitionPenalty?: number;
}

export class GenerationProfileResolver {

	resolve(request: ChatRequest): GenerationProfile {

		const prompt =
			request.messages
				.map(m => m.content)
				.join(" ")
				.toLowerCase();

		// Emails
		if (
			prompt.includes("email") ||
			prompt.includes("letter") ||
			prompt.includes("appreciation") ||
			prompt.includes("recommendation") ||
			prompt.includes("linkedin")
		) {
			console.log("[PROFILE] EMAIL");
			return EMAIL_PROFILE;
		}

		// Documentation
		if (
			prompt.includes("documentation") ||
			prompt.includes("design document") ||
			prompt.includes("architecture") ||
			prompt.includes("specification") ||
			prompt.includes("release notes") ||
			prompt.includes("meeting summary")
		) {
			console.log("[PROFILE] DOCUMENTATION");
			return DOCUMENTATION_PROFILE;
		}

		// General writing / team messages
		if (
			prompt.includes("message") ||
			prompt.includes("update") ||
			prompt.includes("team") ||
			prompt.includes("feedback") ||
			prompt.includes("announce") ||
			prompt.includes("inform")
		) {
			console.log("[PROFILE] EMAIL");
			return EMAIL_PROFILE;
		}

		console.log("[PROFILE] CODING");
		return CODING_PROFILE;
	}

}
