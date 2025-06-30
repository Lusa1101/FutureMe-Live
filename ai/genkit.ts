import { configureGenkit } from '@genkit-ai/core';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

export const ai = configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// Export models for use in flows
export { gemini15Flash };