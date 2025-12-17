import { TranscriptService } from '../src/services/transcript';
import { WebSocket } from 'ws';

describe('TranscriptService', () => {
  let transcriptService: TranscriptService;
  let mockWss: any;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      readyState: WebSocket.OPEN,
      send: jest.fn(),
    };
    mockWss = {
      clients: new Set([mockClient]),
    };
    transcriptService = new TranscriptService(mockWss);
  });

  it('should broadcast message to open clients', () => {
    const msg = {
      type: 'transcript' as const,
      role: 'assistant' as const,
      content: 'Hello',
      timestamp: new Date().toISOString()
    };
    transcriptService.broadcast(msg);
    expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify(msg));
  });
});
