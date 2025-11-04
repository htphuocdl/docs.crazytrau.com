---
id: offline-first-phase-1
title: "Phase 1: Basic Sync"
sidebar_label: "Phase 1: Basic Sync"
---

# Phase 1: Basic Sync

**Status**: `TODO[]`  
**Phase ID**: `EPIC-OFFLINE-001-P1`  
**Dependencies**: Phase 0 completed  
**Estimated Effort**: 3-4 weeks  
**Owner**: TBD

## Overview

Implement the core sync functionality: GraphQL sync endpoints on backend, client pull/push logic, and basic conflict handling. This phase establishes the fundamental sync mechanism.

## Objectives

- Implement GraphQL `syncPull` and `syncPush` endpoints
- Create client sync pull logic with lastSyncAt persistence
- Implement client push batching and basic retry
- Handle basic clientId to server id mapping
- Test end-to-end sync flow

## Tasks

### BE-1.1: Implement GraphQL syncPull Endpoint

**Status**: `TODO[]`  
**Owner**: Backend Team Lead  
**Effort**: 5 days

**Description**: Create GraphQL query endpoint for incremental pull of changes since last sync.

**Checklist**:
- [ ] Define `SyncPullResponse` type in GraphQL schema
- [ ] Implement `syncPull` query resolver
- [ ] Add `since` parameter (DateTime) for incremental pull
- [ ] Add `limit` parameter (default 1000) for pagination
- [ ] Optimize query with indexes on `updatedAt` and `version`
- [ ] Return `lastSyncAt` (server timestamp)
- [ ] Return `hasMore` flag for pagination
- [ ] Support multiple entity types via `entity` parameter
- [ ] Add authorization checks
- [ ] Write unit tests

**Acceptance Criteria**:
- Returns only changes since `since` timestamp
- Respects `limit` parameter
- Returns `hasMore` correctly
- Includes `lastSyncAt` server timestamp
- Query performance < 500ms for 1000 items (p95)

**GraphQL Schema**:
```graphql
type Query {
  syncPull(entity: String!, since: DateTime, limit: Int = 1000): SyncPullResponse!
}

type SyncPullResponse {
  items: [JSON!]!   # Array of entity objects (server canonical shape)
  lastSyncAt: DateTime!  # Server time marker to save locally
  hasMore: Boolean!
}
```

**Technical Notes**:
- Use database indexes on `updatedAt` and `version`
- Consider using change feed / CDC if available
- Filter out soft-deleted items based on `isDeleted` flag

---

### BE-1.2: Implement GraphQL syncPush Endpoint

**Status**: `TODO[]` (Partial - Backend logic ready)  
**Owner**: Backend Team Lead  
**Effort**: 6 days

**Description**: Create GraphQL mutation endpoint for bulk push of client changes.

**Checklist**:
- [ ] Define `SyncResultItem` and `SyncPushInput` types
- [ ] Implement `syncPush` mutation resolver
- [ ] Accept array of items as JSON
- [ ] Validate entity type via `entity` parameter
- [ ] Process items in batch (transactional where possible)
- [x] Map `clientId` to server `id` for new entities (✅ Implemented in createOne)
- [x] Increment `version` on updates (✅ Implemented in updateOne)
- [x] Update `updatedAt` with server timestamp (✅ Implemented in updateOne)
- [ ] Return per-item `SyncResultItem` with success/error
- [x] Handle idempotency (dedupe by `clientId` or `clientMutationId`) (✅ Implemented in createOne)
- [ ] Add authorization checks (validate ownership)
- [ ] Write unit tests

**Acceptance Criteria**:
- [ ] Accepts array of items successfully
- [ ] Returns per-item status
- ✅ Maps `clientId` → `id` correctly (createOne handles clientId lookup)
- ✅ Handles idempotency (no duplicates) (createOne checks for existing clientId)
- [ ] Batch processing < 2s for 100 items (p95)

**Partial Completion**:
- ✅ `createOne` method handles `clientId` for idempotent creates (finds existing entity by clientId)
- ✅ `updateOne` method auto-increments `version` and sets `updatedAt` to server time
- ✅ `findOneByClientId` method added to repository and service layers
- ✅ `deleteOne` method increments `version` on soft delete
- ⏳ GraphQL endpoint implementation pending (BE-1.2 remaining work)

**GraphQL Schema**:
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
  version: Int
  updatedAt: DateTime
}

input SyncPushInput {
  entity: String!
  items: [JSON!]!
}
```

**Example Payload**:
```json
{
  "entity": "Space",
  "items": [
    {
      "clientId": "tmp-12345",
      "name": "My Offline Space",
      "description": "Created while offline",
      "version": 0,
      "updatedAt": "2025-11-05T09:12:00Z",
      "isDeleted": false
    }
  ]
}
```

---

### BE-1.3: Versioning & Timestamp Management

**Status**: `TODO[x]` ✅  
**Owner**: Backend Team Lead  
**Effort**: 3 days

**Description**: Ensure every update increments version and updates updatedAt with server time.

**Checklist**:
- [x] Add database triggers or middleware to auto-increment `version` (Implemented in internal-repo.ts)
- [x] Ensure `updatedAt` always uses server timestamp (UTC) (Implemented in internal-repo.ts)
- [x] Provide transactional guarantees for bulk operations (Prisma handles this)
- [ ] Add database constraints for version integrity
- [ ] Write tests for version incrementing

**Acceptance Criteria**:
- ✅ Every update increments version (auto-increment in updateOne/deleteOne)
- ✅ `updatedAt` always reflects server time (not client time) (server time enforced)
- ✅ Bulk operations maintain version consistency (Prisma transactions)
- ✅ No version conflicts within same transaction (server controls version)

**Completed**:
- ✅ Auto-increment `version` in `updateOne` method (reads current version, increments by 1)
- ✅ Auto-increment `version` in `deleteOne` method (soft delete also increments version)
- ✅ Always set `updatedAt` to server time in `updateOne` (overrides client-provided timestamp)
- ✅ Always set `updatedAt` in `createOne` if not provided
- ✅ Default `version = 1` for new entities in `createOne`

---

### RN-1.1: Implement syncPull Logic

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 5 days

**Description**: Implement client-side logic to pull changes from server and apply to local DB.

**Checklist**:
- [ ] Create `syncPull` function that calls GraphQL query
- [ ] Persist `lastSyncAt` per entity in secure storage
- [ ] Implement logic to apply server items to local DB
- [ ] Handle version comparison (server.version > local.version → update)
- [ ] Handle new items (insert)
- [ ] Handle soft-deleted items (update isDeleted flag)
- [ ] Wrap apply logic in DB transaction
- [ ] Update `lastSyncAt` after successful apply
- [ ] Handle pagination (if `hasMore` is true, continue pulling)
- [ ] Add error handling and retry logic
- [ ] Write unit tests

**Acceptance Criteria**:
- Pulls changes since last sync correctly
- Applies server changes to local DB
- Updates `lastSyncAt` after success
- Handles pagination
- No data loss during apply

**Pseudocode**:
```typescript
async function syncPull(entity: string) {
  const lastSyncAt = await getLastSyncAt(entity);
  const response = await graphql.syncPull({
    entity,
    since: lastSyncAt,
    limit: 1000,
  });
  
  await db.write(async () => {
    for (const item of response.items) {
      const existing = await db.collections.get(entity).find(item.id);
      if (existing) {
        if (item.version > existing.version) {
          await existing.update(record => {
            // Apply server version
            Object.assign(record, item);
          });
        }
      } else {
        await db.collections.get(entity).create(record => {
          Object.assign(record, item);
        });
      }
    }
  });
  
  await saveLastSyncAt(entity, response.lastSyncAt);
  
  if (response.hasMore) {
    await syncPull(entity); // Continue pulling
  }
}
```

---

### RN-1.2: Implement syncPush Batching

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 6 days

**Description**: Implement client-side logic to batch push outbox items to server.

**Checklist**:
- [ ] Create `syncPush` function that calls GraphQL mutation
- [ ] Group outbox items by entity
- [ ] Batch items (max 100 per request, configurable)
- [ ] Parse and handle per-item response
- [ ] Update local DB with server `id` and `version` on success
- [ ] Mark outbox items as success/failed
- [ ] Handle partial failures (retry only failed items)
- [ ] Implement basic retry logic (exponential backoff)
- [ ] Log push attempts and results
- [ ] Write unit tests

**Acceptance Criteria**:
- Batches items correctly (max 100 per batch)
- Maps `clientId` → server `id` correctly
- Updates local DB with server data on success
- Handles partial failures
- Retries failed items

**Pseudocode**:
```typescript
async function syncPush() {
  if (!isOnline()) return;
  
  const pending = await db.collections.get('outbox')
    .query(Q.where('status', 'pending'))
    .fetch();
  
  const batches = groupByEntityAndChunk(pending, 100);
  
  for (const batch of batches) {
    const items = batch.items.map(item => JSON.parse(item.payload));
    const response = await graphql.syncPush({
      entity: batch.entity,
      items,
    });
    
    await db.write(async () => {
      for (let i = 0; i < response.length; i++) {
        const result = response[i];
        const outboxItem = batch.items[i];
        
        if (result.success) {
          // Update local entity with server id/version
          await updateLocalEntity(batch.entity, result);
          // Mark outbox as success
          await outboxItem.update(record => {
            record.status = 'success';
          });
        } else {
          // Mark outbox as failed
          await outboxItem.update(record => {
            record.status = 'failed';
            record.lastError = result.errorMessage;
            record.attempts += 1;
          });
        }
      }
    });
  }
}
```

---

### RN-1.3: Integrate Sync Worker with Pull/Push

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 4 days

**Description**: Integrate sync pull and push into the sync worker.

**Checklist**:
- [ ] Add `syncPull` call to worker (periodic or after push)
- [ ] Add `syncPush` call to worker (when outbox has items)
- [ ] Implement sync scheduling (on app resume, periodic, after mutations)
- [ ] Add sync state management (syncing, idle, error)
- [ ] Handle concurrent sync attempts (prevent duplicate syncs)
- [ ] Add sync progress tracking
- [ ] Write integration tests

**Acceptance Criteria**:
- Worker triggers sync pull periodically
- Worker triggers sync push when outbox has items
- No duplicate syncs running concurrently
- Sync state is accurately tracked

---

### RN-1.4: Basic Optimistic UI Updates

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 3 days

**Description**: Implement optimistic UI updates so changes appear instantly.

**Checklist**:
- [ ] Update UI immediately after local DB write
- [ ] Use WatermelonDB observables for reactive UI
- [ ] Show subtle "syncing" indicator
- [ ] Handle sync errors gracefully (show error, allow retry)
- [ ] Test optimistic updates work correctly

**Acceptance Criteria**:
- UI updates instantly on local changes
- Users see sync status
- Errors are handled gracefully

---

## Testing Requirements

### Unit Tests
- [ ] syncPull logic
- [ ] syncPush batching
- [ ] Version comparison logic
- [ ] clientId mapping
- [ ] lastSyncAt persistence

### Integration Tests
- [ ] End-to-end sync flow (create offline → sync → verify)
- [ ] Batch push with partial failures
- [ ] Pagination in syncPull
- [ ] Concurrent sync prevention

### E2E Tests
- [ ] Create entity offline → go online → sync → verify on server
- [ ] Update entity offline → go online → sync → verify
- [ ] Delete entity offline → go online → sync → verify

## Deliverables

1. ✅ GraphQL syncPull and syncPush endpoints
2. ✅ Client sync pull implementation
3. ✅ Client sync push batching
4. ✅ Basic sync worker integration
5. ✅ Optimistic UI updates
6. ✅ Basic retry logic

## Dependencies

**Blocking**:
- Phase 0 (Foundation) must be completed

**Blocked By**:
- Phase 2 (Robustness) depends on this phase

## Risks

| Risk | Mitigation |
|------|------------|
| Performance issues with large batches | Limit batch size, optimize queries |
| Version conflicts | Implement conflict detection in Phase 2 |
| Network timeouts | Implement retry with exponential backoff |

## Success Criteria

- [ ] All tasks completed
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] Basic sync flow works end-to-end
- [ ] Ready for Phase 2

