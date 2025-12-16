# Research: Production Infrastructure & Vapi Core

**Status**: Complete
**Date**: 2025-12-15

## Decisions

### 1. Language & Runtime
- **Decision**: Node.js 20 (LTS) with TypeScript.
- **Rationale**: 
  - Voice applications are inherently event-driven (webhooks, WebSocket streams), which aligns perfectly with Node.js's non-blocking I/O model.
  - Vapi provides a first-class `@vapi-ai/server-sdk` for Node.js.
  - TypeScript provides type safety for the Vapi contracts and internal data models.
- **Alternatives Considered**: 
  - **Python (FastAPI)**: Good alternative, but Node.js is often preferred for high-concurrency WebSocket handling in simple setups.
  - **Go**: Excellent performance, but Vapi SDK support is less mature/standard compared to Node/Python.

### 2. Web Framework
- **Decision**: Express.js.
- **Rationale**:
  - Minimalist and flexible.
  - Easy to integrate with the `ws` library for WebSocket upgrades on the same HTTP server instance.
  - Massive ecosystem for middleware (logging, security, body parsing).
- **Alternatives Considered**:
  - **NestJS**: Too heavy for a single-feature MVP.
  - **Fastify**: Faster, but Express is sufficient for the target scale and easier to prototype with.

### 3. WebSocket Library
- **Decision**: `ws`.
- **Rationale**:
  - Lightweight, spec-compliant WebSocket implementation.
  - Low overhead compared to Socket.io.
  - Sufficient for broadcasting transcript text.
- **Alternatives Considered**:
  - **Socket.io**: Adds protocol overhead (polling fallback) which isn't needed for a simple transcript stream, and requires a specific client-side library.

### 4. Testing Framework
- **Decision**: Jest.
- **Rationale**:
  - De facto standard for TypeScript testing.
  - Built-in support for mocking (crucial for mocking Vapi API calls).
- **Alternatives Considered**:
  - **Mocha/Chai**: Requires more setup.
  - **Vitest**: Newer, faster, but Jest is more "boring" (reliable) for this context.

### 5. Infrastructure
- **Decision**: Docker Compose with Nginx Reverse Proxy.
- **Rationale**:
  - Decouples the application server from the public interface.
  - Allows easy mapping of port 8081 (Nginx) -> 3001 (App) as per Constitution.
  - Simplifies local development and deployment consistency.

## Outstanding Questions (Resolved)
- **Vapi SDK Usage**: We will use `@vapi-ai/server-sdk` for typed interactions but likely standard `fetch` or `axios` if the SDK is missing specific helpers for `complete_call` tools, though the research suggests it's robust.
- **Transcript Format**: We will define a simple JSON schema for the WebSocket messages.
