export interface CodingTask {
	userRequest: string;
	language?: string;
	filePath?: string;
	selectedCode?: string;
}

export interface AgentContext {
	activeFile?: string;
	selectedCode?: string;
	language?: string;
}

export interface CodePlan {
	summary: string;
	steps: string[];
	filesAffected: string[];
}

export interface CodeChange {
	filePath: string;
	modified: string;
}

export interface AgentResult {
	plan?: CodePlan;
	changes?: CodeChange[];
	explanation?: string;
	content: string;
}
