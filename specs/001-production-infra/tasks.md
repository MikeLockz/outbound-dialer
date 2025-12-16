---
description: "Task list for Production Infrastructure & Vapi Core (Revised)"
---

# Tasks: Production Infrastructure & Vapi Core

**Input**: Design documents from `/specs/001-production-infra/`
**Tests**: Unit tests only (Pragmatic approach).

## Phase 1: Setup & Infrastructure

- [x] T001 Initialize project (package.json, tsconfig.json, basic deps: express, ws, @vapi-ai/server-sdk)
- [x] T002 Create directory structure (src/services, src/controllers, src/types, tests/)
- [x] T003 Create src/config.ts to export env vars
- [x] T004 Setup Express app in src/app.ts
- [x] T005 Setup HTTP/WebSocket server in src/server.ts

## Phase 2: User Story 1 - Continuous Integration (CI)

- [x] T006 [US1] Create GitHub Actions workflow in .github/workflows/ci.yml
- [x] T007 [US1] Add build and test scripts to package.json

## Phase 3: User Story 2 - Containerization

- [x] T008 [US2] Create Dockerfile (Node.js 20, non-root user)
- [x] T009 [US2] Create docker-compose.yml (expose port 3001)

## Phase 4: User Story 3 - Outbound Calls

### Implementation
- [x] T010 [P] [US3] Create VapiService.initiateCall in src/services/vapi.ts
- [x] T011 [P] [US3] Create CallController.initiate in src/controllers/call.ts
- [x] T012 [US3] Register POST /call route in src/app.ts

### Verification
- [x] T013 [P] [US3] Unit test for VapiService in tests/vapi.test.ts

## Phase 5: User Story 4 - Webhooks (Termination)

### Implementation
- [x] T014 [P] [US4] Update VapiService with types for webhook events
- [x] T015 [P] [US4] Create WebhookController.handle with 'function-call' logic in src/controllers/webhook.ts
- [x] T016 [US4] Register POST /webhook/vapi route in src/app.ts

### Verification
- [x] T017 [P] [US4] Unit test for WebhookController (function-call) in tests/webhook.test.ts

## Phase 6: User Story 5 - Transcripts (WebSockets)

### Implementation
- [x] T018 [P] [US5] Create TranscriptService.broadcast in src/services/transcript.ts
- [x] T019 [US5] Attach WebSocket server logic in src/server.ts
- [x] T020 [US5] Update WebhookController to handle 'speech-update' events

### Verification
- [x] T021 [P] [US5] Unit test for TranscriptService in tests/transcript.test.ts

## Phase 7: Documentation

- [x] T022 Update README.md with Docker and API usage

## Implementation Strategy

1.  **Setup**: Basic server and Docker.
2.  **CI**: Ensure commits are safe.
3.  **Calls**: Core capability.
4.  **Webhooks**: Handle logic.
5.  **Transcripts**: Add real-time layer.