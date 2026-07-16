import { RewriteDetector } from "./rewriteDetector.js";
import { RewriteType } from "./rewriteType.js";

import { EmailRewriter } from "./rewriters/emailRewriter.js";
import { DocumentationRewriter } from "./rewriters/documentationRewriter.js";
import { AppreciationRewriter } from "./rewriters/appreciationRewriter.js";
import { LinkedInRewriter } from "./rewriters/linkedInRewriter.js";
import { ReportRewriter } from "./rewriters/reportRewriter.js";

export enum RewriteMode {
	HumanizerOnly,
	HumanizerThenLLM
}

export function getRewriteMode(type: RewriteType): RewriteMode {

	switch (type) {

		case RewriteType.Email:
		case RewriteType.Appreciation:
		case RewriteType.LinkedIn:
			return RewriteMode.HumanizerOnly;

		case RewriteType.Documentation:
		case RewriteType.Report:
			return RewriteMode.HumanizerThenLLM;

		default:
			return RewriteMode.HumanizerOnly;
	}
}

export class RewritePipeline {

	private readonly detector = new RewriteDetector();

	private readonly email = new EmailRewriter();

	private readonly documentation = new DocumentationRewriter();

	private readonly appreciation = new AppreciationRewriter();

	private readonly linkedIn = new LinkedInRewriter();

	private readonly report = new ReportRewriter();

	async rewrite(
		prompt: string,
		response: string
	): Promise<string> {

		switch (this.detector.detect(prompt)) {

			case RewriteType.Email:
				return this.email.rewrite(response);

			case RewriteType.Documentation:
				return this.documentation.rewrite(response);

			case RewriteType.Appreciation:
				return this.appreciation.rewrite(response);

			case RewriteType.LinkedIn:
				return this.linkedIn.rewrite(response);

			case RewriteType.Report:
				return this.report.rewrite(response);

			default:
				return response;

		}

	}

}
