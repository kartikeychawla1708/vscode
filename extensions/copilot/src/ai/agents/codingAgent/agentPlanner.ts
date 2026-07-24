import { CodingTask, AgentContext, CodePlan } from "./types.js";

export class AgentPlanner {

	async createPlan(
		task: CodingTask,
		context: AgentContext
	): Promise<CodePlan> {

		return {
			summary: task.userRequest,
			steps: [
				"Analyze the requested change",
				"Identify required code modifications",
				"Generate safe changes"
			],
			filesAffected: context.activeFile
				? [context.activeFile]
				: []
		};
	}
}
