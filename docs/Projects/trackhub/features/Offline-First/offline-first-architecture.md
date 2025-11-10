---
id: offline-first-architecture
title: "Offline-First Architecture Design"
sidebar_label: "Architecture Design"
---

# Offline-First Architecture Design

**Status**: `IN_PROGRESS[]`  
**Version**: 2.0  
**Last Updated**: 2025-01-XX

## Overview

Comprehensive architecture design for offline-first sync engine in a **super app** with **multiple tenants** and **multiple mini-apps**. This document serves as the **specification base** for building the sync engine.

## Model Assumptions

- **Local DB**: WatermelonDB (React Native)
- **Server**: GraphQL API
- **Sync Endpoints**: `syncPushSpace` + `syncPullSpace` (per entity type)
- **Tenant Isolation**: Strict tenant data separation

---

## 1. Fundamental Architecture

### 1.1 Local DB Per Tenant

| Requirement | Implementation |
|------------|----------------|
| **Multi-tenant isolation** | Each tenant → 1 separate WatermelonDB instance |
| **Database naming** | `dbName` suffix by `tenantId`: `trackhub_db_{tenantId}` |
| **Tenant switching** | Initialize new DB instance when switching tenants |
| **Data isolation** | Complete separation - no cross-tenant data access |

**Implementation**:
```typescript
// Database initialization per tenant
function getDatabaseForTenant(tenantId: string): Database {
  const dbName = `trackhub_db_${tenantId}`;
  return new Database({
    adapter: new SQLiteAdapter({ schema, dbName }),
    modelClasses: [Outbox, Upload, SyncState, ...entityModels],
  });
}
```

### 1.2 Sync Engine Module Shareable

| Requirement | Implementation |
|------------|----------------|
| **Shared package** | Sync engine code in shared package (e.g., `@trackhub/sync-engine`) |
| **Mini-app import** | Any mini-app can import and use sync engine |
| **Consistent behavior** | Same sync logic across all mini-apps |
| **Configurable** | Per-entity sync configuration |

**Package Structure**:
```
packages/sdk/src/sync/
  ├── SyncService.ts          # Main sync service
  ├── SyncAdapter.ts          # Entity-specific adapter
  ├── ConflictResolver.ts     # Conflict resolution logic
  ├── OperationQueue.ts       # Queue management
  └── types.ts                # Type definitions
```

### 1.3 Tracking Pending Mutations

| Requirement | Implementation |
|------------|----------------|
| **Operation queue** | Table `operation_queue` in local DB (not just outbox) |
| **Operation types** | `insert`, `update`, `delete` |
| **Status tracking** | `pending`, `sending`, `success`, `failed` |
| **Retry logic** | Track attempts, exponential backoff |

**Schema**:
```typescript
tableSchema({
  name: 'operation_queue',
  columns: [
    { name: 'id', type: 'string' },
    { name: 'entity', type: 'string' },           // Entity type (Space, Group, etc.)
    { name: 'operation', type: 'string' },       // insert | update | delete
    { name: 'entity_id', type: 'string' },       // Local entity ID (clientId or serverId)
    { name: 'payload', type: 'string' },         // JSON stringified entity data
    { name: 'status', type: 'string' },         // pending | sending | success | failed
    { name: 'attempts', type: 'number' },
    { name: 'last_error', type: 'string', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
})
```

### 1.4 Sync Token Per Space

| Requirement | Implementation |
|------------|----------------|
| **Per-entity sync state** | Each entity group has `lastSyncAt` + `serverVersionHash` |
| **Sync state table** | Store sync metadata per entity type |
| **Version hash** | Server returns hash of all record versions for conflict detection |
| **Incremental sync** | Use `lastSyncAt` for incremental pulls |

**Schema**:
```typescript
tableSchema({
  name: 'sync_state',
  columns: [
    { name: 'entity', type: 'string', isIndexed: true },      // Entity type
    { name: 'lastSyncAt', type: 'number' },                  // Last successful sync timestamp
    { name: 'serverVersionHash', type: 'string', isOptional: true }, // Server version hash
    { name: 'updatedAt', type: 'number' },
  ],
})
```

**GraphQL Response**:
```graphql
type SyncPullResponse {
  items: [JSON!]!
  lastSyncAt: DateTime!
  hasMore: Boolean!
  versionHash: String  # Hash of all record versions for conflict detection
}
```

---

## 2. Two-Way Sync

### 2.1 Sync Flow

| Feature | Implementation |
|--------|----------------|
| **Pull** | Call `syncPullSpace` → returns list of records changed since `lastSyncAt` |
| **Push** | Before pull, push `operation_queue` via `syncPushSpace` |
| **Atomic** | Push successful → clear local queue → pull → merge DB |
| **Schedule** | Background sync interval (5min) + manual sync + network regained |

**Sync Sequence**:
```
1. Check network status
2. If online:
   a. Push operation_queue (group by entity, batch max 100)
   b. On success: Clear successful operations from queue
   c. Pull changes from server (since lastSyncAt)
   d. Merge server changes into local DB
   e. Update sync_state (lastSyncAt, versionHash)
3. If offline:
   - Queue operations locally
   - Show offline indicator
```

### 2.2 Sync Triggers

| Trigger | Action |
|--------|--------|
| **App open** | Trigger sync if online |
| **5min interval** | Background sync (if online) |
| **Manual "sync now"** | User-triggered sync |
| **Network regained** | Auto-sync when offline → online transition |
| **After mutation** | Optional: immediate sync for critical operations |

**Implementation**:
```typescript
class SyncService {
  // Trigger sync on various events
  async syncOnAppOpen(): Promise<void> {
    if (NetworkService.isOnline()) {
      await this.syncAll();
    }
  }

  async syncOnInterval(): Promise<void> {
    // Background sync every 5 minutes
    setInterval(async () => {
      if (NetworkService.isOnline()) {
        await this.syncAll();
      }
    }, 5 * 60 * 1000);
  }

  async syncOnNetworkRegained(): Promise<void> {
    NetworkService.subscribe((isOnline) => {
      if (isOnline) {
        await this.syncAll();
      }
    });
  }
}
```

---

## 3. Force Sync

### 3.1 Force from Server (Overwrite Local)

| Case | Implementation |
|------|----------------|
| **Use case** | Server data is authoritative, discard local changes |
| **Flow** | Skip push → pull → replace local records (hard reset space) |
| **UI** | Button with clear warning text |
| **Confirmation** | User must confirm (critical operation, cannot be silent auto) |

**Warning Text**:
```
⚠️ Force Sync from Server

This will overwrite all local changes with server data.
Any unsynced local changes will be lost.

Are you sure?
[Cancel] [Force Sync]
```

**Implementation**:
```typescript
async forceSyncFromServer(entity: string): Promise<void> {
  // Skip push - discard local changes
  // Pull all data from server
  const response = await graphql.syncPull({ entity, since: null });
  
  // Hard reset: delete all local records for this entity
  await db.write(async () => {
    const localRecords = await db.collections.get(entity).query().fetch();
    for (const record of localRecords) {
      await record.destroyPermanently();
    }
    
    // Insert all server records
    for (const item of response.items) {
      await db.collections.get(entity).create(record => {
        Object.assign(record, item);
      });
    }
  });
  
  // Update sync state
  await this.updateSyncState(entity, response.lastSyncAt, response.versionHash);
}
```

### 3.2 Force Push Local First

| Case | Implementation |
|------|----------------|
| **Use case** | Local changes are authoritative, override server |
| **Flow** | Push operation_queue → success → pull |
| **UI** | Button with clear warning text |
| **Confirmation** | User must confirm (critical operation) |

**Warning Text**:
```
⚠️ Force Push Local Changes

This will overwrite server data with your local changes.
Any server changes will be lost.

Are you sure?
[Cancel] [Force Push]
```

**Implementation**:
```typescript
async forcePushLocal(entity: string): Promise<void> {
  // Push all pending operations (even if conflicts exist)
  const operations = await OperationQueue.getPendingOperations(entity);
  const results = await graphql.syncPush({ entity, items: operations });
  
  // Clear successful operations
  await OperationQueue.clearSuccessfulOperations(results);
  
  // Then pull to get any other server changes
  await this.syncPull(entity);
}
```

---

## 4. Clean Data Local

### 4.1 Wipe Tables Per Space

| Work | Implementation |
|------|----------------|
| **Wipe all tables** | Delete all records for specific space in WatermelonDB |
| **Skip tenant tokens** | Keep tenant tokens for user login (don't wipe auth data) |
| **Support drop DB** | Option to drop entire DB per tenant if logout |

**Implementation**:
```typescript
async wipeSpaceData(spaceId: string): Promise<void> {
  await db.write(async () => {
    // Wipe all entity tables for this space
    const entities = ['spaces', 'groups', 'identities', ...];
    
    for (const entity of entities) {
      const records = await db.collections
        .get(entity)
        .query(Q.where('space_id', spaceId))
        .fetch();
      
      for (const record of records) {
        await record.destroyPermanently();
      }
    }
    
    // Clear operation queue for this space
    const operations = await db.collections
      .get('operation_queue')
      .query(Q.where('space_id', spaceId))
      .fetch();
    
    for (const op of operations) {
      await op.destroyPermanently();
    }
    
    // Clear sync state for this space
    const syncStates = await db.collections
      .get('sync_state')
      .query(Q.where('space_id', spaceId))
      .fetch();
    
    for (const state of syncStates) {
      await state.destroyPermanently();
    }
  });
}

async dropTenantDatabase(tenantId: string): Promise<void> {
  // Drop entire database for tenant (on logout)
  const dbName = `trackhub_db_${tenantId}`;
  // Implementation depends on WatermelonDB API
  await database.adapter.schema.dropDatabase(dbName);
}
```

---

## 5. Conflict Merge

### 5.1 Conflict Resolution Strategy

(Best practice like Notion / Linear)

| Case | Who Wins | Action |
|------|----------|--------|
| **Auto safe** | Server timestamp newer | Local override (server wins) |
| **Auto safe** | Local mutation newer | Push override server (local wins) |
| **Unresolved conflict** | Equal timestamp | User choose UI diff (present 2 versions => choose commit) |

### 5.2 Conflict Detection

```typescript
interface ConflictRecord {
  entityId: string;
  localVersion: number;
  serverVersion: number;
  localData: any;
  serverData: any;
  localUpdatedAt: number;
  serverUpdatedAt: number;
  conflictType: 'timestamp' | 'version' | 'both';
}

function detectConflict(
  localRecord: any,
  serverRecord: any
): ConflictRecord | null {
  // Case 1: Server timestamp newer → server wins (auto-resolve)
  if (serverRecord.updatedAt > localRecord.updatedAt) {
    return null; // No conflict, server wins
  }
  
  // Case 2: Local timestamp newer → local wins (auto-resolve)
  if (localRecord.updatedAt > serverRecord.updatedAt) {
    return null; // No conflict, local wins
  }
  
  // Case 3: Equal timestamp but different data → user resolve
  if (
    localRecord.updatedAt === serverRecord.updatedAt &&
    JSON.stringify(localRecord) !== JSON.stringify(serverRecord)
  ) {
    return {
      entityId: localRecord.id,
      localVersion: localRecord.version,
      serverVersion: serverRecord.version,
      localData: localRecord,
      serverData: serverRecord,
      localUpdatedAt: localRecord.updatedAt,
      serverUpdatedAt: serverRecord.updatedAt,
      conflictType: 'timestamp',
    };
  }
  
  // Case 4: Version mismatch → user resolve
  if (localRecord.version !== serverRecord.version) {
    return {
      entityId: localRecord.id,
      localVersion: localRecord.version,
      serverVersion: serverRecord.version,
      localData: localRecord,
      serverData: serverRecord,
      localUpdatedAt: localRecord.updatedAt,
      serverUpdatedAt: serverRecord.updatedAt,
      conflictType: 'version',
    };
  }
  
  return null; // No conflict
}
```

### 5.3 Conflict Resolution UI

**Requirements**:
- Build record diff modal (thin, lightweight)
- No need for fancy rich diff
- Show only fields changed
- Side-by-side comparison

**UI Design**:
```
┌─────────────────────────────────────────┐
│ Conflict Resolution                    │
├─────────────────────────────────────────┤
│ Record: Space "My Workspace"            │
│                                         │
│ Field: name                             │
│ ┌─────────────┬─────────────┐          │
│ │ Local       │ Server      │          │
│ ├─────────────┼─────────────┤          │
│ │ "My Space"  │ "Workspace" │          │
│ └─────────────┴─────────────┘          │
│                                         │
│ [Keep Local] [Use Server] [Merge]      │
└─────────────────────────────────────────┘
```

**Implementation**:
```typescript
interface ConflictDiffModal {
  conflict: ConflictRecord;
  onResolve: (resolution: 'local' | 'server' | 'merge', mergedData?: any) => void;
}

function ConflictDiffModal({ conflict, onResolve }) {
  const changedFields = getChangedFields(conflict.localData, conflict.serverData);
  
  return (
    <Modal>
      <Text>Conflict Resolution</Text>
      <Text>Record: {conflict.entityId}</Text>
      
      {changedFields.map(field => (
        <View key={field.name}>
          <Text>{field.name}</Text>
          <View style={styles.comparison}>
            <Text>Local: {field.localValue}</Text>
            <Text>Server: {field.serverValue}</Text>
          </View>
        </View>
      ))}
      
      <Button onPress={() => onResolve('local')}>Keep Local</Button>
      <Button onPress={() => onResolve('server')}>Use Server</Button>
      <Button onPress={() => onResolve('merge', mergeData(conflict))}>Merge</Button>
    </Modal>
  );
}
```

---

## 6. Local-First CRUD Operations

### 6.1 Pure Offline-First Pattern

**Core Principle**: Always write to WatermelonDB first, then sync to server via syncPush/syncPull. No direct GraphQL mutations.

| Requirement | Implementation |
|------------|----------------|
| **All operations** | Always create/update/delete in local DB first → queue operation → sync via syncPush |
| **Client ID** | Always generate UUID v7 for new entities (offline or online) |
| **Server ID mapping** | Server ID returned from syncPush maps clientId → serverId |
| **ID format** | **MUST use UUID v7** (not random numeric) for clean identity merge |

### 6.2 Implementation Pattern

**Create Entity (Always Local-First)**:
```typescript
async createEntity(entity: string, data: any): Promise<string> {
  // ALWAYS create locally first (offline-first pattern)
  const clientId = generateUUIDv7();
  
  // Insert into local DB with client ID
  await db.write(async () => {
    await db.collections.get(entity).create(record => {
      Object.assign(record, {
        ...data,
        clientId: clientId,
        version: 1,
        updatedAt: Date.now(),
        isDeleted: false,
      });
    });
  });
  
  // Queue operation for sync (will be pushed via syncPush)
  await OperationQueue.enqueue({
    entity,
    operation: 'insert',
    entityId: clientId,
    payload: {
      ...data,
      clientId,
      version: 1,
      isDeleted: false,
    },
  });
  
  // Trigger immediate sync if online (optional, for better UX)
  if (NetworkService.isOnline() && this.syncAll) {
    setTimeout(() => this.syncAll(entity), 500); // Background sync
  }
  
  return clientId; // Return clientId immediately, serverId will be mapped on sync
}
```

**Update Entity (Always Local-First)**:
```typescript
async updateEntity(id: string, update: any): Promise<Entity> {
  // Find entity in local DB
  const entity = await db.collections.get('entities').find(id);
  
  // Update in local DB
  await db.write(async () => {
    await entity.update(record => {
      record.version = (record.version || 1) + 1;
      record.updatedAt = new Date();
      // Apply update fields
      Object.assign(record, update);
    });
  });
  
  // Queue update operation
  await OperationQueue.enqueue({
    entity: 'Entity',
    operation: 'update',
    entityId: id,
    payload: {
      id: entity.serverId || entity.clientId,
      clientId: entity.clientId,
      ...update,
      version: entity.version - 1, // Send current version before increment
      isDeleted: false,
    },
  });
  
  // Trigger immediate sync if online (optional)
  if (NetworkService.isOnline() && this.syncAll) {
    setTimeout(() => this.syncAll('Entity'), 500);
  }
  
  return this.getEntity(id);
}
```

**Delete Entity (Always Local-First)**:
```typescript
async deleteEntity(id: string): Promise<void> {
  // Soft delete in local DB
  const entity = await db.collections.get('entities').find(id);
  
  await db.write(async () => {
    await entity.update(record => {
      record.isDeleted = true;
      record.version = (record.version || 1) + 1;
      record.updatedAt = new Date();
    });
  });
  
  // Queue delete operation
  await OperationQueue.enqueue({
    entity: 'Entity',
    operation: 'delete',
    entityId: id,
    payload: {
      id: entity.serverId || entity.clientId,
      clientId: entity.clientId,
      isDeleted: true,
      version: entity.version - 1,
    },
  });
  
  // Trigger immediate sync if online (optional)
  if (NetworkService.isOnline() && this.syncAll) {
    setTimeout(() => this.syncAll('Entity'), 500);
  }
}
```

### 6.3 Benefits of Pure Local-First Pattern

**Advantages**:
- ✅ **Consistency**: All operations follow the same pattern (local → queue → sync)
- ✅ **Simplicity**: No need to handle two different code paths (online vs offline)
- ✅ **Reliability**: Works seamlessly offline, no special handling needed
- ✅ **Optimistic UI**: Instant local updates, sync happens in background
- ✅ **Conflict handling**: All conflicts handled uniformly via syncPush response

**Sync Flow**:
1. User creates/updates/deletes → Local DB updated immediately
2. Operation queued in OperationQueue
3. Background sync worker calls `syncPush` (batches operations)
4. Server processes and returns server IDs + versions
5. Local DB updated with server IDs
6. `syncPull` fetches any server changes
7. Local DB merged with server changes

### 6.4 UUID v7 Generation

**Why UUID v7?**
- Time-ordered (better for sorting/indexing)
- Collision-resistant
- Standard format for distributed systems

**Implementation**:
```typescript
import { uuidv7 } from 'uuidv7';

function generateClientId(): string {
  return uuidv7(); // Returns UUID v7 string
}
```

---

## Implementation Work Breakdown

### Backend GraphQL

#### Mutation: `syncPushSpace`

```graphql
type Mutation {
  syncPushSpace(
    payload: [SyncPushItem!]!
    tenantId: ID!
  ): SyncPushResponse!
}

input SyncPushItem {
  clientId: String
  id: ID
  operation: String!  # insert | update | delete
  data: JSON!
}

type SyncPushResponse {
  results: [SyncResultItem!]!
}

type SyncResultItem {
  clientId: String
  id: ID
  success: Boolean!
  errorCode: String
  errorMessage: String
  version: Int
  updatedAt: DateTime
  conflict: ConflictPayload
}
```

#### Query: `syncPullSpace`

```graphql
type Query {
  syncPullSpace(
    lastSyncAt: DateTime
    tenantId: ID!
    limit: Int = 1000
  ): SyncPullResponse!
}

type SyncPullResponse {
  items: [JSON!]!
  deletedIds: [ID!]!        # IDs of deleted records
  lastSyncAt: DateTime!
  versionHash: String        # Hash of all record versions
  hasMore: Boolean!
}
```

### Mobile App

#### SyncService Module

```typescript
// packages/sdk/src/sync/SyncService.ts

export class SyncService {
  constructor(
    private database: Database,
    private tenantId: string,
    private graphqlService: GraphQLService
  ) {}

  /**
   * Push local mutations to server
   */
  async pushLocalMutations(entity: string): Promise<SyncResultItem[]> {
    // Get pending operations from queue
    const operations = await OperationQueue.getPendingOperations(entity);
    
    // Group by operation type and batch (max 100)
    const batches = this.groupAndBatch(operations, 100);
    
    const results: SyncResultItem[] = [];
    
    for (const batch of batches) {
      const response = await this.graphqlService.syncPushSpace({
        payload: batch,
        tenantId: this.tenantId,
      });
      
      results.push(...response.results);
      
      // Update local records with server IDs
      await this.updateLocalRecords(entity, response.results);
      
      // Clear successful operations
      await OperationQueue.clearSuccessfulOperations(response.results);
    }
    
    return results;
  }

  /**
   * Pull remote changes from server
   */
  async pullRemoteChanges(entity: string): Promise<void> {
    const syncState = await SyncState.get(entity);
    const lastSyncAt = syncState?.lastSyncAt || null;
    
    const response = await this.graphqlService.syncPullSpace({
      lastSyncAt,
      tenantId: this.tenantId,
      limit: 1000,
    });
    
    // Merge server changes into local DB
    await this.mergeRecords(entity, response.items, response.deletedIds);
    
    // Update sync state
    await SyncState.update(entity, {
      lastSyncAt: response.lastSyncAt,
      versionHash: response.versionHash,
    });
    
    // Handle pagination
    if (response.hasMore) {
      await this.pullRemoteChanges(entity);
    }
  }

  /**
   * Merge server records into local DB
   */
  async mergeRecords(
    entity: string,
    serverItems: any[],
    deletedIds: string[]
  ): Promise<void> {
    await this.database.write(async () => {
      // Handle deleted records
      for (const deletedId of deletedIds) {
        const localRecord = await this.database.collections
          .get(entity)
          .find(deletedId);
        if (localRecord) {
          await localRecord.update(record => {
            record.isDeleted = true;
          });
        }
      }
      
      // Handle updated/new records
      for (const serverItem of serverItems) {
        const localRecord = await this.database.collections
          .get(entity)
          .find(serverItem.id);
        
        if (localRecord) {
          // Check for conflicts
          const conflict = detectConflict(localRecord, serverItem);
          if (conflict) {
            // Store conflict for user resolution
            await ConflictStore.save(conflict);
          } else {
            // Update local record
            await localRecord.update(record => {
              Object.assign(record, serverItem);
            });
          }
        } else {
          // New record - insert
          await this.database.collections.get(entity).create(record => {
            Object.assign(record, serverItem);
          });
        }
      }
    });
  }

  /**
   * Resolve conflict
   */
  async resolveConflict(
    conflictId: string,
    resolution: 'local' | 'server' | 'merge',
    mergedData?: any
  ): Promise<void> {
    const conflict = await ConflictStore.get(conflictId);
    
    await this.database.write(async () => {
      const record = await this.database.collections
        .get(conflict.entity)
        .find(conflict.entityId);
      
      if (resolution === 'local') {
        // Keep local, push to server
        await this.pushLocalMutations(conflict.entity);
      } else if (resolution === 'server') {
        // Use server data
        await record.update(r => {
          Object.assign(r, conflict.serverData);
        });
      } else if (resolution === 'merge') {
        // Use merged data
        await record.update(r => {
          Object.assign(r, mergedData);
        });
        // Push merged data to server
        await this.pushLocalMutations(conflict.entity);
      }
      
      // Remove conflict
      await ConflictStore.remove(conflictId);
    });
  }
}
```

#### SyncAdapter Class

```typescript
// packages/sdk/src/sync/SyncAdapter.ts

export abstract class SyncAdapter {
  abstract getEntityName(): string;
  
  /**
   * Intercept CRUD operations and queue for sync
   */
  async create(data: any): Promise<string> {
    if (NetworkService.isOnline()) {
      // Direct push to server
      return await this.createOnline(data);
    } else {
      // Queue for offline sync
      return await this.createOffline(data);
    }
  }
  
  private async createOnline(data: any): Promise<string> {
    const result = await this.graphqlService.create(this.getEntityName(), data);
    // Insert into local DB with server ID
    await this.insertLocal(result);
    return result.id;
  }
  
  private async createOffline(data: any): Promise<string> {
    const clientId = generateUUIDv7();
    await this.insertLocal({ ...data, clientId });
    await OperationQueue.enqueue({
      entity: this.getEntityName(),
      operation: 'insert',
      entityId: clientId,
      payload: data,
    });
    return clientId;
  }
  
  abstract insertLocal(data: any): Promise<void>;
}
```

### Watermelon Integration

#### Global Queue Table

```typescript
// Schema definition
tableSchema({
  name: 'operation_queue',
  columns: [
    { name: 'id', type: 'string' },
    { name: 'entity', type: 'string' },
    { name: 'operation', type: 'string' },
    { name: 'entity_id', type: 'string' },
    { name: 'payload', type: 'string' },
    { name: 'status', type: 'string' },
    { name: 'attempts', type: 'number' },
    { name: 'last_error', type: 'string', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
})

// Model
export class OperationQueue extends Model {
  static table = 'operation_queue';
  
  @field('entity') entity!: string;
  @field('operation') operation!: string;
  @field('entity_id') entityId!: string;
  @field('payload') payload!: string;
  @field('status') status!: string;
  @field('attempts') attempts!: number;
  @field('last_error') lastError?: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
```

#### Wrap CRUD Calls

```typescript
// Intercept insert/update/delete => queue

class OfflineFirstService {
  async addItem(data: any): Promise<string> {
    // Insert into local DB
    const id = await this.insertLocal(data);
    
    // Queue operation if offline
    if (!NetworkService.isOnline()) {
      await OperationQueue.enqueue({
        entity: this.entityName,
        operation: 'insert',
        entityId: id,
        payload: data,
      });
    }
    
    return id;
  }
  
  async updateItem(id: string, data: any): Promise<void> {
    // Update local DB
    await this.updateLocal(id, data);
    
    // Queue operation if offline
    if (!NetworkService.isOnline()) {
      await OperationQueue.enqueue({
        entity: this.entityName,
        operation: 'update',
        entityId: id,
        payload: data,
      });
    }
  }
  
  async deleteItem(id: string): Promise<void> {
    // Soft delete in local DB
    await this.deleteLocal(id);
    
    // Queue operation if offline
    if (!NetworkService.isOnline()) {
      await OperationQueue.enqueue({
        entity: this.entityName,
        operation: 'delete',
        entityId: id,
        payload: { isDeleted: true },
      });
    }
  }
}
```

### Event Triggers

```typescript
// Sync on various events

class SyncEventManager {
  constructor(private syncService: SyncService) {
    this.setupEventListeners();
  }
  
  setupEventListeners(): void {
    // App open
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        this.syncService.syncOnAppOpen();
      }
    });
    
    // 5min interval
    setInterval(() => {
      this.syncService.syncOnInterval();
    }, 5 * 60 * 1000);
    
    // Manual sync
    // (exposed via UI button)
    
    // Network regained
    NetworkService.subscribe((isOnline) => {
      if (isOnline) {
        this.syncService.syncOnNetworkRegained();
      }
    });
  }
}
```

---

## Testing Matrix

| Test Case | Expected Behavior |
|-----------|-------------------|
| **Offline create 10 items → online** | Items push to server stable, no duplicates |
| **2 tenants A + B sync separately** | No leak cross-tenant, complete isolation |
| **Conflict: same record both update** | Show user choose modal with diff |
| **Force from server** | Local fully replaced, no data loss |
| **Force push local** | Server accept local override, then sync normal |
| **Create (online/offline)** | Always create in WatermelonDB first with UUID v7, queue operation, sync via syncPush |
| **Update (online/offline)** | Always update in WatermelonDB first, queue operation, sync via syncPush |
| **Delete (online/offline)** | Always soft delete in WatermelonDB first, queue operation, sync via syncPush |
| **Network flakiness** | Retry with exponential backoff, no duplicates |
| **Large batch (10k items)** | Batched correctly, all sync successfully |
| **App killed during sync** | Resume on restart, no data loss |

---

## Next Steps

1. **Review and approve** this architecture design
2. **Implement Phase 0 updates** (multi-tenant DB, operation queue)
3. **Implement Phase 1 updates** (two-way sync with atomic operations)
4. **Implement conflict resolution** (Phase 2)
5. **Add force sync UI** (Phase 3)
6. **Comprehensive testing** (Phase 3)

---

## Related Documentation

- [Phase 0: Foundation](./offline-first-phase-0-foundation.md)
- [Phase 1: Basic Sync](./offline-first-phase-1-basic-sync.md)
- [Phase 2: Robustness](./offline-first-phase-2-robustness.md)
- [Epic Overview](./offline-first-epic.md)

