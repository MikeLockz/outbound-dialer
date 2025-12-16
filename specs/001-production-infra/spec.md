# Feature Specification: Production Infrastructure & Vapi Core (Revised)

**Feature Branch**: `001-production-infra`
**Status**: Feature-Rich MVP

## User Scenarios

### User Story 1 - Continuous Integration (Priority: P1)

As a Developer, I want my code to be automatically built and tested when I push to the main branch.

**Acceptance Scenarios**:
1. **Given** a push to `main`, **When** CI triggers, **Then** tests run and the container is built/pushed.

### User Story 2 - Containerized Deployment (Priority: P1)

As an Operator, I want to run the application using Docker.

**Acceptance Scenarios**:
1. **Given** Docker Compose, **When** started, **Then** the app is reachable on port 3001.

### User Story 3 - Outbound Call Initiation (Priority: P2)

As a System User, I want to trigger an outbound call via API.

**Acceptance Scenarios**:
1. **Given** the app is running, **When** POST `/call` is sent, **Then** Vapi initiates the call.

### User Story 4 - Graceful Call Termination (Priority: P2)

As a System User, I want the AI agent to be able to hang up the call when complete.

**Acceptance Scenarios**:
1. **Given** an active call, **When** the AI triggers `complete_call`, **Then** the webhook returns the end-call instruction.

### User Story 5 - Real-Time Transcripts (Priority: P3)

As a Supervisor, I want to see a real-time text transcript of the call.

**Acceptance Scenarios**:
1. **Given** a WebSocket connection, **When** speech occurs, **Then** transcript text is received.

## Requirements

### Functional Requirements

- **FR-001**: Expose POST `/call` to initiate calls via Vapi.
- **FR-002**: Expose POST `/webhook/vapi` to handle `function-call` and `speech-update` events.
- **FR-003**: Respond to `complete_call` with termination instruction.
- **FR-004**: Expose WebSocket endpoint `/ws/transcript` for broadcasting.
- **FR-005**: CI pipeline MUST build and test on push.
- **FR-006**: Application MUST run in a Docker container.

### Key Entities

- **Call Request**: `{ target_number: string, system_prompt: string }`
- **Transcript**: `{ role: string, text: string }`

## Success Criteria

- **SC-001**: API reachable at `http://localhost:3001`.
- **SC-002**: CI builds successfully.
- **SC-003**: Transcripts appear in real-time.