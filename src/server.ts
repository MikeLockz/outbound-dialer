import http from 'http';
import { WebSocketServer } from 'ws';
import app from './app';
import { config } from './config';
import { TranscriptService } from './services/transcript';

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const transcriptService = new TranscriptService(wss);

app.set('transcriptService', transcriptService);

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
