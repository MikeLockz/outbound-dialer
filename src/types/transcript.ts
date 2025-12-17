export interface TranscriptMessage {
  type: 'transcript'; // Add type property
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
