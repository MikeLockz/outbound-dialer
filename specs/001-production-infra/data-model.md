# Data Model: Production Infrastructure & Vapi Core

## Entities

### CallRequest
**Source**: API Client (POST /call)
**Description**: Parameters for initiating an outbound call.

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `target_number` | string | Yes | E.164 formatted phone number | `^\+[1-9]\d{1,14}$` |
| `system_prompt` | string | Yes | Instructions for the AI agent | Min 10 chars |

### TranscriptMessage
**Source**: WebSocket Broadcast (`/ws/transcript`)
**Description**: Real-time transcript segment.

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | always "transcript" |
| `call_id` | string | UUID of the call |
| `role` | string | "user" or "assistant" |
| `text` | string | The spoken text |
| `timestamp` | string | ISO-8601 timestamp |

### VapiWebhookEvent
**Source**: Vapi Platform (POST /webhook/vapi)
**Description**: Events received from Vapi.

| Field | Type | Description |
|-------|------|-------------|
| `message` | object | The event payload |
| `message.type` | string | "function-call", "speech-update", "status-update", etc. |
| `message.call` | object | Call details (id, status) |
| `message.functionCall` | object | (If type="function-call") Details of tool call |

## Storage
*No persistent storage required for this feature.*
