# Outbound Dialer

A containerized Node.js service supporting outbound calls, webhooks, real-time transcripts via WebSockets, and a new Web UI for easy interaction.

## Setup

1. Create `.env` file:
   ```
   PORT=3001
   VAPI_API_KEY=your_key_here
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies and build:
   ```bash
   cd src/client
   npm install
   npm run build
   cd ../..
   ```

## Docker

Build and run with Docker Compose:

```bash
docker-compose up --build
```

- App Server (backend API only): `http://localhost:3001`
- Nginx Proxy (serving Web UI and proxying API): `http://localhost:8081`

## Web UI

Access the Web UI in your browser at `http://localhost:8081`. This interface allows you to:
- Configure the outbound phone number.
- Set a custom system prompt for the AI dialer.
- Initiate calls directly from the browser.
- View real-time transcripts of ongoing calls.

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

## Real-time Transcripts (for direct WebSocket clients)

Connect to WebSocket at `ws://localhost:8081/transcripts` (or `ws://localhost:3001/transcripts` directly).
Messages are broadcasted as JSON objects when `speech-update` events are received.
The Web UI now consumes these transcripts directly.

```
