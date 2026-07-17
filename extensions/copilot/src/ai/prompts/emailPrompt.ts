import { PromptModule } from "../pipeline/promptComposer.js";

import { GenerationProfile } from "../pipeline/generationProfileResolver.js";

export const EMAIL_PROFILE: GenerationProfile = {
	decodingMethod: "sample",
	maxTokens: 1024,
	temperature: 0.75,
	topP: 0.92,
	repetitionPenalty: 1.08
};

export const EMAIL_PROMPT: PromptModule = {

	content: `

Write naturally.

Avoid template language.

Avoid generic praise.

Keep the writing authentic.

Do not invent facts.

If information is limited,
write a shorter email.

`

};
