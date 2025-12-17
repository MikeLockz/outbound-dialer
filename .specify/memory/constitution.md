<!--
Sync Impact Report:
- Version change: 0.0.0 -> 1.0.0
- List of modified principles:
  - Added: I. Reliability First
  - Added: II. Container Native
  - Added: III. Observability
  - Added: IV. Test-Driven Development (NON-NEGOTIABLE)
  - Added: V. Security
- Added sections: System Architecture, Development Workflow
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated / ⚠ pending)
  - .specify/templates/spec-template.md (✅ updated / ⚠ pending)
  - .specify/templates/tasks-template.md (✅ updated / ⚠ pending)
- Follow-up TODOs: None
-->
# Outbound Dialer Constitution

## Core Principles

### I. Reliability First
The system must be designed for high availability and fault tolerance. Failures in one component (e.g., a single call) must not cascade. Graceful degradation and automatic recovery mechanisms are required.

### II. Container Native
All application components must be containerized using Docker. Deployment is managed via Docker Compose. No dependency on host system libraries is allowed outside the container runtime.

### III. Observability
Comprehensive structured logging is mandatory for all components. Metrics for call states, error rates, and system performance must be exposed. Debuggability via logs is a primary requirement.

### IV. Pragmatic Testing
Focus on high-value unit tests for core business logic. Comprehensive end-to-end (E2E) and load testing are not required for this phase. Prioritize velocity and functional completeness.

### V. Security
Secrets must be managed securely and never checked into version control. Applications must run as non-root users where possible. Public entry points are strictly controlled (e.g., Nginx on 8081).

## System Architecture

The system consists of a backend Server (port 3001) and an Nginx reverse proxy (port 8081). It is deployed alongside Coolify but operates via standalone Docker Compose. Architecture must support horizontal scaling if needed.

## Development Workflow

All changes follow a standard Pull Request workflow. Code must pass all tests and linting before merge. Documentation (specs, plans) must be updated in step with code changes.

## Governance

Amendments to this constitution require a Pull Request with explicit justification. The `speckit.constitution` command governs updates. All feature specifications must cite compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2025-12-15 | **Last Amended**: 2025-12-15