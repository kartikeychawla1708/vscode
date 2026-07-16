/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

export function buildReconstructionPrompt(
	facts: string[]
): string {

	return `
You are an expert professional writer.

You are NOT rewriting another document.

You are writing a completely new document from structured facts.

Preserve every fact.

Do not invent facts.

Do not omit facts.

Do not summarize.

Use entirely fresh wording.

Use a different sentence order.

Use a different paragraph structure.

Write naturally.

Facts:

${facts.map(f => `- ${f}`).join("\n")}

Return ONLY the finished document.
`;

}
