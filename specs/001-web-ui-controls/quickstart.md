# Quickstart: Web UI Controls

**Feature**: Web UI Controls
**Date**: 2025-12-15

## Prerequisities

- Node.js & npm installed
- `.env` file configured with `VAPI_API_KEY`
- Docker (optional, if running containerized)

## Running the Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm run dev
   ```

3. **Access the Web UI**:
   - Open your browser to `http://localhost:3001/` (or configured PORT).
   - You should see the "Outbound Dialer" interface.

## Making a Call

1. **Enter Details**:
   - **Phone Number**: Enter the target number (E.164 format preferred, e.g., `+1...`).
   - **System Prompt**: Type instructions for the AI (e.g., "Ask the user about their day").

2. **Initiate**:
   - Click the **"Call"** button.
   - Status message will appear below the button.

3. **View Transcript**:
   - As the call progresses, text will appear in the "Transcript" section on the right/bottom.
   - Requires the server to be publicly accessible (ngrok) for Vapi webhooks to reach `localhost`, OR testing in a deployed environment.

## Troubleshooting

- **No Transcripts?**: Ensure your local server is exposed to the internet (e.g., `ngrok http 3001`) and the Vapi Dashboard has your webhook URL configured (`https://your-ngrok.io/webhook/vapi`).
- **Call Fails?**: Check server logs for Vapi API errors (401 Unauthorized usually means bad API Key).
