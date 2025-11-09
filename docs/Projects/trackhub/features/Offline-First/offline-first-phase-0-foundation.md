---
id: offline-first-phase-0
title: "Phase 0: Foundation"
sidebar_label: "Phase 0: Foundation"
---

# Phase 0: Foundation

**Status**: `TODO[x]` ✅ (Completed - All tasks implemented)  
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

### RN-0.0: Update Frontend SDK Types and Services

**Status**: `TODO[x]` ✅  
**Owner**: Frontend Team Lead  
**Effort**: 3 days

**Description**: Update frontend SDK types and LocalServices to support offline-first fields and default value generation.

**Checklist**:
- [x] Update `CrtBaseEntity` interface in SDK with `_clientId?: string` and `_version?: number`
- [x] Update `ICrtBaseService` interface to support `_clientId` in addItem
- [x] Create `entityDefaults.ts` utility with `getDefaultEntityValues()` function
- [x] Create `generateClientId()` function for offline creates
- [x] Update all LocalServices to use `getDefaultEntityValues()` in create operations
- [x] Update all LocalServices to auto-increment `_version` in update/delete operations
- [x] Update `ChildSpaceForm` to use default values

**Acceptance Criteria**:
- ✅ All entity interfaces include `_clientId` and `_version` fields
- ✅ All LocalServices generate default values automatically
- ✅ Version increments on all update/delete operations
- ✅ ClientId is generated for offline creates

**Completed**:
- ✅ Updated `CrtBaseEntity` interface in `packages/sdk/src/types/index.ts` with `_clientId?: string` and `_version?: number`
- ✅ Updated `ICrtBaseService.addItem()` signature to support `_clientId`
- ✅ Created `packages/sdk/src/utils/entityDefaults.ts` with:
  - `generateClientId()`: Generates temporary client IDs (`tmp-{timestamp}-{random}`)
  - `getDefaultEntityValues()`: Returns defaults including `_clientId` and `_version: 1`
  - `createEntityWithDefaults()`: Helper function for creating entities
- ✅ Updated all LocalServices (9 services across 5 packages):
  - `coreCrt`: LocalSpaceService, LocalGroupService, LocalIdentityService, LocalConfigCrtService
  - `checklist`: LocalChecklistService
  - `auth`: LocalSpaceService
  - `sampleCrt`: LocalIdentityService, LocalConfigCrtService
  - `keezy`: LocalIdentityService
- ✅ All create operations now use `getDefaultEntityValues()` with auto-generated `_clientId` and `_version: 1`
- ✅ All update operations auto-increment `_version` (currentVersion + 1)
- ✅ All delete/softDelete/restore operations auto-increment `_version`
- ✅ Toggle operations (toggleItem, toggleCollapse) auto-increment `_version`
- ✅ Parent entity version increments when adding child items

---

### RN-0.1: Setup WatermelonDB Infrastructure

**Status**: `IN_PROGRESS[]` (Basic setup ✅, Multi-tenant pending)  
**Owner**: Mobile Team Lead  
**Effort**: 5 days

**Description**: Install and configure WatermelonDB with SQLite adapter and encryption support. **CRITICAL**: Support multi-tenant architecture with one DB per tenant.

**Checklist**:
- [x] Install WatermelonDB and dependencies (✅ Completed)
- [x] Configure SQLite adapter (✅ Completed - using react-native-quick-sqlite)
- [x] Set up database initialization (✅ Completed - watermelon.ts)
- [x] Configure database location (✅ Secure app directory via WatermelonDB)
- [x] Test database creation and basic operations (✅ Ready for testing)
- [x] Implement database encryption key management (✅ Keychain integration ready)
- [ ] **Implement multi-tenant DB isolation** (⏳ Pending - each tenant needs separate DB instance)
- [ ] **Database naming by tenantId** (⏳ Pending - `trackhub_db_{tenantId}`)
- [ ] **Tenant switching logic** (⏳ Pending - initialize new DB when switching tenants)
- [ ] **Drop DB on tenant logout** (⏳ Pending - cleanup tenant data)

**Acceptance Criteria**:
- Database initializes successfully on app start
- Encryption is enabled and working
- Database files are stored in secure location
- Basic read/write operations work

**Technical Notes**:
- Use SQLCipher for encryption
- Store encryption key in secure storage (Keychain/Keystore)
- Consider database size limits and cleanup strategies

**Implementation Details**:

1. **Installation**:
   ```bash
   pnpm add @nozbe/watermelondb @nozbe/with-observables
   pnpm add react-native-sqlite-2  # or better: react-native-sqlite-storage
   pnpm add react-native-keychain  # for secure key storage
   ```

2. **Database Setup**:
   - Create `app/trackhub/packages/sdk/src/database/watermelon.ts`
   - Initialize database with SQLite adapter
   - Configure encryption key from Keychain

3. **Example Setup**:
   ```typescript
   import { Database } from '@nozbe/watermelondb';
   import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
   import * as Keychain from 'react-native-keychain';
   
   const getEncryptionKey = async (): Promise<string> => {
     let key = await Keychain.getInternetCredentials('watermelon_db_key');
     if (!key) {
       key = generateRandomKey(); // Generate 32-byte key
       await Keychain.setInternetCredentials('watermelon_db_key', 'key', key);
     }
     return key.password;
   };
   
   const adapter = new SQLiteAdapter({
     schema: mySchema,
     dbName: 'trackhub_db',
     jsi: true, // Use JSI for better performance
     // encryption not directly supported, use react-native-sqlite-2 with encryption
   });
   
   export const database = new Database({
     adapter,
     modelClasses: [Outbox, Upload, ...entityModels],
   });
   ```

4. **Database Location**:
   - Use app's document directory (secure, backed up)
   - iOS: `Documents/` directory
   - Android: App's data directory

5. **Encryption**:
   - Use `react-native-sqlite-2` with SQLCipher support
   - Or use `react-native-quick-sqlite` with encryption
   - Store key in Keychain (iOS) / Keystore (Android)

---

### RN-0.2: Define Base Schema Structure

**Status**: `IN_PROGRESS[]` (Basic schema ✅, Operation queue pending)  
**Owner**: Mobile Team Lead  
**Effort**: 3 days

**Description**: Create WatermelonDB schema for core tables (entities, operation_queue, uploads, sync_state, conflicts).

**Checklist**:
- [x] Define base entity schema structure (✅ Ready for entity tables)
- [x] Create `outbox` table schema (✅ Completed in schema.ts - **NOTE**: Will be replaced by `operation_queue`)
- [ ] **Create `operation_queue` table schema** (⏳ Pending - replaces outbox with operation type)
- [x] Create `uploads` table schema (✅ Completed in schema.ts)
- [x] Create `sync_state` table schema (✅ Completed in schema.ts - **NOTE**: Add `serverVersionHash` field)
- [ ] **Create `conflicts` table schema** (⏳ Pending - for user conflict resolution)
- [x] Implement schema migrations strategy (✅ WatermelonDB migrations ready)
- [ ] Write migration scripts for version upgrades (Will be added when needed)

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

**Implementation Details**:

1. **WatermelonDB Schema Definition**:
   - Create `app/trackhub/packages/sdk/src/database/schema.ts`
   - Define all tables using WatermelonDB schema format
   - Include entity tables, outbox, uploads

2. **Schema Example**:
   ```typescript
   import { appSchema, tableSchema } from '@nozbe/watermelondb';
   
   export const schema = appSchema({
     version: 1,
     tables: [
       // Outbox table
       tableSchema({
         name: 'outbox',
         columns: [
           { name: 'entity', type: 'string' },
           { name: 'payload', type: 'string' },
           { name: 'status', type: 'string' },
           { name: 'attempts', type: 'number' },
           { name: 'last_error', type: 'string', isOptional: true },
           { name: 'created_at', type: 'number' },
           { name: 'updated_at', type: 'number' },
         ],
       }),
       // Uploads table
       tableSchema({
         name: 'uploads',
         columns: [
           { name: 'local_path', type: 'string' },
           { name: 'remote_url', type: 'string', isOptional: true },
           { name: 'status', type: 'string' },
           { name: 'attempts', type: 'number' },
           { name: 'meta', type: 'string', isOptional: true },
           { name: 'created_at', type: 'number' },
           { name: 'updated_at', type: 'number' },
         ],
       }),
       // Entity tables (example: Space)
       tableSchema({
         name: 'spaces',
         columns: [
           { name: 'server_id', type: 'string', isOptional: true },
           { name: 'client_id', type: 'string', isOptional: true },
           { name: 'version', type: 'number' },
           { name: 'updated_at', type: 'number' },
           { name: 'is_deleted', type: 'boolean' },
           { name: 'name', type: 'string' },
           { name: 'description', type: 'string', isOptional: true },
           // ... other fields
         ],
       }),
     ],
   });
   ```

3. **Model Classes**:
   - Create model classes for each table
   - Extend `Model` from WatermelonDB
   - Define associations if needed

4. **Migration Strategy**:
   - Use WatermelonDB migrations for schema changes
   - Create migration files for each version
   - Test migrations with sample data

---

### RN-0.3: Implement Operation Queue Manager API

**Status**: `IN_PROGRESS[]` (OutboxService ✅, OperationQueue pending)  
**Owner**: Mobile Team Lead  
**Effort**: 4 days

**Description**: Create API to manage operation queue (replaces outbox). Queue tracks insert/update/delete operations.

**Checklist**:
- [x] Implement `enqueueMutation(entity, payload)` function (✅ OutboxService.enqueueMutation - **NOTE**: Will migrate to OperationQueue)
- [ ] **Implement `OperationQueue.enqueue(operation, entity, entityId, payload)`** (⏳ Pending)
- [ ] **Support operation types: insert, update, delete** (⏳ Pending)
- [x] Generate `clientId` for new entities (✅ Uses entityDefaults.generateClientId - **NOTE**: Must use UUID v7)
- [ ] **Update to use UUID v7 instead of tmp- prefix** (⏳ Pending - see RN-0.6)
- [x] Store mutation payload as JSON (✅ JSON.stringify in payload field)
- [x] Set initial status to 'pending' (✅ Default status)
- [x] Update item status helpers (✅ markSuccess, markFailed, markSending, updateStatus)
- [x] Implement query methods for pending items (✅ getPendingItems, getItemsByStatus)
- [ ] **Group operations by entity type** (⏳ Pending - for batching)
- [ ] **Batch operations (max 100 per batch)** (⏳ Pending)
- [x] Additional utilities (✅ getPendingCount, clearOldSuccessItems, deleteItem)
- [ ] Write unit tests for operation queue (Pending)

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

**Implementation Details**:

1. **Outbox Model**:
   - Create `app/trackhub/packages/sdk/src/database/models/Outbox.ts`
   - Extend WatermelonDB `Model` class
   - Define table name and schema

2. **Outbox Service**:
   - Create `app/trackhub/packages/sdk/src/services/outbox.service.ts`
   - Implement `enqueueMutation`, `getPendingItems`, `updateStatus`

3. **Implementation Example**:
   ```typescript
   import { Model } from '@nozbe/watermelondb';
   import { field, date } from '@nozbe/watermelondb/decorators';
   
   export class Outbox extends Model {
     static table = 'outbox';
     
     @field('entity') entity!: string;
     @field('payload') payload!: string;
     @field('status') status!: string; // pending | sending | failed | success
     @field('attempts') attempts!: number;
     @field('last_error') lastError?: string;
     @date('created_at') createdAt!: Date;
     @date('updated_at') updatedAt!: Date;
   }
   
   export class OutboxService {
     constructor(private database: Database) {}
     
     async enqueueMutation(entity: string, payload: any): Promise<string> {
       const clientId = generateClientId(); // Use entityDefaults utility
       payload.clientId = clientId;
       
       await this.database.write(async () => {
         await this.database.collections.get('outbox').create(record => {
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
     
     async getPendingItems(limit?: number): Promise<Outbox[]> {
       return await this.database.collections
         .get('outbox')
         .query(
           Q.where('status', 'pending'),
           Q.sortBy('created_at', Q.asc),
           limit ? Q.take(limit) : undefined,
         )
         .fetch();
     }
     
     async updateStatus(
       outboxId: string,
       status: 'sending' | 'failed' | 'success',
       error?: string,
     ): Promise<void> {
       const outbox = await this.database.collections
         .get('outbox')
         .find(outboxId);
       
       await this.database.write(async () => {
         await outbox.update(record => {
           record.status = status;
           record.updatedAt = new Date();
           if (status === 'failed' && error) {
             record.lastError = error;
             record.attempts += 1;
           }
         });
       });
     }
   }
   ```

4. **Integration with LocalServices**:
   - Modify LocalServices to call `enqueueMutation` instead of direct API calls
   - Example: `LocalSpaceService.addItem()` → enqueue mutation → return clientId

---

### RN-0.4: Implement Network Detection

**Status**: `TODO[x]` ✅  
**Owner**: Mobile Team Lead  
**Effort**: 3 days

**Description**: Set up network state detection using NetInfo with debouncing.

**Checklist**:
- [x] Install and configure @react-native-community/netinfo (✅ Completed)
- [x] Implement network state listener (✅ NetworkService with subscription)
- [x] Add debounce logic (2 seconds) to avoid rapid state changes (✅ Debounce implemented)
- [x] Create network state hook for components (✅ useNetworkState hook)
- [x] Implement network state management (✅ NetworkService class with static methods)
- [x] Handle edge cases (✅ isInternetReachable check, null handling)
- [ ] Test network state changes (airplane mode, wifi/4G switching) (Pending - manual testing)

**Acceptance Criteria**:
- Network state is accurately detected
- State changes are debounced appropriately
- Components can subscribe to network state
- Works reliably on iOS and Android

---

### RN-0.5: Create Sync Worker Skeleton

**Status**: `TODO[x]` ✅  
**Owner**: Mobile Team Lead  
**Effort**: 3 days

**Description**: Create background sync worker that checks network and processes operation queue.

**Checklist**:
- [x] Create SyncWorker class (✅ SyncWorker class implemented)
- [x] Implement basic worker lifecycle (start, stop) (✅ start/stop methods)
- [x] Add network check before processing (✅ NetworkService integration)
- [x] Implement basic queue polling mechanism (✅ Polling with configurable interval)
- [x] Add app state awareness (foreground/background) (✅ AppState listener)
- [x] Create worker configuration (poll interval, batch size) (✅ SyncWorkerConfig)
- [x] Add basic logging for debugging (✅ Console logs)
- [x] Status management and listeners (✅ Status subscription)
- [x] Singleton pattern (✅ getSyncWorker function)
- [ ] **Add sync triggers: app open, 5min interval, network regained** (⏳ Pending)
- [ ] Integrate actual sync logic (Phase 1 - syncPush/syncPull)

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

### RN-0.6: Implement UUID v7 Client ID Generation

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 2 days

**Description**: Replace tmp- prefix client IDs with UUID v7 for clean identity merge.

**Checklist**:
- [ ] Install UUID v7 library (`uuidv7` package)
- [ ] Create `generateClientId()` function using UUID v7
- [ ] Update `entityDefaults.ts` to use UUID v7
- [ ] Update all LocalServices to use UUID v7
- [ ] Remove tmp- prefix generation
- [ ] Test UUID v7 generation and uniqueness
- [ ] Write unit tests

**Acceptance Criteria**:
- All offline creates use UUID v7 format
- No random numeric IDs
- UUID v7 is time-ordered for better indexing
- Clean identity merge on sync

**Implementation**:
```typescript
import { uuidv7 } from 'uuidv7';

export function generateClientId(): string {
  return uuidv7(); // Returns UUID v7 string (e.g., "01234567-89ab-7def-0123-456789abcdef")
}
```

---

### RN-0.7: Implement Multi-Tenant DB Isolation

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 4 days

**Description**: Implement per-tenant database instances for strict data isolation.

**Checklist**:
- [ ] Create `getDatabaseForTenant(tenantId)` function
- [ ] Implement database naming: `trackhub_db_{tenantId}`
- [ ] Create tenant switching logic (initialize new DB)
- [ ] Implement `dropTenantDatabase(tenantId)` for logout cleanup
- [ ] Update database initialization to accept tenantId
- [ ] Test tenant isolation (no cross-tenant data access)
- [ ] Test tenant switching
- [ ] Test DB cleanup on logout
- [ ] Write unit tests

**Acceptance Criteria**:
- Each tenant has separate DB instance
- No cross-tenant data access
- Tenant switching works correctly
- DB cleanup on logout works

**Implementation**:
```typescript
const tenantDatabases = new Map<string, Database>();

export function getDatabaseForTenant(tenantId: string): Database {
  if (!tenantDatabases.has(tenantId)) {
    const dbName = `trackhub_db_${tenantId}`;
    const db = new Database({
      adapter: new SQLiteAdapter({ schema, dbName }),
      modelClasses: [OperationQueue, Upload, SyncState, ...entityModels],
    });
    tenantDatabases.set(tenantId, db);
  }
  return tenantDatabases.get(tenantId)!;
}

export async function dropTenantDatabase(tenantId: string): Promise<void> {
  const db = tenantDatabases.get(tenantId);
  if (db) {
    // Implementation depends on WatermelonDB API
    await db.adapter.schema.dropDatabase(`trackhub_db_${tenantId}`);
    tenantDatabases.delete(tenantId);
  }
}
```

---

### DOC-0.1: Document Architecture & Conventions

**Status**: `TODO[x]` ✅ (Architecture design document created)  
**Owner**: Tech Lead  
**Effort**: 2 days

**Description**: Create comprehensive documentation for offline-first architecture.

**Checklist**:
- [x] Document architecture overview (✅ Architecture design document created)
- [x] Document data conventions (✅ In epic and architecture docs)
- [ ] Create entity schema template
- [ ] Document migration strategy
- [ ] Create developer guide for adding new entities
- [ ] Document operation queue usage patterns
- [ ] Document multi-tenant architecture
- [ ] Document UUID v7 usage

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

