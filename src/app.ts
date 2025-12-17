import express from 'express';
import { CallController } from './controllers/call';
import { WebhookController } from './controllers/webhook';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: '1.0.0' });
});

app.post('/call', CallController.initiate);
app.post('/webhook/vapi', WebhookController.handle);

export default app;
