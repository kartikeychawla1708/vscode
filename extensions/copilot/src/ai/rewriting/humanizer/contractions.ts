const contractions: Record<string, string> = {
	"I am": "I'm",
	"I have": "I've",
	"I will": "I'll",
	"I would": "I'd",

	"We are": "We're",
	"We have": "We've",
	"We will": "We'll",

	"You are": "You're",
	"You have": "You've",
	"You will": "You'll",

	"They are": "They're",
	"They have": "They've",

	"It is": "It's",
	"That is": "That's",
	"There is": "There's",
	"Here is": "Here's",

	"Do not": "Don't",
	"Cannot": "Can't",
	"Will not": "Won't",
	"Did not": "Didn't",
	"Does not": "Doesn't",
	"Is not": "Isn't",
	"Are not": "Aren't",
	"Would not": "Wouldn't",
	"Could not": "Couldn't",
	"Should not": "Shouldn't"
};

export function applyContractions(text: string): string {
	let output = text;

	for (const [from, to] of Object.entries(contractions)) {
		output = output.replace(new RegExp(`\\b${from}\\b`, "g"), to);
	}

	return output;
}
