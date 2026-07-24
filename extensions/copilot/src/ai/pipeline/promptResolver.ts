import { RewriteType } from "../rewriting/rewriteType.js";

import { PromptModule } from "./promptComposer.js";

import { BASE_PROMPT } from "../prompts/basePrompt.js";
import { EMAIL_PROMPT } from "../prompts/emailPrompt.js";
import { DOCUMENTATION_PROMPT } from "../prompts/documentationPrompt.js";
import { CODING_AGENT_PROMPT } from "../prompts/codingAgentPrompt.js";


export class PromptResolver {

	resolve(
		type: RewriteType
	): PromptModule[] {

		switch (type) {

			case RewriteType.Email:

				return [
					BASE_PROMPT,
					EMAIL_PROMPT
				];


			case RewriteType.Documentation:

				return [
					BASE_PROMPT,
					DOCUMENTATION_PROMPT
				];


			case RewriteType.Appreciation:

				return [
					BASE_PROMPT,
					EMAIL_PROMPT
				];


			case RewriteType.None:

				return [
					BASE_PROMPT,
					CODING_AGENT_PROMPT
				];


			default:

				return [
					BASE_PROMPT
				];
		}
	}
}
