import { CodingAgent } from "./codingAgent/codingAgent.js";
import { CodingTask } from "./codingAgent/types.js";

export enum AgentIntent {
	CODE_GENERATION = "code_generation",
	CODE_REVIEW = "code_review",
	EMAIL = "email",
	REWRITE = "rewrite",
	GENERAL = "general"
}


export class AgentRouter {

	constructor(
		private readonly codingAgent: CodingAgent
	) { }


	detectIntent(message: string): AgentIntent {

		const lower =
			message.toLowerCase();

		if (
			lower.includes("fix") ||
			lower.includes("bug") ||
			lower.includes("code") ||
			lower.includes("function") ||
			lower.includes("implement")
		) {
			return AgentIntent.CODE_GENERATION;
		}

		return AgentIntent.GENERAL;
	}


	async *execute(
		message: string,
		task?: CodingTask
	): AsyncIterable<string> {

		const intent =
			this.detectIntent(message);

		if (
			intent === AgentIntent.CODE_GENERATION &&
			task
		) {
			const result = await this.codingAgent.execute(task);

			yield result.content;
		}

		return;
	}

	async *executeCodingAgent(
		message: string
	): AsyncIterable<string> {

		console.log('[YUKTI] Executing Coding Agent');

		const task: CodingTask = {
			userRequest: message
		};

		const result = await this.codingAgent.execute(task);

		yield result.content;
	}
}
