# Research: Web UI Controls

**Feature**: Web UI Controls
**Date**: 2025-12-15

## Frontend Technology Stack

**Decision**: **React (Vite) + Tailwind CSS + Shadcn UI**.
**Rationale**: 
- **User Requirement**: Explicit request to use Shadcn UI components.
- **Modern Standards**: Provides a robust, accessible, and visually consistent foundation.
- **Component Reusability**: Shadcn's copy-paste architecture fits well with the "code ownership" model.
- **Trade-off**: Adds a build step (Vite) to the project, but this is acceptable given the "Container Native" constitution (can be handled in Docker).

## Vapi Dynamic Prompt Capability

**Decision**: Use `assistant.model.messages` override in `calls.create`.
**Rationale**: The `VapiService` already implements this pattern:
```typescript
assistant: {
  model: {
    // ...
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
    ],
  },
}
```
This confirms we can pass a dynamic `systemPrompt` from the controller to the service.

## Transcript Service Broadcasting

**Decision**: The existing `TranscriptService` implementation uses `wss.clients.forEach`.
**Rationale**: 
```typescript
broadcast(message: any) {
  this.wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
```
This standard `ws` library pattern correctly broadcasts to *all* connected clients (browsers). No changes needed to core logic, just ensuring the frontend connects correctly.