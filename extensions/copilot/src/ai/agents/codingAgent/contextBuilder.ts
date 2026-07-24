import { CodingTask, AgentContext } from "./types.js";

export class ContextBuilder {

	async collect(task: CodingTask): Promise<AgentContext> {

		return {
			activeFile: task.filePath,
			selectedCode: task.selectedCode,
			language: task.language
		};
	}
}
