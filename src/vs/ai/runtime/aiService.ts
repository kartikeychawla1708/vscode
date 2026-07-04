/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAIService } from '../common/aiService.js';
import { BRANDING } from '../common/branding.js';

export class AIService implements IAIService {

	declare readonly _serviceBrand: undefined;

	getAgentName(): string {
		return BRANDING.agentName;
	}

	getIdeName(): string {
		return BRANDING.ideName;
	}

	isAvailable(): boolean {
		return true;
	}

}
