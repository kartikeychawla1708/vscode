import { applyContractions } from "./contractions.js";
import { simplifyCorporateSpeak } from "./corporateSpeak.js";
import { removeFillers } from "./filler.js";

export function humanize(text: string): string {

	let output = text;

	output = applyContractions(output);

	output = simplifyCorporateSpeak(output);

	output = removeFillers(output);

	return output;
}
