import { VapiClient } from '@vapi-ai/server-sdk';
import { config } from '../config';

export class VapiService {
  private client: VapiClient;

  constructor() {
    this.client = new VapiClient({
      token: config.vapi.apiKey,
    });
  }

  async initiateCall(targetNumber: string, systemPrompt: string) {
    return this.client.calls.create({
      phoneNumber: {
        customer: {
          number: targetNumber,
        },
      } as any,
      assistant: {
        model: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
          ],
        },
      } as any,
    });
  }
}