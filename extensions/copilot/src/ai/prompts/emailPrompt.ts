import { PromptModule } from "../pipeline/promptComposer.js";

import { GenerationProfile } from "../pipeline/generationProfileResolver.js";

export const EMAIL_PROFILE: GenerationProfile = {
	decodingMethod: "sample",
	maxTokens: 1024,
	temperature: 0.3,
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

For short workplace updates:

- Keep the message short.
- Use simple conversational wording.
- Do not add extra context.
- Do not make the message sound like a product announcement.
- Do not use phrases like "refine it further", "valuable feedback", or "invaluable".
- Prefer direct wording like "Please test it and share your feedback."
- Prefer "ready for testing" over "available for testing".
- Prefer "Please try it and share your feedback" over "Please give it a try".

If information is limited,
write a shorter email.

`

};
