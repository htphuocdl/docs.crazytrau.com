---
id: offline-first-index
title: "Offline-First Architecture Index"
sidebar_label: "Offline-First"
---

# Offline-First Architecture

This section contains detailed epic breakdown, task tracking, checklists, and acceptance criteria for the Offline-First Super App implementation with GraphQL CRUD.

## Epic Overview

**Status**: `IN_PROGRESS[]` (Backend Foundation Completed)  
**Priority**: `URGENT[]` (High)  
**Epic ID**: `EPIC-OFFLINE-001`  
**Progress**: ~15% (Backend foundation partially completed)

Comprehensive offline-first architecture implementation for the trackhub super app ecosystem using GraphQL CRUD with local-first data synchronization.

📖 [View Epic Overview](./offline-first-epic.md)

## Architecture Summary

**Source of Truth (Client)**: Local DB (WatermelonDB on React Native)  
**Server**: GraphQL CRUD + bulk sync endpoints (pull/push)  
**Sync Pattern**: Outbox (client) + Batching push + Incremental pull (since timestamp/version)  
**Conflict Strategy**: Per-domain rule (default: lastWriteWins for personal data, server merge for collaborative data, manual merge for critical data)  
**Media/Files**: Separate upload (multipart / signed URL) via background uploader queue

## Phases

### Phase 0: Foundation
**Status**: `IN_PROGRESS[]` (Partial - Backend conventions completed ✅)  
**Estimated**: 2-3 weeks  
**Dependencies**: None

Establish foundational infrastructure: local database setup, data conventions, outbox system, and network detection.

📖 [View Phase 0 Details](./offline-first-phase-0-foundation.md)

**Key Deliverables**:
- ⏳ WatermelonDB setup with encryption (Pending - Mobile team)
- ✅ Base schema definitions (Backend schema conventions completed)
- ⏳ Outbox manager API (Pending - Mobile team)
- ⏳ Network detection system (Pending - Mobile team)
- ⏳ Sync worker skeleton (Pending - Mobile team)

**Completed**:
- ✅ BE-0.1: Global Data Conventions defined and implemented

---

### Phase 1: Basic Sync
**Status**: `IN_PROGRESS[]` (Partial - Backend logic ready ✅)  
**Estimated**: 3-4 weeks  
**Dependencies**: Phase 0 completed

Implement core sync functionality: GraphQL sync endpoints, client pull/push logic, and basic conflict handling.

📖 [View Phase 1 Details](./offline-first-phase-1-basic-sync.md)

**Key Deliverables**:
- ⏳ GraphQL syncPull and syncPush endpoints (Backend logic ready, GraphQL endpoint pending)
- ⏳ Client sync pull implementation (Pending - Mobile team)
- ⏳ Client sync push batching (Pending - Mobile team)
- ⏳ Basic sync worker integration (Pending - Mobile team)
- ⏳ Optimistic UI updates (Pending - Mobile team)

**Completed**:
- ✅ BE-1.3: Versioning & Timestamp Management implemented
- ✅ BE-1.2: Backend repository logic for syncPush ready (version increment, clientId handling, idempotency)

---

### Phase 2: Robustness
**Status**: `TODO[]`  
**Estimated**: 3-4 weeks  
**Dependencies**: Phase 1 completed

Enhance sync reliability with comprehensive conflict resolution, idempotency guarantees, media upload queue, and improved error handling.

📖 [View Phase 2 Details](./offline-first-phase-2-robustness.md)

**Key Deliverables**:
- Conflict detection and resolution system
- Server-side merge strategies
- Enhanced idempotency
- Media upload queue
- Conflict resolution UI
- Undo snapshot system

---

### Phase 3: UX & QA
**Status**: `TODO[]`  
**Estimated**: 2-3 weeks  
**Dependencies**: Phase 2 completed

Focus on user experience polish, comprehensive testing, and edge case handling.

📖 [View Phase 3 Details](./offline-first-phase-3-ux-qa.md)

**Key Deliverables**:
- Polished UX with offline indicators
- Comprehensive test suites
- Edge case handling
- Debug/admin tools
- Performance optimizations

---

### Phase 4: Performance & Monitoring
**Status**: `TODO[]`  
**Estimated**: 2-3 weeks  
**Dependencies**: Phase 3 completed

Implement comprehensive observability, monitoring, metrics, and performance optimizations.

📖 [View Phase 4 Details](./offline-first-phase-4-performance-monitoring.md)

**Key Deliverables**:
- Metrics collection and dashboards
- Query optimizations
- Alerts configured
- Performance benchmarks
- Monitoring dashboard

## Data Conventions

All entities must follow these global conventions:

- **`id: ID!`** - Server canonical id (string UUID)
- **`clientId: String`** - Temporary id when offline before server returns id
- **`version: Int!`** - Increment always on server update
- **`updatedAt: DateTime!`** - ISO 8601 UTC timestamp
- **`deletedAt: DateTime`** or **`isDeleted: Boolean`** - For soft delete

**Timestamps**: All timestamps use UTC ISO 8601 format (e.g., `2025-11-05T09:12:34Z`)

**Idempotency**: All mutations must be idempotent (use `clientMutationId` or `clientId`)

**Bulk Operations**: Accept arrays and return per-item result with status + conflict info

## GraphQL API Specification

### Sync Pull
```graphql
type Query {
  syncPull(entity: String!, since: DateTime, limit: Int = 1000): SyncPullResponse!
}

type SyncPullResponse {
  items: [JSON!]!
  lastSyncAt: DateTime!
  hasMore: Boolean!
}
```

### Sync Push
```graphql
type Mutation {
  syncPush(entity: String!, items: [JSON!]!): [SyncResultItem!]!
}

type SyncResultItem {
  clientId: String
  id: ID
  success: Boolean!
  errorCode: String
  errorMessage: String
  conflict: ConflictPayload
  version: Int
  updatedAt: DateTime
}

type ConflictPayload {
  serverData: JSON
  clientData: JSON
  serverVersion: Int
  resolutionSuggested: JSON
}
```

## Local DB Schema (WatermelonDB)

### Core Tables

1. **Entity tables** (e.g., `spaces`, `users`, etc.)
   - Fields: `id`, `client_id`, `version`, `updated_at`, `is_deleted`, plus entity-specific fields

2. **`outbox`** (mutation queue)
   - Fields: `id`, `entity`, `payload` (JSON), `status` (pending/sending/failed/success), `attempts`, `lastError`, `createdAt`, `updatedAt`

3. **`uploads`** (media queue)
   - Fields: `id`, `localPath`, `remoteUrl`, `status`, `attempts`, `meta`

## Task Tracking System

All epics and tasks use the following status tags:

- `TODO[]` - Pending task
- `TODO[x]` - Completed task ✅
- `IN_PROGRESS[]` - Task in progress
- `FIXME[]` - Code that needs fixing
- `BUG[]` - Known bug
- `NOTE` - Important information
- `URGENT[]` - High priority task
- `SECURITY[]` - Security-related issue
- `FEATURE[]` - New feature request

## Current Progress Summary

### ✅ Completed (Backend Foundation)

**Data Conventions & Schema:**
- ✅ Global data conventions defined (clientId, version, updatedAt, isDeleted)
- ✅ CrtBaseEntity updated with Offline-First fields
- ✅ All Prisma base-fields.prisma files updated (3 services: core, user, sample)
- ✅ All proto files updated (8 entity messages: Space, Group, SocialUser, Social, ConfigCrt x2, Hero, Company)
- ✅ Generate model scripts updated (3 services)

**Backend Repository Logic:**
- ✅ Auto-increment `version` in `updateOne` method (server-controlled)
- ✅ Auto-increment `version` in `deleteOne` method (soft delete)
- ✅ Always set `updatedAt` to server time (override client timestamps)
- ✅ Default `version = 1` for new entities in `createOne`
- ✅ Idempotent create operations via `clientId` (find existing entity by clientId)
- ✅ `findOneByClientId` method added (repository and service layers)

### ⏳ In Progress / Pending

**Backend:**
- ⏳ GraphQL syncPull endpoint implementation
- ⏳ GraphQL syncPush endpoint implementation
- ⏳ Database migrations for clientId and version columns
- ⏳ Database indexes for performance

**Mobile (React Native):**
- ⏳ WatermelonDB setup and configuration
- ⏳ Outbox manager implementation
- ⏳ Sync worker implementation
- ⏳ Network detection
- ⏳ Client sync pull/push logic

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

## Testing Matrix

### Critical Test Scenarios

- ✅ **Airplane mode**: Create/update/delete flows, then restore connectivity
- ✅ **Partial sync**: Fail batch mid-way and resume
- ✅ **Conflict cases**: Client and server changed same field
- ✅ **Media upload**: Offline add photo, then sync
- ✅ **Network flakiness**: Switch wifi/4G frequently
- ✅ **Large batch**: 10k local changes sync test
- ✅ **App lifecycle**: Device rotation, app kills mid-sync, background/foreground resume
- ✅ **Schema migration**: Schema change test
- ✅ **Multiple devices**: Same user across devices change same entity

## Related Documentation

- [Mobile Architecture](../mobile/architecture.md)
- [Data Strategy](../data-strategy.md)
- [Security Documentation](../security.md)
- [Tech Stack](../tech-stack.md)
- [Architecture Documentation](../architecture.md)

## Quick Reference

### Common Patterns

**Enqueue Mutation**:
```typescript
const clientId = await enqueueMutation('Space', {
  name: 'My Space',
  description: 'Created offline',
});
```

**Sync Pull**:
```typescript
await syncPull('Space');
```

**Sync Push**:
```typescript
await syncPush(); // Processes all pending outbox items
```

### Key Metrics to Monitor

- Queue size (outbox length) per user/device
- Avg sync latency (push/pull)
- Conflict rate (%) per domain
- Failed attempts / retry counts
- DB size on device
- Last successful sync time
- Upload success/fail rate

