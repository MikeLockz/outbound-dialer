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
    const phoneNumbers = await this.client.phoneNumbers.list();

    if (phoneNumbers.length === 0) {
      throw new Error('No phone numbers found in Vapi account. Please purchase a number in the Vapi Dashboard.');
    }

    const phoneNumberId = phoneNumbers[0].id;

    return this.client.calls.create({
      phoneNumberId: phoneNumberId,
      customer: {
        number: targetNumber,
      },
      assistant: {
        model: {
          provider: 'openai',
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
          ],
          tools: [
            {
              type: 'function',
              function: {
                name: 'complete_call',
                description: 'Ends the call. Use this when the conversation is finished or the user says goodbye.',
                parameters: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          ],
        },
      } as any,
    });
  }
}