# Outbound Dialer

A containerized Node.js service supporting outbound calls, webhooks, and real-time transcripts via WebSockets.

## Setup

1. Create `.env` file:
   ```
   PORT=3001
   VAPI_API_KEY=your_key_here
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Docker

Build and run with Docker Compose:

```bash
docker-compose up --build
```

- App Server: `http://localhost:3001`
- Nginx Proxy: `http://localhost:8081`

## API Usage

### Initiate Call

```bash
curl -X POST http://localhost:8081/call \
  -H "Content-Type: application/json" \
  -d 
    "{
    "target_number": "+1234567890",
    "system_prompt": "You are a helpful assistant."
  }"
```

### Webhooks

Endpoint: `POST /webhook/vapi`
Handles `function-call` and `speech-update` events from Vapi.

## Real-time Transcripts

Connect to WebSocket at `ws://localhost:8081` (or `ws://localhost:3001` directly).
Messages are broadcasted as JSON objects when `speech-update` events are received.

```