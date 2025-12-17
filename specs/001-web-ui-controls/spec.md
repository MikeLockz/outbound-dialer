# Feature Specification: Web UI Controls

**Feature Branch**: `001-web-ui-controls`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "this should have a web ui. Inputs to change outbound number and system prompt. separate area for transcript."

## User Scenarios & Testing

### User Story 1 - Configure and Initiate Call (Priority: P1)

As a user, I want to enter an outbound phone number and a custom system prompt so that I can test the AI dialer with different configurations without changing code.

**Why this priority**: Core functionality requested to enable dynamic testing.

**Independent Test**: Can be tested by opening the UI, entering a number/prompt, clicking "Call", and verifying the call is initiated with those parameters.

**Acceptance Scenarios**:

1. **Given** the Web UI is open, **When** I enter a valid phone number and system prompt and click "Call", **Then** the system initiates a call to that number using the provided prompt.
2. **Given** the Web UI is open, **When** I leave the phone number empty and click "Call", **Then** the system shows an error and does not initiate the call.

---

### User Story 2 - View Real-time Transcript (Priority: P1)

As a user, I want to see the call transcript in a dedicated area of the screen so that I can follow the conversation as it happens.

**Why this priority**: Essential for monitoring the AI's performance and debugging the conversation flow.

**Independent Test**: Can be tested by initiating a call and observing text appearing in the transcript area as the conversation progresses.

**Acceptance Scenarios**:

1. **Given** a call is in progress, **When** the AI or user speaks, **Then** the text appears in the transcript area in real-time.
2. **Given** multiple calls have been made, **When** a new call starts, **Then** the transcript area clears or clearly distinguishes the new session.
3. **Given** the UI is loaded, **When** I look at the screen, **Then** the transcript area is visually distinct from the configuration inputs.

### Edge Cases

- **Invalid Input**: User enters a non-numeric phone number or empty system prompt. System should validate before sending.
- **API Failure**: The Vapi API is unreachable or returns an error (e.g., rate limit). System should display a user-friendly error message.
- **Network Disconnect**: User loses internet connection while watching the transcript. System should attempt to reconnect or notify the user.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST serve a web interface accessible via a browser.
- **FR-002**: The UI MUST provide an input field for the "Outbound Number" (target phone number), validating for E.164 format compatibility (e.g., allow `+` and digits).
- **FR-003**: The UI MUST provide a multi-line text input (or text area) for the "System Prompt", supporting up to 4096 characters.
- **FR-004**: The UI MUST provide a mechanism (e.g., button) to initiate a call using the current input values. The button MUST be disabled and show a loading state while a request is pending.
- **FR-005**: The system MUST display call transcripts in real-time.
- **FR-006**: The transcript display MUST be visually separate from the input controls.
  - Messages MUST auto-scroll to the latest entry.
  - User and Assistant messages MUST be visually distinct (e.g., via alignment, color, or labels).
- **FR-007**: The system MUST handle connection errors (e.g., API failure) and display feedback to the user.
- **FR-008**: The system MUST be accessible without authentication (public/internal access).
- **FR-009**: The UI MUST reset all inputs to their default state (empty or placeholder) when the page is refreshed.
- **FR-010**: The UI MUST be implemented using React and **Shadcn UI** components for visual consistency.
- **FR-011**: The UI layout MUST be responsive, usable on both desktop and mobile viewports.

### Key Entities

- **Call Configuration**:
  - Target Phone Number
  - System Prompt
- **Transcript Event**:
  - Role (User/Assistant)
  - Text Content
  - Timestamp (ISO 8601 or HH:mm:ss display format)

### Edge Cases

- **Invalid Input**: User enters a non-numeric/invalid phone number or empty system prompt. System should validate before sending.
- **Concurrent Calls**: The "Call" button should be disabled while a call initiation request is in-flight to prevent double-submissions.
- **API Failure**: The Vapi API is unreachable or returns an error (e.g., rate limit). System should display a user-friendly error message.
- **Network Disconnect**: User loses internet connection while watching the transcript. System should attempt to reconnect or notify the user.
- **Long Transcripts**: The transcript area should handle long conversations by scrolling, without breaking the page layout.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can initiate a call with a custom prompt in under 30 seconds.
- **SC-002**: Transcript updates appear on the UI within 1 second of the event being received by the server.
- **SC-003**: 100% of successful calls initiated via the UI use the exact prompt provided in the input.

## Assumptions

- The backend (Express) will serve the **built** frontend assets (static files from a build process).
- Transcripts are ephemeral and lost when the page is refreshed (unless persistence clarification says otherwise).
- "Outbound Number" refers to the destination number to be called.