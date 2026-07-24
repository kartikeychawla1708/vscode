const replacements: Record<string, string> = {
	"utilize": "use",
	"facilitate": "help",
	"endeavor": "try",
	"demonstrates": "shows",
	"demonstrate": "show",
	"therefore": "so",
	"furthermore": "also",
	"moreover": "also",
	"regarding": "about",
	"subsequently": "later",
	"commence": "start",
	"terminate": "end",
	"obtain": "get",
	"assistance": "help",
	"approximately": "about",
	"sufficient": "enough",
	"additional": "more",
	"numerous": "many"
};

export function simplifyCorporateSpeak(text: string): string {
	let output = text;

	for (const [from, to] of Object.entries(replacements)) {
		output = output.replace(new RegExp(`\\b${from}\\b`, "gi"), to);
	}

	return output;
}
