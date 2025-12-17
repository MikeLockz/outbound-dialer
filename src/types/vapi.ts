export interface VapiWebhookEvent {
  message: {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    call: any; // Reverted to any due to SDK type incompatibility
    functionCall?: {
      name: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parameters: any;
    };
    transcript?: string;
    transcriptType?: 'partial' | 'final';
    role?: 'user' | 'assistant';
  };
}
