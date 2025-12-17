import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export class SimulationService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async createCompletion(messages: ChatCompletionMessageParam[]): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages,
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
                {
                    type: 'function',
                    function: {
                        name: 'dtmf',
                        description: 'Sends DTMF tones (keypad presses) to the call. Use this for IVR navigation (e.g. "Press 1").',
                        parameters: {
                            type: 'object',
                            properties: {
                                digits: {
                                    type: 'string',
                                    description: 'The digits to send (e.g. "1", "123#").',
                                },
                            },
                            required: ['digits'],
                        },
                    },
                },
            ],
        });

        const choice = response.choices[0];

        if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls) {
            const toolCall = choice.message.tool_calls[0];
            if (toolCall.type === 'function') {
                if (toolCall.function.name === 'complete_call') {
                    return "[CALL ENDED]";
                }
                if (toolCall.function.name === 'dtmf') {
                    const args = JSON.parse(toolCall.function.arguments);
                    return `[DTMF: ${args.digits}]`;
                }
            }
        }

        return choice.message.content || "...";
    }
}
