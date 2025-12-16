# Implementation Plan: Production Infrastructure & Vapi Core (Revised)

**Spec**: [specs/001-production-infra/spec.md](specs/001-production-infra/spec.md)

## Summary

A containerized Node.js service supporting outbound calls, webhooks, and real-time transcripts via WebSockets. Includes CI automation.

## Technical Context

**Stack**: Node.js 20, Express.js, ws (WebSockets), @vapi-ai/server-sdk
**Testing**: Unit Tests only (Jest)
**Infrastructure**: Docker Compose (Single Service), GitHub Actions (CI)
**Logging**: Console.log (Simplified)

## Constitution Check

- [x] **Reliability**: Basic error handling.
- [x] **Container Native**: Dockerfile included.
- [x] **Observability**: Real-time transcripts + Console logs.
- [x] **Pragmatic Testing**: Unit tests for services.

## Project Structure

```text
src/
├── app.ts               # Express Setup
├── server.ts            # HTTP + WebSocket Server Entry
├── config.ts            # Env vars
├── services/            # VapiService, TranscriptService
├── controllers/         # CallController, WebhookController
└── types/               # Interfaces

tests/                   # Unit tests
.github/workflows/       # CI
docker-compose.yml
Dockerfile
```