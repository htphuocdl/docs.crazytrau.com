---
id: offline-first-index
title: "Offline-First Architecture Index"
sidebar_label: "Offline-First"
---

# Offline-First Architecture

This section contains detailed epic breakdown, task tracking, checklists, and acceptance criteria for the Offline-First Super App implementation with GraphQL CRUD.

## Epic Overview

**Status**: `IN_PROGRESS[]` (Backend GraphQL Endpoints + Frontend GraphQL Service + OfflineFirstSpaceService + Shared SyncService Completed for Space)  
**Priority**: `URGENT[]` (High)  
**Epic ID**: `EPIC-OFFLINE-001`  
**Progress**: ~75% (Backend foundation + Frontend SDK foundation + GraphQL sync endpoints + Phase 0 Mobile + Phase 1 Backend/Frontend GraphQL + OfflineFirstSpaceService + Shared SyncService + OperationQueue + Atomic Sync + Force Sync + Online Direct Create completed)

Comprehensive offline-first architecture implementation for the trackhub super app ecosystem using GraphQL CRUD with local-first data synchronization.

📖 [View Epic Overview](./offline-first-epic.md)

## Architecture Summary

**Source of Truth (Client)**: Local DB (WatermelonDB on React Native) - **One DB per tenant**  
**Server**: GraphQL CRUD + bulk sync endpoints (pull/push)  
**Sync Pattern**: Operation Queue (client) + Atomic two-way sync (push before pull) + Incremental pull (since timestamp/version hash)  
**Conflict Strategy**: Timestamp-based auto-resolve (server newer → server wins, local newer → local wins, equal → user choose)  
**Tenant Isolation**: Strict separation - each tenant has separate WatermelonDB instance  
**Media/Files**: Separate upload (multipart / signed URL) via background uploader queue

📖 [View Detailed Architecture Design](./offline-first-architecture.md)

## Phases

### Phase 0: Foundation
**Status**: `TODO[x]` ✅ (Completed - All tasks implemented)  
**Estimated**: 2-3 weeks  
**Dependencies**: None

Establish foundational infrastructure: local database setup, data conventions, outbox system, and network detection.

📖 [View Phase 0 Details](./offline-first-phase-0-foundation.md)

**Key Deliverables**:
- ✅ WatermelonDB setup with encryption key management (✅ Completed)
- ✅ Base schema definitions (✅ OperationQueue, Upload, SyncState tables)
- ✅ Operation queue manager API (✅ OperationQueueService with full CRUD)
- ✅ Network detection system (✅ NetworkService with debouncing)
- ✅ Sync worker skeleton (✅ SyncWorker with polling and lifecycle)
- ✅ UUID v7 client ID generation (✅ entityDefaults.ts updated with UUID v7 support)
- ⏳ Multi-tenant DB isolation (Pending - needs per-tenant DB instances)

**Completed**:
- ✅ BE-0.1: Global Data Conventions defined and implemented (Backend)
- ✅ RN-0.0: Frontend SDK Types and Services updated (Frontend)
- ✅ RN-0.1: WatermelonDB Infrastructure setup (✅ Database, schema, models)
- ✅ RN-0.2: Base Schema Structure (✅ Outbox, Upload, SyncState)
- ✅ RN-0.3: Outbox Manager API (✅ OutboxService with full functionality)
- ✅ RN-0.4: Network Detection (✅ NetworkService with debouncing)
- ✅ RN-0.5: Sync Worker Skeleton (✅ SyncWorker with polling)

---

### Phase 1: Basic Sync
**Status**: `IN_PROGRESS[]` (Backend GraphQL endpoints ✅ + Frontend GraphQL service ✅ + OfflineFirstSpaceService ✅ + Shared SyncService ✅ + Atomic Sync ✅ + Force Sync ✅ + Online Direct Create ✅ completed for Space)  
**Estimated**: 3-4 weeks  
**Dependencies**: Phase 0 completed

Implement core sync functionality: GraphQL sync endpoints, client pull/push logic, and basic conflict handling.

📖 [View Phase 1 Details](./offline-first-phase-1-basic-sync.md)

**Key Deliverables**:
- ✅ GraphQL syncPull and syncPush endpoints (✅ Completed for Space entity)
- ✅ Frontend GraphQL service sync methods (✅ syncPush and syncPull implemented)
- ✅ Client sync pull implementation (✅ OfflineFirstSpaceService.syncPull implemented)
- ✅ Client sync push implementation (✅ OfflineFirstSpaceService.syncPush implemented)
- ✅ Atomic two-way sync (push → clear queue → pull → merge) (✅ OfflineFirstSpaceService.syncAll implemented)
- ✅ Shared SyncService for reuse (✅ SyncService class created)
- ✅ OperationQueue service (✅ OperationQueueService created, replaces outbox)
- ⏳ Client sync push batching (Pending - SyncWorker integration)
- ⏳ Basic sync worker integration (Pending - SyncWorker needs to call syncAll)
- ✅ Optimistic UI updates (✅ OfflineFirstSpaceService provides instant local updates)
- ✅ Force sync from server (✅ OfflineFirstSpaceService.forceSyncFromServer implemented)
- ✅ Force push local (✅ OfflineFirstSpaceService.forcePushLocal implemented)
- ✅ Online direct create (✅ OfflineFirstSpaceService.createSpace with online/offline logic)
- ✅ UUID v7 client ID generation (✅ entityDefaults.ts updated with UUID v7 support)

**Completed**:
- ✅ BE-1.3: Versioning & Timestamp Management implemented
- ✅ BE-1.2: Backend repository logic for syncPush ready (version increment, clientId handling, idempotency)
- ✅ BE-1.1: GraphQL syncPull endpoint implemented (Base controller + Space resolver)
- ✅ BE-1.2: GraphQL syncPush endpoint implemented (Base controller + Space resolver)
- ✅ Frontend: GraphQLSpaceService syncPush and syncPull methods
- ✅ Frontend: SpaceService interface updated with sync methods
- ✅ Mobile: OfflineFirstSpaceService implemented (WatermelonDB + Outbox integration)
- ✅ Mobile: syncPull logic implemented (applies server changes to local DB)
- ✅ Mobile: syncPush logic implemented (maps clientId to serverId)
- ✅ Mobile: UI components updated to use offline-first service

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
   - Fields: `id` (server UUID), `client_id` (UUID v7 for offline creates), `version`, `updated_at`, `is_deleted`, plus entity-specific fields
   - **Tenant isolation**: Each tenant has separate DB instance (`trackhub_db_{tenantId}`)

2. **`operation_queue`** (mutation queue - replaces outbox)
   - Fields: `id`, `entity`, `operation` (insert/update/delete), `entity_id`, `payload` (JSON), `status` (pending/sending/failed/success), `attempts`, `last_error`, `created_at`, `updated_at`

3. **`sync_state`** (sync metadata per entity)
   - Fields: `entity`, `lastSyncAt`, `serverVersionHash`, `updatedAt`

4. **`uploads`** (media queue)
   - Fields: `id`, `localPath`, `remoteUrl`, `status`, `attempts`, `meta`

5. **`conflicts`** (conflict records for user resolution)
   - Fields: `id`, `entity`, `entity_id`, `local_data`, `server_data`, `local_version`, `server_version`, `conflict_type`, `resolved`, `created_at`

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

## Implementation Planning Status

### 📋 Documentation Status

**Phase 0 (Foundation)**:
- ✅ Basic task breakdown completed
- ✅ **Enhanced with detailed implementation guidance** (WatermelonDB setup, schema definition, outbox manager)
- ✅ Code examples and patterns added

**Phase 1 (Basic Sync)**:
- ✅ Basic task breakdown completed
- ✅ **Enhanced with detailed implementation guidance** (GraphQL syncPull/syncPush endpoints)
- ✅ Code examples for NestJS/Prisma implementation added

**Phase 2-4**:
- ✅ Basic task breakdown completed
- ⏳ Implementation details pending (will be added as implementation progresses)

## Current Progress Summary

### ✅ Completed (Backend + Frontend SDK Foundation)

**Backend - Data Conventions & Schema:**
- ✅ Global data conventions defined (clientId, version, updatedAt, isDeleted)
- ✅ CrtBaseEntity updated with Offline-First fields
- ✅ All Prisma base-fields.prisma files updated (3 services: core, user, sample)
- ✅ All proto files updated (8 entity messages: Space, Group, SocialUser, Social, ConfigCrt x2, Hero, Company)
- ✅ Generate model scripts updated (3 services)

**Backend - Repository Logic:**
- ✅ Auto-increment `version` in `updateOne` method (server-controlled)
- ✅ Auto-increment `version` in `deleteOne` method (soft delete)
- ✅ Always set `updatedAt` to server time (override client timestamps)
- ✅ Default `version = 1` for new entities in `createOne`
- ✅ Idempotent create operations via `clientId` (find existing entity by clientId)
- ✅ `findOneByClientId` method added (repository and service layers)

**Frontend SDK - Types & Interfaces:**
- ✅ `CrtBaseEntity` interface updated with `_clientId?: string` and `_version?: number`
- ✅ `ICrtBaseService` interface updated to support `_clientId` in `addItem()`
- ✅ Entity defaults utility created (`packages/sdk/src/utils/entityDefaults.ts`):
  - `generateClientId()`: Generates temporary client IDs
  - `getDefaultEntityValues()`: Returns defaults including `_clientId` and `_version: 1`
  - `createEntityWithDefaults()`: Helper for creating entities

**Frontend SDK - LocalServices Updates (9 services across 5 packages):**
- ✅ `coreCrt`: LocalSpaceService, LocalGroupService, LocalIdentityService, LocalConfigCrtService
- ✅ `checklist`: LocalChecklistService
- ✅ `auth`: LocalSpaceService
- ✅ `sampleCrt`: LocalIdentityService, LocalConfigCrtService
- ✅ `keezy`: LocalIdentityService
- ✅ All create operations: Auto-generate `_clientId` and set `_version: 1`
- ✅ All update operations: Auto-increment `_version` (currentVersion + 1)
- ✅ All delete/softDelete/restore operations: Auto-increment `_version`
- ✅ Toggle operations: Auto-increment `_version`
- ✅ Parent version increments when adding child items

### ⏳ In Progress / Pending

**Backend:**
- ✅ syncPush base layer implementation completed (internal-repo.ts + internal-service.ts)
- ✅ GraphQL syncPull endpoint implementation (Base controller + Space resolver)
- ✅ GraphQL syncPush resolver implementation (Base controller + Space resolver)
- ✅ Frontend GraphQL service sync methods (GraphQLSpaceService)
- ⏳ Database migrations for clientId and version columns (if needed)
- ⏳ Database indexes for performance (updatedAt, version columns)
- ⏳ Extend sync endpoints to other entities (currently Space only)

**Mobile (React Native):**
- ✅ WatermelonDB setup and configuration (Phase 0 completed)
- ✅ Outbox manager implementation (Phase 0 completed)
- ✅ Sync worker skeleton (Phase 0 completed)
- ✅ Network detection (Phase 0 completed)
- ⏳ Client sync pull/push logic integration (Phase 1 - integrate GraphQL service with WatermelonDB)

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
- ✅ **Conflict cases**: Client and server changed same field (timestamp-based resolution)
- ✅ **Media upload**: Offline add photo, then sync
- ✅ **Network flakiness**: Switch wifi/4G frequently
- ✅ **Large batch**: 10k local changes sync test
- ✅ **App lifecycle**: Device rotation, app kills mid-sync, background/foreground resume
- ✅ **Schema migration**: Schema change test
- ✅ **Multiple devices**: Same user across devices change same entity
- ⏳ **Multi-tenant isolation**: 2 tenants sync separately, no cross-tenant data leak
- ⏳ **Force sync**: Force from server overwrites local, force push local overrides server
- ⏳ **Online direct create**: Online creates get server ID immediately
- ⏳ **UUID v7**: Offline creates use UUID v7 (not random numeric)

## Related Documentation

- 📖 [**Architecture Design**](./offline-first-architecture.md) - **START HERE** - Comprehensive architecture specification
- [Epic Overview](./offline-first-epic.md) - High-level epic breakdown
- [Phase 0: Foundation](./offline-first-phase-0-foundation.md) - Foundation setup tasks
- [Phase 1: Basic Sync](./offline-first-phase-1-basic-sync.md) - Core sync implementation
- [Phase 2: Robustness](./offline-first-phase-2-robustness.md) - Conflict resolution & reliability
- [Phase 3: UX & QA](./offline-first-phase-3-ux-qa.md) - User experience & testing
- [Phase 4: Performance & Monitoring](./offline-first-phase-4-performance-monitoring.md) - Monitoring & optimization
- [Mobile Architecture](../mobile/architecture.md)
- [Data Strategy](../data-strategy.md)
- [Security Documentation](../security.md)
- [Tech Stack](../tech-stack.md)
- [Architecture Documentation](../architecture.md)

## Quick Reference

### Common Patterns

**Create Entity (Online)**:
```typescript
// If online: Direct GraphQL call, get server ID
const serverId = await createEntity('Space', { name: 'My Space' });
```

**Create Entity (Offline)**:
```typescript
// If offline: Generate UUID v7, queue operation
const clientId = await createEntity('Space', { name: 'My Space' });
// clientId is UUID v7, will be mapped to server ID on sync
```

**Atomic Two-Way Sync**:
```typescript
// Push → Clear queue → Pull → Merge
await syncService.syncAll('Space');
```

**Force Sync from Server**:
```typescript
// Skip push, pull all, replace local (with user confirmation)
await syncService.forceSyncFromServer('Space');
```

**Force Push Local**:
```typescript
// Push all local changes, override server (with user confirmation)
await syncService.forcePushLocal('Space');
```

### Key Metrics to Monitor

- Queue size (outbox length) per user/device
- Avg sync latency (push/pull)
- Conflict rate (%) per domain
- Failed attempts / retry counts
- DB size on device
- Last successful sync time
- Upload success/fail rate

