---
id: offline-first-phase-2
title: "Phase 2: Robustness"
sidebar_label: "Phase 2: Robustness"
---

# Phase 2: Robustness

**Status**: `TODO[]`  
**Phase ID**: `EPIC-OFFLINE-001-P2`  
**Dependencies**: Phase 1 completed  
**Estimated Effort**: 3-4 weeks  
**Owner**: TBD

## Overview

Enhance sync reliability with comprehensive conflict resolution, idempotency guarantees, media upload queue, and improved error handling. This phase makes the sync system production-ready.

## Objectives

- Implement comprehensive conflict detection and resolution
- Ensure idempotency across all operations
- Create media upload queue system
- Improve error handling and retry strategies
- Add conflict resolution UI components

## Tasks

### BE-2.1: Implement Conflict Detection Logic

**Status**: `TODO[]`  
**Owner**: Backend Team Lead  
**Effort**: 5 days

**Description**: Detect conflicts when client and server have diverged. **CRITICAL**: Use timestamp-based conflict detection (best practice like Notion/Linear).

**Checklist**:
- [ ] **Detect conflicts: server.updatedAt > local.updatedAt** (server wins - auto-resolve)
- [ ] **Detect conflicts: local.updatedAt > server.updatedAt** (local wins - auto-resolve)
- [ ] **Detect conflicts: equal timestamp but different data** (user resolve)
- [ ] **Detect conflicts: version mismatch** (user resolve)
- [ ] Create `ConflictPayload` type with serverData, clientData, serverVersion, localVersion, timestamps
- [ ] Return conflict payload in `SyncResultItem` when conflict detected
- [ ] Add conflict detection per field (optional, for granular merges)
- [ ] Write unit tests for conflict detection

**Acceptance Criteria**:
- Conflicts are detected accurately using timestamp comparison
- Auto-resolve works for timestamp-based conflicts (server newer → server wins, local newer → local wins)
- User resolution required for equal timestamps
- Conflict payload contains all necessary data
- No false positives or negatives

**Conflict Detection Logic**:
```typescript
function detectConflict(localRecord: any, serverRecord: any): ConflictRecord | null {
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
    return { conflictType: 'timestamp', ... };
  }
  
  // Case 4: Version mismatch → user resolve
  if (localRecord.version !== serverRecord.version) {
    return { conflictType: 'version', ... };
  }
  
  return null; // No conflict
}
```

**GraphQL Schema Addition**:
```graphql
type ConflictPayload {
  serverData: JSON
  clientData: JSON
  serverVersion: Int
  resolutionSuggested: JSON
}

type SyncResultItem {
  # ... existing fields
  conflict: ConflictPayload
}
```

---

### BE-2.2: Implement Server-Side Merge Strategies

**Status**: `TODO[]`  
**Owner**: Backend Team Lead  
**Effort**: 6 days

**Description**: Implement domain-specific merge functions for automatic conflict resolution.

**Checklist**:
- [ ] Define merge strategy per entity type (configurable)
- [ ] Implement "last write wins" strategy (default for personal data)
- [ ] Implement "server merge" strategy (append arrays, sum numbers, etc.)
- [ ] Implement "manual merge" strategy (return conflict for user resolution)
- [ ] Create merge configuration system
- [ ] Generate `resolutionSuggested` in conflict payload
- [ ] Write unit tests for each merge strategy

**Acceptance Criteria**:
- Merge strategies work correctly
- Configurable per entity
- `resolutionSuggested` is accurate

**Merge Strategy Examples**:
- **Personal data** (user profile): Last write wins
- **Collaborative data** (comments): Append to array
- **Numeric fields** (counters): Sum values
- **Critical data** (financial): Manual merge required

---

### BE-2.3: Enhance Idempotency Guarantees

**Status**: `TODO[]`  
**Owner**: Backend Team Lead  
**Effort**: 4 days

**Description**: Ensure all operations are idempotent and handle duplicate requests.

**Checklist**:
- [ ] Implement deduplication by `clientId` + `clientMutationId`
- [ ] Store deduplication keys with timestamps
- [ ] Return same response for duplicate requests
- [ ] Clean up old deduplication keys (TTL)
- [ ] Handle edge cases (same request retried multiple times)
- [ ] Write unit tests

**Acceptance Criteria**:
- No duplicate operations processed
- Same response for duplicate requests
- Deduplication keys cleaned up appropriately

---

### BE-2.4: Media Upload Endpoints

**Status**: `TODO[]`  
**Owner**: Backend Team Lead  
**Effort**: 5 days

**Description**: Create endpoints for media upload (signed URLs or multipart upload).

**Checklist**:
- [ ] Create endpoint to request signed upload URL
- [ ] Support multipart upload for large files
- [ ] Implement upload validation (size, type)
- [ ] Return CDN/storage URL after upload
- [ ] Add upload progress tracking (optional)
- [ ] Implement upload lifecycle management
- [ ] Write unit tests

**Acceptance Criteria**:
- Signed URLs work correctly
- Large files can be uploaded
- Upload validation works
- URLs are returned correctly

---

### RN-2.1: Implement Conflict Resolution Engine

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 6 days

**Description**: Handle conflicts on client side with auto-merge and conflict records.

**Checklist**:
- [ ] Create conflict record table in local DB
- [ ] Store conflicts when received from server
- [ ] Implement auto-merge for simple conflicts (last write wins)
- [ ] Apply server merge resolution when available
- [ ] Create conflict record for manual resolution
- [ ] Implement conflict resolution API
- [ ] Write unit tests

**Acceptance Criteria**:
- Conflicts are stored correctly
- Auto-merge works for simple cases
- Conflict records are created for manual resolution

---

### RN-2.2: Enhance Retry Logic with Exponential Backoff

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 4 days

**Description**: Implement sophisticated retry logic with exponential backoff.

**Checklist**:
- [ ] Implement exponential backoff algorithm
- [ ] Add max retry attempts (e.g., 8)
- [ ] Differentiate retryable errors (5xx, network) vs non-retryable (4xx validation)
- [ ] Track retry attempts in outbox
- [ ] Implement backoff jitter to avoid thundering herd
- [ ] Add retry delay configuration
- [ ] Write unit tests

**Acceptance Criteria**:
- Exponential backoff works correctly
- Non-retryable errors are not retried
- Max attempts are respected
- Jitter prevents synchronization

**Retry Logic**:
```typescript
const calculateBackoff = (attempt: number): number => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 60000; // 60 seconds
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  const jitter = Math.random() * 0.3 * delay; // 30% jitter
  return delay + jitter;
};
```

---

### RN-2.3: Implement Media Upload Queue

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 6 days

**Description**: Create background upload queue for media files.

**Checklist**:
- [ ] Implement upload queue table (`uploads`)
- [ ] Create upload worker (background task)
- [ ] Implement chunked upload for large files
- [ ] Implement resume capability for failed uploads
- [ ] Track upload progress
- [ ] Handle upload retries
- [ ] Update entity with `remoteUrl` after upload success
- [ ] Trigger entity sync after upload completes
- [ ] Write unit tests

**Acceptance Criteria**:
- Files upload in background
- Large files upload in chunks
- Failed uploads can resume
- Progress is tracked
- Entity sync triggered after upload

**Upload Flow**:
1. User selects file → save to local storage
2. Create upload record in `uploads` table
3. Upload worker picks up pending uploads
4. Request signed URL from server
5. Upload file (chunked if large)
6. Update upload record with `remoteUrl`
7. Update entity with `remoteUrl`
8. Trigger entity sync

---

### RN-2.4: Conflict Resolution UI Components

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 5 days

**Description**: Create UI components for manual conflict resolution. **CRITICAL**: Build thin diff modal (not fancy rich diff), show only fields changed.

**Checklist**:
- [ ] Create conflict list screen
- [ ] Create conflict detail screen showing server vs client data
- [ ] **Build record diff modal (thin, lightweight)** (⏳ Pending)
- [ ] **Show only fields changed** (⏳ Pending - no fancy rich diff)
- [ ] **Side-by-side comparison** (⏳ Pending)
- [ ] Implement "accept server" action
- [ ] Implement "keep client" action
- [ ] Implement "merge manually" action (if applicable)
- [ ] Show conflict indicators in UI
- [ ] Add conflict notification system
- [ ] Write UI tests

**Acceptance Criteria**:
- Users can view conflicts
- Users can resolve conflicts
- Conflicts are clearly indicated
- Resolution actions work correctly
- Diff modal is lightweight and shows only changed fields

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

---

### RN-2.5: Undo Snapshot System

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 4 days

**Description**: Create snapshot system for undo when conflicts override local changes.

**Checklist**:
- [ ] Create snapshot table in local DB
- [ ] Take snapshot before applying server conflict resolution
- [ ] Implement undo API (restore from snapshot)
- [ ] Add snapshot cleanup (TTL, max count)
- [ ] Show undo option in conflict resolution UI
- [ ] Write unit tests

**Acceptance Criteria**:
- Snapshots are created before conflicts
- Undo restores previous state
- Snapshots are cleaned up appropriately

---

### RN-2.6: Enhanced Error Handling

**Status**: `TODO[]`  
**Owner**: Mobile Team Lead  
**Effort**: 3 days

**Description**: Improve error handling and user feedback.

**Checklist**:
- [ ] Categorize errors (network, validation, conflict, server)
- [ ] Create user-friendly error messages
- [ ] Add error recovery actions (retry, dismiss, report)
- [ ] Log errors for debugging
- [ ] Handle edge cases (partial batch failures, network interruptions)
- [ ] Write unit tests

**Acceptance Criteria**:
- Errors are categorized correctly
- User-friendly messages displayed
- Recovery actions work
- Errors are logged appropriately

---

## Testing Requirements

### Unit Tests
- [ ] Conflict detection logic
- [ ] Merge strategies
- [ ] Idempotency checks
- [ ] Retry logic with backoff
- [ ] Upload queue operations

### Integration Tests
- [ ] Conflict resolution flow
- [ ] Upload → entity sync flow
- [ ] Retry scenarios
- [ ] Idempotency scenarios

### E2E Tests
- [ ] Conflict detection and resolution
- [ ] Media upload offline → sync
- [ ] Network flakiness scenarios
- [ ] Large batch sync with conflicts

## Deliverables

1. ✅ Conflict detection and resolution system
2. ✅ Server-side merge strategies
3. ✅ Enhanced idempotency
4. ✅ Media upload queue
5. ✅ Conflict resolution UI
6. ✅ Undo snapshot system
7. ✅ Enhanced error handling

## Dependencies

**Blocking**:
- Phase 1 (Basic Sync) must be completed

**Blocked By**:
- Phase 3 (UX & QA) depends on this phase

## Risks

| Risk | Mitigation |
|------|------------|
| Conflict resolution UX confusion | Clear UI, auto-merge where possible |
| Upload failures causing data inconsistency | Robust retry, resume capability |
| Complex merge logic bugs | Extensive testing, gradual rollout |

## Success Criteria

- [ ] All tasks completed
- [ ] Conflict resolution works correctly
- [ ] Media uploads work reliably
- [ ] Error handling is robust
- [ ] Ready for Phase 3

