import { WebSocketServer, WebSocket } from 'ws';
import { TranscriptMessage } from '../types/transcript';

export class TranscriptService {
  private wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
  }

  broadcast(message: TranscriptMessage) {
    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}
