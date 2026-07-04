import { ChatRuntime } from './chatRuntime.js';
import { ProviderRegistry } from './providerRegistry.js';

const registry = new ProviderRegistry();

export const chatRuntime = new ChatRuntime(
	registry.getDefaultProvider()
);
