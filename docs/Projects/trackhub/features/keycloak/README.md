---
id: features-index
title: "Features & Epics Index"
sidebar_label: "Features"
---

# Features & Epics

This section contains detailed epic breakdowns, task tracking, checklists, and acceptance criteria for major features in the trackhub project.

## Active Epics

### Keycloak Integration Epic

**Status**: `TODO[]` (Planning)  
**Priority**: `URGENT[]` (High)  
**Epic ID**: `EPIC-KEYCLOAK-001`

Comprehensive integration of Keycloak for centralized authentication and authorization across the trackhub ecosystem.

📖 [View Epic Overview](./keycloak-integration-epic.md)

#### Phases

1. **[Phase 1: Keycloak Setup & Admin Portal Integration](./keycloak-phase-1-admin-portal.md)**
   - Status: `TODO[]`
   - Estimated: 3-4 weeks
   - Dependencies: None

2. **[Phase 2: Mobile App Authentication Migration](./keycloak-phase-2-mobile-app.md)**
   - Status: `TODO[]`
   - Estimated: 4-5 weeks
   - Dependencies: Phase 1

3. **[Phase 3: Social Login Integration](./keycloak-phase-3-social-login.md)**
   - Status: `TODO[]`
   - Estimated: 2-3 weeks
   - Dependencies: Phase 2

4. **[Phase 4: Passkey/WebAuthn Support](./keycloak-phase-4-passkey.md)**
   - Status: `TODO[]`
   - Estimated: 2-3 weeks
   - Dependencies: Phase 2

5. **[Phase 5: User Migration & Deprecation](./keycloak-phase-5-migration.md)**
   - Status: `TODO[]`
   - Estimated: 3-4 weeks
   - Dependencies: All previous phases

## Task Tracking System

All epics and tasks use the following status tags:

- `TODO[]` - Pending task
- `TODO[x]` - Completed task
- `FIXME[]` - Code that needs fixing
- `BUG[]` - Known bug
- `NOTE` - Important information
- `URGENT[]` - High priority task
- `SECURITY[]` - Security-related issue
- `FEATURE[]` - New feature request

## How to Use This Documentation

1. **Epic Level**: Start with the epic overview to understand the big picture
2. **Phase Level**: Review each phase for detailed breakdown
3. **Task Level**: Each task includes:
   - Detailed checklist
   - Acceptance criteria (AC)
   - Technical notes
   - Dependencies

4. **Tracking**: Update status tags as work progresses:
   - Mark tasks as `TODO[x]` when completed
   - Add `FIXME[]` for issues found
   - Use `BUG[]` for bugs discovered

## Contributing

When working on a task:

1. Read the full task description and acceptance criteria
2. Complete all items in the checklist
3. Verify all acceptance criteria are met
4. Update the task status to `TODO[x]`
5. Update the phase progress tracking
6. Update the epic progress tracking

## Related Documentation

- [Keycloak Evaluation](../keycloak-evaluation.md)
- [Architecture Documentation](../architecture.md)
- [Security Documentation](../security.md)
- [Task Tracking System](../../../README.md)

