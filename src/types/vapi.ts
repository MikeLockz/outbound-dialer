export interface VapiWebhookEvent {
  message: {
    type: string;
    call: any;
    functionCall?: {
      name: string;
      parameters: any;
    };
    transcript?: string;
    transcriptType?: 'partial' | 'final';
    role?: 'user' | 'assistant';
  };
}
