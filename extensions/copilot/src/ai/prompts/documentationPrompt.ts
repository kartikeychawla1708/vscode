import { PromptModule } from "../pipeline/promptComposer.js";
import { GenerationProfile } from "../pipeline/generationProfileResolver.js";

export const DOCUMENTATION_PROFILE: GenerationProfile = {
	decodingMethod: "sample",
	maxTokens: 2048,
	temperature: 0.6,
	topP: 0.9,
	repetitionPenalty: 1.05
};

export const DOCUMENTATION_PROMPT: PromptModule = {

	content: `

Write documentation.

Prioritize:

- clarity

- correctness

- maintainability

Avoid marketing language.

`

};
