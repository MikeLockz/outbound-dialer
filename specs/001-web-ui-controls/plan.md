# Implementation Plan - Web UI Controls

**Feature**: Web UI Controls
**Branch**: `001-web-ui-controls`
**Spec**: [spec.md](./spec.md)
**Date**: 2025-12-15

## Technical Context

### Architecture

- **Frontend**: Single Page Application (SPA) served by the Express backend.
  - **Technology**: **React** (via Vite) + **Tailwind CSS** + **Shadcn UI**.
  - **Communication**: REST API for initiating calls (`POST /call`), WebSocket for real-time transcripts.
  - **Build Process**: Frontend is built to static assets (`dist/`) and served by Express in production/preview.
- **Backend**: Existing Node.js/Express server.
  - **New Endpoints**: 
    - `POST /call` (Update existing or create new to accept dynamic prompt).
    - `GET /` (Serve the built React app).
  - **WebSocket**: Enhance `TranscriptService` to handle client connections and broadcast transcripts to the UI.

### Constraints & Patterns

- **Constitution Compliance**: 
  - **Container Native**: Frontend build must happen within the Docker container (multistage build) or be pre-built.
  - **Observability**: Log all API requests and WebSocket connections.
  - **Security**: Validate inputs (phone number, prompt) on the server side.
- **Existing Patterns**: 
  - Use `TranscriptService` for WebSocket logic.
  - Use `CallController` for call logic.

### Unknowns & Risks

- **Build Complexity**: Integrating Vite build into existing Docker setup.
- **WebSocket Connection Stability**: Handling disconnects/reconnects gracefully on the frontend.
- **Vapi Client Capability**: Confirm `VapiClient` allows dynamic system prompt overrides per call.

## Constitution Check

| Principle | Compliance Strategy |
|-----------|---------------------|
| **I. Reliability First** | UI handles network errors gracefully; Backend validates inputs. |
| **II. Container Native** | Update `Dockerfile` to install frontend deps and run `npm run build`. |
| **III. Observability** | Log UI load events, call initiation attempts, and WebSocket connection states. |
| **IV. Pragmatic Testing** | Unit tests for new Controller logic; Manual testing for UI interactions. |
| **V. Security** | Input validation for phone numbers and prompt content. |

## Gates

- [x] **Spec complete?** Yes, `spec.md` is ready.
- [x] **Constitution aligned?** Yes, aligned with core principles.
- [x] **Unknowns manageable?** Yes, standard React patterns.

---

## Phase 0: Research (Optional)

*Goal: Validate Vapi dynamic prompt capability.*

- [ ] Check Vapi SDK/Docs for overriding `systemPrompt` in `calls.create`.
- [ ] Verify `TranscriptService` broadcast mechanism supports multiple clients (browsers).

## Phase 1: Design & Contracts

*Goal: Define API changes and Data Structures.*

1. **Data Model**:
   - `CallRequest`: `{ number: string, systemPrompt: string }`
   - `TranscriptMessage`: `{ type: 'transcript', role: 'user' | 'assistant', text: string, timestamp: string }`

2. **API Contracts**:
   - **POST /call**:
     - Request: JSON body with number, prompt.
     - Response: 200 OK (Call ID), 400 Bad Request (Validation).
   - **WS /transcripts**:
     - Client connects.
     - Server pushes `TranscriptMessage`.

3. **File Structure**:
   - `src/client/`: React application source.
   - `src/client/components/ui/`: Shadcn components.
   - `src/client/App.tsx`: Main UI.
   - `src/app.ts`: Update to serve `dist/` or `src/client/dist`.

## Phase 2: Implementation

*Goal: Build the feature.*

1. **Setup & Infrastructure**:
   - Initialize Vite project in `src/client`.
   - Configure Tailwind CSS.
   - Initialize Shadcn UI and add components (`button`, `input`, `textarea`, `card`, `scroll-area`).
   - Update `app.ts` to serve static files from build output.

2. **Backend**:
   - Update `CallController.initiate` to accept `systemPrompt` from body.
   - Update `VapiService.initiateCall` to pass `systemPrompt` to Vapi SDK.
   - Ensure `TranscriptService` broadcasts to all connected WS clients.

3. **Frontend Logic**:
   - Implement Form (Number, Prompt) using Shadcn components.
   - Implement Transcript display using `ScrollArea` and `Card`.
   - Implement WebSocket connection in `useEffect`.

4. **Testing**:
   - Unit test `CallController` input validation.
   - Verify WebSocket broadcast logic (mock WS clients).

## Phase 3: Verification

*Goal: Ensure quality.*

- [ ] **Manual Test**: Open UI, enter number/prompt, call. Verify phone rings + correct prompt used.
- [ ] **Manual Test**: Speak, verify transcript appears on UI.
- [ ] **Code Review**: Check against style guide and strict typing.