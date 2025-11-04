---
id: offline-first-phase-0
title: "Phase 0: Foundation"
sidebar_label: "Phase 0: Foundation"
---

# Phase 0: Foundation

**Status**: `TODO[]`  
**Phase ID**: `EPIC-OFFLINE-001-P0`  
**Dependencies**: None  
**Estimated Effort**: 2-3 weeks  
**Owner**: TBD

## Overview

Establish the foundational infrastructure for offline-first architecture. This includes setting up the local database, defining data conventions, creating the outbox system, and implementing basic network detection.

## Objectives

- Set up WatermelonDB with encrypted SQLite adapter
- Define and document global data conventions
- Implement outbox table and API
- Create sync worker skeleton with network detection
- Establish migration strategy

## Tasks

### BE-0.1: Define Global Data Conventions

**Status**: `TODO[x]` ✅  
**Owner**: Backend Team Lead  
**Effort**: 2 days

**Description**: Document and enforce global data conventions across all entities.

**Checklist**:
- [x] Document `id`, `clientId`, `version`, `updatedAt`, `isDeleted` requirements
- [ ] Create GraphQL schema validation rules for these fields
- [x] Update API documentation with conventions
- [x] Create migration guide for existing entities

**Acceptance Criteria**:
- ✅ All new entities follow conventions (CrtBaseEntity updated)
- ✅ Schema validation enforces required fields (Prisma base-fields.prisma updated)
- ✅ Documentation is accessible to all teams (Epic docs created)

**Completed**:
- ✅ Updated `CrtBaseEntity` with `clientId` and `version` fields
- ✅ Updated all Prisma `base-fields.prisma` files (3 services)
- ✅ Updated all proto files with `clientId` and `version` fields
- ✅ Updated `generate-model.js` scripts to include new fields

---

### RN-0.1: Setup WatermelonDB Infrastructure

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 5 days

**Description**: Install and configure WatermelonDB with SQLite adapter and encryption support.

**Checklist**:
- [ ] Install WatermelonDB and dependencies
- [ ] Configure SQLite adapter with SQLCipher for encryption
- [ ] Set up database initialization
- [ ] Configure database location (secure app directory)
- [ ] Test database creation and basic operations
- [ ] Implement database encryption key management

**Acceptance Criteria**:
- Database initializes successfully on app start
- Encryption is enabled and working
- Database files are stored in secure location
- Basic read/write operations work

**Technical Notes**:
- Use SQLCipher for encryption
- Store encryption key in secure storage (Keychain/Keystore)
- Consider database size limits and cleanup strategies

---

### RN-0.2: Define Base Schema Structure

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 3 days

**Description**: Create WatermelonDB schema for core tables (entities, outbox, uploads).

**Checklist**:
- [ ] Define base entity schema (id, clientId, version, updatedAt, isDeleted)
- [ ] Create `outbox` table schema
- [ ] Create `uploads` table schema
- [ ] Create example entity schema (e.g., `spaces`)
- [ ] Implement schema migrations strategy
- [ ] Write migration scripts for version upgrades

**Acceptance Criteria**:
- Schema definitions are complete and documented
- Migrations can be run without data loss
- Schema supports all required fields

**Example Schema**:
```typescript
// Outbox schema
export const outboxSchema = {
  name: 'outbox',
  primaryKey: 'id',
  properties: {
    id: 'string',
    entity: 'string',
    payload: 'string', // JSON stringified
    status: 'string', // pending | sending | failed | success
    attempts: 'int',
    lastError: 'string?',
    createdAt: 'date',
    updatedAt: 'date',
  },
};
```

---

### RN-0.3: Implement Outbox Manager API

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 4 days

**Description**: Create API to add mutations to outbox queue.

**Checklist**:
- [ ] Implement `enqueueMutation(entity, payload)` function
- [ ] Generate `clientId` for new entities
- [ ] Store mutation payload as JSON in outbox
- [ ] Set initial status to 'pending'
- [ ] Update outbox item status helpers
- [ ] Implement query methods for pending items
- [ ] Write unit tests for outbox operations

**Acceptance Criteria**:
- Mutations can be enqueued successfully
- `clientId` is generated correctly
- Payload is stored and retrievable
- Status can be updated

**Pseudocode**:
```typescript
async function enqueueMutation(entity: string, payload: any) {
  const clientId = `tmp-${uuidv4()}`;
  payload.clientId = clientId;
  
  await db.write(async () => {
    await db.collections.get('outbox').create(record => {
      record.entity = entity;
      record.payload = JSON.stringify(payload);
      record.status = 'pending';
      record.attempts = 0;
      record.createdAt = new Date();
      record.updatedAt = new Date();
    });
  });
  
  return clientId;
}
```

---

### RN-0.4: Implement Network Detection

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 3 days

**Description**: Set up network state detection using NetInfo with debouncing.

**Checklist**:
- [ ] Install and configure @react-native-community/netinfo
- [ ] Implement network state listener
- [ ] Add debounce logic (2-3 seconds) to avoid rapid state changes
- [ ] Create network state hook for components
- [ ] Test network state changes (airplane mode, wifi/4G switching)
- [ ] Handle edge cases (slow network, intermittent connectivity)

**Acceptance Criteria**:
- Network state is accurately detected
- State changes are debounced appropriately
- Components can subscribe to network state
- Works reliably on iOS and Android

---

### RN-0.5: Create Sync Worker Skeleton

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 3 days

**Description**: Create background sync worker that checks network and processes outbox.

**Checklist**:
- [ ] Create SyncWorker class
- [ ] Implement basic worker lifecycle (start, stop, pause, resume)
- [ ] Add network check before processing
- [ ] Implement basic outbox polling mechanism
- [ ] Add app state awareness (foreground/background)
- [ ] Create worker configuration (poll interval, batch size)
- [ ] Add basic logging for debugging

**Acceptance Criteria**:
- Worker starts and stops correctly
- Only processes when online
- Respects app state
- Can be configured via settings

**Technical Notes**:
- Use background tasks API for background processing
- Consider using work manager / background fetch
- Implement exponential backoff for retries

---

### DOC-0.1: Document Architecture & Conventions

**Status**: `TODO[]`  
**Owner**: Tech Lead  
**Effort**: 2 days

**Description**: Create comprehensive documentation for offline-first architecture.

**Checklist**:
- [ ] Document architecture overview
- [ ] Document data conventions
- [ ] Create entity schema template
- [ ] Document migration strategy
- [ ] Create developer guide for adding new entities
- [ ] Document outbox usage patterns

**Acceptance Criteria**:
- Documentation is complete and accessible
- Examples are provided
- Onboarding guide for new developers

---

## Testing Requirements

### Unit Tests
- [ ] Outbox operations (enqueue, status update, query)
- [ ] Network detection logic
- [ ] Database schema operations
- [ ] Migration scripts

### Integration Tests
- [ ] Database initialization with encryption
- [ ] Outbox persistence across app restarts
- [ ] Network state changes

## Deliverables

1. ✅ WatermelonDB setup with encryption
2. ✅ Base schema definitions (outbox, uploads, example entity)
3. ✅ Outbox manager API
4. ✅ Network detection system
5. ✅ Sync worker skeleton
6. ✅ Architecture documentation

## Dependencies

**Blocking**:
- None (this is the foundation phase)

**Blocked By**:
- Phase 1 (Basic Sync) depends on this phase

## Risks

| Risk | Mitigation |
|------|------------|
| WatermelonDB performance issues | Benchmark early, consider alternatives |
| Encryption key management complexity | Use proven secure storage libraries |
| Migration strategy issues | Test migrations thoroughly, keep backward compatibility |

## Success Criteria

- [ ] All tasks completed
- [ ] Unit tests passing (>80% coverage)
- [ ] Documentation complete
- [ ] Code review approved
- [ ] Ready for Phase 1

