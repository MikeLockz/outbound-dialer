# Data Model: Web UI Controls

**Feature**: Web UI Controls
**Date**: 2025-12-15

## Entities

### CallRequest
*Represents the user's intent to start a call.*

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `number` | String | Yes | The destination phone number. | E.164 format or simple digit check. |
| `systemPrompt` | String | Yes | The instructions for the AI assistant. | Non-empty string. |

### TranscriptMessage
*Represents a real-time update from the call.*

| Field | Type | Description |
|-------|------|-------------|
| `type` | String | Always "transcript". |
| `role` | String | "user" or "assistant". |
| `text` | String | The content spoken. |
| `timestamp` | String | ISO 8601 Date string. |
| `call_id` | String | Unique ID of the call (optional for UI display but good for state). |
