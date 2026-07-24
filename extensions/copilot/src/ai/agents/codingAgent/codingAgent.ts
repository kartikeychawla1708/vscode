import { ILLMProvider } from "../../common/llmProvider.js";
import { AgentPlanner } from "./agentPlanner.js";
import { ContextBuilder } from "./contextBuilder.js";
import { CodingTask, AgentResult } from "./types.js";

export class CodingAgent {

	constructor(
		private readonly llmProvider: ILLMProvider,
		private readonly contextBuilder = new ContextBuilder(),
		private readonly planner = new AgentPlanner()
	) { }

	async execute(
		task: CodingTask
	): Promise<AgentResult> {

		const context =
			await this.contextBuilder.collect(task);

		const plan =
			await this.planner.createPlan(
				task,
				context
			);

		const response =
			this.llmProvider.chat({
				messages: [
					{
						role: "system",
						content:
							"You are Yukti Coding Agent. Generate only the required code changes."
					},
					{
						role: "user",
						content:
							`${task.userRequest}

Plan:
${plan.steps.join("\n")}`
					}
				]
			});

		let output = "";

		for await (const chunk of response) {
			output += chunk.text;
		}

		return {
			plan,
			explanation: output,
			content: output
		};
	}
}
