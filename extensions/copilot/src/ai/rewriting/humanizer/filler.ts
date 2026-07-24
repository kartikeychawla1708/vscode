const fillers = [
	"I hope you're doing well.",
	"I hope this email finds you well.",
	"I trust you're doing well.",
	"Please do not hesitate to contact me.",
	"Thank you for your consideration.",
	"Should you have any questions,",
	"Please feel free to contact me."
];

export function removeFillers(text: string): string {
	let output = text;

	for (const filler of fillers) {
		output = output.replace(filler, "");
	}

	output = output.replace(/\n{3,}/g, "\n\n");

	return output.trim();
}
