/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation.
 *--------------------------------------------------------------------------------------------*/

export class LexicalVariation {

	private readonly replacements: Array<[RegExp, string]> = [

		[/\butilize\b/gi, "use"],
		[/\bleverage\b/gi, "use"],
		[/\bfacilitate\b/gi, "help"],
		[/\bcommence\b/gi, "start"],
		[/\bterminate\b/gi, "end"],
		[/\bsubsequently\b/gi, "later"],
		[/\bmoreover\b/gi, "also"],
		[/\bfurthermore\b/gi, "also"],
		[/\bin order to\b/gi, "to"],
		[/\bdemonstrates\b/gi, "shows"],
		[/\bshowcases\b/gi, "shows"],
		[/\bexemplifies\b/gi, "shows"],
		[/\bvaluable asset\b/gi, "valuable contributor"],
		[/\bexceptional\b/gi, "excellent"],
		[/\boutstanding\b/gi, "great"],
		[/\bremarkable\b/gi, "impressive"],
		[/\bcrucial\b/gi, "important"],
		[/\bcritical\b/gi, "important"],
		[/\bendeavor\b/gi, "effort"],
		[/\bendeavours\b/gi, "efforts"],
		[/\bassisted\b/gi, "helped"],
		[/\bcutting-edge\b/gi, "modern"],
		[/\brobust\b/gi, "reliable"],
		[/\bseamless\b/gi, "smooth"],
		[/\boptimize\b/gi, "improve"],
		[/\boptimization\b/gi, "improvement"]

	];

	public transform(text: string): string {

		let result = text;

		for (const [pattern, replacement] of this.replacements) {
			result = result.replace(pattern, replacement);
		}

		return result;

	}

}
