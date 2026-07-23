import { BRANDING } from '../common/branding.js';

export class YuktiAgent {

	getName() {
		return BRANDING.agentName;
	}

	async initialize() {
		console.log(`${BRANDING.agentName} initialized`);
	}

}
