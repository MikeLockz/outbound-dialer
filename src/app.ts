import express from 'express';
import path from 'path'; // Import path module
import { CallController } from './controllers/call';
import { WebhookController } from './controllers/webhook';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: '1.0.0' });
});

app.post('/call', CallController.initiate);
app.post('/webhook/vapi', WebhookController.handle);

// Serve static files from the React app's build output
app.use(express.static(path.join(__dirname, '../src/client/dist')));

// For any other routes, serve the index.html file of the React app
app.get(/.*/, (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/webhook')) { // Avoid serving index.html for API routes
    res.sendFile(path.join(__dirname, '../src/client/dist', 'index.html'));
  } else {
    res.status(404).send('Not Found'); // Default 404 for API routes
  }
});

export default app;
