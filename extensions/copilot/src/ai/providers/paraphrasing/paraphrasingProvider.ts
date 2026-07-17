export interface IParaphrasingProvider {

	paraphrase(
		text: string,
		facts: string[]
	): Promise<string>;

}
