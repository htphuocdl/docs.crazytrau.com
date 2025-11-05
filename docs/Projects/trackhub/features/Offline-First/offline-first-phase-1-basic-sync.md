---
id: offline-first-phase-1
title: "Phase 1: Basic Sync"
sidebar_label: "Phase 1: Basic Sync"
---

# Phase 1: Basic Sync

**Status**: `IN_PROGRESS[]` (Backend GraphQL endpoints completed ✅ for Space entity, Frontend GraphQL service ready ✅)  
**Phase ID**: `EPIC-OFFLINE-001-P1`  
**Dependencies**: Phase 0 completed  
**Estimated Effort**: 3-4 weeks  
**Owner**: TBD

## Overview

Implement the core sync functionality: GraphQL sync endpoints on backend, client pull/push logic, and basic conflict handling. This phase establishes the fundamental sync mechanism.

**Progress**: ~60% (Backend GraphQL endpoints + Frontend GraphQL service completed for Space entity)

## Objectives

- Implement GraphQL `syncPull` and `syncPush` endpoints
- Create client sync pull logic with lastSyncAt persistence
- Implement client push batching and basic retry
- Handle basic clientId to server id mapping
- Test end-to-end sync flow

## Tasks

### BE-1.1: Implement GraphQL syncPull Endpoint

**Status**: `TODO[x]` ✅ (Completed for Space entity)  
**Owner**: Backend Team Lead  
**Effort**: 5 days

**Description**: Create GraphQL query endpoint for incremental pull of changes since last sync.

**Checklist**:
- [x] Define `SyncPullResponse` type in GraphQL schema (✅ Defined in Space controller)
- [x] Implement `syncPull` query resolver (✅ Base controller + Space resolver)
- [x] Add `since` parameter (DateTime) for incremental pull (✅ Implemented)
- [x] Add `limit` parameter (default 1000) for pagination (✅ Implemented)
- [ ] Optimize query with indexes on `updatedAt` and `version` (Pending - database indexes)
- [x] Return `lastSyncAt` (server timestamp) (✅ Implemented)
- [x] Return `hasMore` flag for pagination (✅ Implemented)
- [x] Support multiple entity types via `entity` parameter (✅ Base controller supports all entities)
- [x] Add authorization checks (✅ Uses getCallerByCtx for role-based access)
- [ ] Write unit tests (Pending)

**Acceptance Criteria**:
- ✅ Returns only changes since `since` timestamp (Implemented)
- ✅ Respects `limit` parameter (Implemented)
- ✅ Returns `hasMore` correctly (Implemented)
- ✅ Includes `lastSyncAt` server timestamp (Implemented)
- ⏳ Query performance < 500ms for 1000 items (p95) (Needs performance testing with indexes)

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

**Implementation Details**:

1. **GraphQL Schema Definition**:
   - Add to `backend/libs/gw.graphql/src/prisma/schema.graphql` or create custom resolver
   - Use `@nestjs/graphql` decorators for type definitions
   - Consider using `GraphQLJSON` scalar type for `items: [JSON!]!`

2. **Resolver Implementation**:
   - Create custom resolver: `backend/apps/crt.svc.core/src/sync/sync-pull.resolver.ts`
   - Use NestJS `@Query()` decorator
   - Inject repository service for entity access
   - Implement entity type routing (e.g., "Space" → SpaceRepository)

3. **Query Logic**:
   ```typescript
   @Query(() => SyncPullResponse)
   async syncPull(
     @Args('entity') entity: string,
     @Args('since', { nullable: true, type: () => Date }) since?: Date,
     @Args('limit', { defaultValue: 1000 }) limit: number,
     @Context() ctx: any,
   ): Promise<SyncPullResponse> {
     // 1. Get repository for entity type
     const repo = this.getRepositoryForEntity(entity);
     
     // 2. Query with filters: updatedAt > since, limit, order by updatedAt
     const items = await repo.findMany({
       where: {
         updatedAt: since ? { gt: since } : undefined,
         // Filter soft-deleted if needed
       },
       take: limit + 1, // Fetch one extra to check hasMore
       orderBy: { updatedAt: 'asc' },
     });
     
     // 3. Check hasMore
     const hasMore = items.length > limit;
     const resultItems = hasMore ? items.slice(0, limit) : items;
     
     // 4. Return response with server timestamp
     return {
       items: resultItems,
       lastSyncAt: new Date(), // Server time
       hasMore,
     };
   }
   ```

4. **Database Indexes**:
   - Ensure indexes exist on `updatedAt` and `version` columns
   - Add migration if needed: `CREATE INDEX idx_entity_updated_at ON table_name(_updatedAt)`

5. **Authorization**:
   - Use existing auth guards (e.g., `@UseGuards(JwtAuthGuard)`)
   - Filter by user context (spaceId, tenantId, etc.)
   - Validate entity access permissions

---

### BE-1.2: Implement GraphQL syncPush Endpoint

**Status**: `TODO[x]` ✅ (Completed for Space entity - Base layer + GraphQL resolver)  
**Owner**: Backend Team Lead  
**Effort**: 6 days

**Description**: Create GraphQL mutation endpoint for bulk push of client changes.

**Checklist**:
- [x] Define `SyncResultItem` interface (✅ Implemented in Space controller)
- [x] Implement `syncPush` mutation resolver (GraphQL layer) (✅ Space resolver implemented)
- [x] Accept array of items as JSON (✅ Base layer + GraphQL resolver)
- [x] Validate entity type via `entity` parameter (✅ Entity-specific resolvers)
- [x] Process items in batch (transactional where possible) (✅ Implemented in base layer)
- [x] Map `clientId` to server `id` for new entities (✅ Implemented in syncPush)
- [x] Increment `version` on updates (✅ Implemented in syncPush via caller)
- [x] Update `updatedAt` with server timestamp (✅ Implemented in syncPush via caller)
- [x] Return per-item `SyncResultItem` with success/error (✅ Implemented in base layer)
- [x] Handle idempotency (dedupe by `clientId`) (✅ Implemented in syncPush)
- [x] Handle soft delete operations (✅ Implemented in syncPush)
- [x] Add authorization checks (validate ownership) (✅ Uses getCallerByCtx for role-based access)
- [ ] Write unit tests (Pending)

**Acceptance Criteria**:
- ✅ Base layer accepts array of items successfully (syncPush method implemented)
- ✅ Returns per-item status (SyncResultItem interface and return)
- ✅ Maps `clientId` → `id` correctly (syncPush handles clientId via caller createOne)
- ✅ Handles idempotency (no duplicates) (via caller createOne which checks existing)
- ✅ Handles create, update, and delete operations (All three implemented via caller methods)
- ✅ GraphQL endpoint exposes syncPush (Space resolver implemented)
- ⏳ Batch processing < 2s for 100 items (p95) (Needs performance testing)

**Completed Base Layer Implementation**:
- ✅ `syncPush` method added to `internal-repo.ts`:
  - Processes multiple items in single transaction
  - Handles create (via clientId), update (via id), and delete (via isDeleted flag)
  - Auto-increments version on updates and deletes
  - Sets updatedAt to server time
  - Returns per-item SyncResultItem with success/error
  - Handles idempotency for creates (checks existing by clientId)
- ✅ `syncPush` method added to `internal-service.ts`:
  - Wraps repository syncPush method
  - Sets request context
- ✅ `SyncResultItem` interface exported from base layer
- ✅ All items processed in transaction for atomicity
- ✅ Error handling per-item (continues processing on error)

**Completed GraphQL Layer Implementation**:
- ✅ Base controller `syncPush` method implemented (uses caller CRUD methods - createOne/updateOne/deleteOne)
- ✅ Base controller `syncPull` method implemented (uses caller get method with updatedAt filter)
- ✅ Space controller `syncPush_` GraphQL mutation resolver (wired to base method)
- ✅ Space controller `syncPull_` GraphQL query resolver (wired to base method)
- ✅ Authorization via `getCallerByCtx` (role-based access control)
- ✅ Frontend GraphQL service methods added (`syncPush` and `syncPull`)
- ✅ Frontend GraphQL queries/mutations defined (SYNC_PUSH_SPACE, SYNC_PULL_SPACE)
- ✅ SpaceService interface updated with sync methods

**Implementation Note**: The syncPush implementation uses the existing caller CRUD methods (createOne, updateOne, deleteOne) rather than directly accessing the repository layer. This ensures:
- Proper authorization and role-based access control
- Consistent error handling and logging
- Version management via caller methods
- Compatibility with the existing architecture

**Remaining Work**:
- ⏳ Database indexes for performance optimization
- ⏳ Unit tests for sync operations
- ⏳ Extend to other entities (currently implemented for Space)

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

**Implementation Details**:

**✅ Base Layer Implementation (Completed)**:
- Location: `backend/libs/crt.lib.common/src/common/base/internal-repo.ts`
- Method: `syncPush(items: any[], ctx: IInternalPrismaRepo): Promise<SyncResultItem[]>`
- Service wrapper: `backend/libs/crt.lib.common/src/common/base/internal-service.ts`
- Features:
  - Processes all items in single Prisma transaction
  - Handles create (via clientId), update (via id), and delete (via isDeleted)
  - Auto-increments version and sets server timestamps
  - Returns per-item SyncResultItem with success/error
  - Idempotent creates (checks existing by clientId)
  - Error handling per-item (continues on error)

**⏳ GraphQL Layer Implementation (Pending)**:

1. **GraphQL Schema Definition**:
   - Add to GraphQL schema with `@nestjs/graphql` decorators
   - Use `GraphQLJSON` scalar for flexible item payloads
   - Import `SyncResultItem` from base layer

2. **Resolver Implementation**:
   - Create custom resolver: `backend/apps/crt.svc.core/src/sync/sync-push.resolver.ts`
   - Use NestJS `@Mutation()` decorator
   - Call service.syncPush() method (base layer handles transaction)

3. **Mutation Logic**:
   ```typescript
   @Mutation(() => [SyncResultItem])
   async syncPush(
     @Args('entity') entity: string,
     @Args('items', { type: () => GraphQLJSON }) items: any[],
     @Context() ctx: any,
   ): Promise<SyncResultItem[]> {
     // Get service for entity type
     const service = this.getServiceForEntity(entity);
     
     // Build context from GraphQL context
     const internalCtx = {
       tenantId: ctx.req.user?.tenantId,
       requestId: ctx.req.id,
       // ... other context fields
     };
     
     // Call base layer syncPush (handles transaction and all logic)
     return service.syncPush(items, internalCtx);
   }
   ```

4. **Entity Type Routing**:
   - Create factory/service to map entity string to service
   - Example: `"Space"` → `SpaceService`, `"Group"` → `GroupService`
   - Validate entity type exists before processing

5. **Authorization**:
   - Validate ownership (spaceId, tenantId match user context)
   - Reject items from unauthorized spaces/tenants
   - Use existing auth guards (e.g., `@UseGuards(JwtAuthGuard)`)

6. **Performance Optimization**:
   - Base layer already uses Prisma transactions
   - Consider batch size limits (max 100 per request) in GraphQL resolver
   - Monitor performance metrics

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

