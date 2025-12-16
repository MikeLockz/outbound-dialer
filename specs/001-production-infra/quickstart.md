# Quickstart: Production Infrastructure & Vapi Core

## Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local dev)
- Vapi API Key (Set in `.env`)

## Setup

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env`:
   ```bash
   PORT=3001
   VAPI_API_KEY=your_key_here
   VAPI_ASSISTANT_ID=your_assistant_id
   BASE_URL=https://your-ngrok-url.com # For local Vapi callbacks
   ```

## Running

### Via Docker (Recommended)
```bash
docker-compose up --build
```
- API: `http://localhost:8081` (Nginx) or `http://localhost:3001` (Direct)
- WebSocket: `ws://localhost:8081/ws/transcript`

### Local Development
```bash
npm run dev
```

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Manual Verification
1. Start the server.
2. Send a POST to `/call`:
   ```bash
   curl -X POST http://localhost:8081/call \
     -H "Content-Type: application/json" \
     -d '{"target_number": "+15550000000", "system_prompt": "Say hello"}'
   ```
3. Connect a WebSocket client to `ws://localhost:8081/ws/transcript`.
