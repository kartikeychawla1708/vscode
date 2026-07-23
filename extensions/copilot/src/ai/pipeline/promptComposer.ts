export interface PromptModule {
	readonly content: string;
}

export class PromptComposer {

	compose(
		...modules: PromptModule[]
	): string {

		return modules
			.map(module => module.content.trim())
			.join("\n\n");
	}

}
