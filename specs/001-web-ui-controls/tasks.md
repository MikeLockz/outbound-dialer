# Implementation Tasks: Web UI Controls

**Feature**: Web UI Controls
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phase 1: Setup & Infrastructure
*Goal: Initialize React environment with Shadcn UI and build process.*

- [ ] T001 Initialize React project with Vite/TypeScript in `src/client/`
- [ ] T002 Configure Tailwind CSS in `src/client/`
- [ ] T003 Initialize Shadcn UI in `src/client/`
- [ ] T004 Install Shadcn components: `button`, `input`, `textarea`, `card`, `scroll-area`, `label`
- [ ] T005 Update `Dockerfile` to include frontend build step (multistage or pre-build)
- [ ] T006 Configure Express in `src/app.ts` to serve static files from `src/client/dist` (or build output location)

## Phase 2: Foundational
*Goal: Update Vapi integration to support dynamic prompts.*

- [x] T007 Update `VapiService` to accept `systemPrompt` argument in `initiateCall` method in `src/services/vapi.ts`
- [x] T008 [P] Add unit tests for `VapiService` dynamic prompt handling in `tests/vapi.test.ts`
- [x] T009 Update `CallController.initiate` to validate and extract `systemPrompt` from request body in `src/controllers/call.ts`
- [x] T010 [P] Add unit tests for `CallController` validation logic in `tests/call.test.ts`

## Phase 3: User Story 1 - Configure and Initiate Call (P1)
*Goal: Enable users to start calls with custom prompts via UI.*
*Tests: Manual verification of call initiation with specific prompt.*

- [ ] T011 [US1] Create `CallForm` component using Shadcn `Input`, `Textarea`, `Button` in `src/client/components/CallForm.tsx`
- [x] T012 [P] [US1] Implement form state management and validation (e.g., React Hook Form or state)
- [ ] T013 [US1] Implement `initiateCall` service in `src/client/services/api.ts` to POST to `/call`
- [ ] T014 [US1] Integrate `CallForm` with API service and handle loading/error states
- [x] T015 [US1] Verify backend `POST /call` endpoint correctly processes request from frontend integration

## Phase 4: User Story 2 - View Real-time Transcript (P1)
*Goal: Display live call transcripts in the UI.*
*Tests: Manual verification of text appearing during active call.*

- [ ] T016 [US2] Create `TranscriptViewer` component using Shadcn `Card` and `ScrollArea` in `src/client/components/TranscriptViewer.tsx`
- [ ] T017 [US2] Implement WebSocket connection hook in `src/client/hooks/useTranscript.ts`
- [ ] T018 [US2] Handle incoming `transcript` events and update local state list
- [ ] T019 [P] [US2] Add reconnection logic for WebSocket disconnects
- [ ] T020 [US2] Integrate `TranscriptViewer` into main `App.tsx` layout alongside `CallForm`

## Phase 5: Polish & Cross-Cutting
*Goal: Ensure reliability and user experience.*

- [x] T021 [P] Implement input reset on page refresh (React state default behavior)
- [x] T022 Improve error messages (use Shadcn `Toast` or `Alert` if available, or simple text)
- [ ] T023 Run final linting and type checking checks across all new files
- [ ] T024 Update project README.md to document build/run instructions for new frontend

## Dependencies

1. **Setup** (T001-T006) must complete before **User Story 1** UI work.
2. **Foundational** (T007-T010) must complete before **User Story 1** integration.

## Parallel Execution Examples

- **Frontend/Backend**: T011 (React Component) and T009 (Controller Update) can be done simultaneously.
- **Components**: T011 (Form) and T016 (Transcript) can be built by different devs once setup is done.

## Implementation Strategy

1. **MVP**: Complete Phases 1, 2, and 3 to allow making calls.
2. **Enhancement**: Complete Phase 4 to see what's happening.
3. **Finalize**: Phase 5 for cleanup.