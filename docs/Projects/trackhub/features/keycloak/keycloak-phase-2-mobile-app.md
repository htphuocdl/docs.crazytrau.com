---
id: keycloak-phase-2-mobile-app
title: "Phase 2: Mobile App Authentication Migration"
sidebar_label: "Phase 2 - Mobile App"
---

# Phase 2: Mobile App Authentication Migration

**Phase ID**: `PHASE-KEYCLOAK-002`  
**Status**: `TODO[]`  
**Start Date**: TBD (After Phase 1)  
**Target Completion**: TBD  
**Dependencies**: Phase 1 completed

## Overview

Migrate React Native mobile app (`app/trackhub`) from custom authentication to Keycloak OAuth2/OIDC flow while maintaining backward compatibility during transition.

## Objectives

- [ ] Integrate Keycloak OAuth2 flow in React Native app
- [ ] Replace AsyncStorage with secure Keychain storage
- [ ] Update Redux auth slice to work with Keycloak tokens
- [ ] Migrate GraphQL client to use Keycloak tokens
- [ ] Maintain backward compatibility with existing auth
- [ ] Support all mini-apps (host, checklist, keezy, coreCrt)

## Tasks Breakdown

### Task 2.1: Keycloak Mobile Client Configuration
**Task ID**: `TASK-KEYCLOAK-002-001`  
**Status**: `TODO[]`  
**Assignee**: Backend  
**Estimated Effort**: 2 days

#### Checklist
- [ ] Create `mobile-app` client in Keycloak realm
- [ ] Configure client settings:
  - [ ] Client ID: `mobile-app`
  - [ ] Access Type: `public`
  - [ ] Valid Redirect URIs: configured for deep linking
  - [ ] Enabled flows: Authorization Code with PKCE
  - [ ] Refresh token enabled
  - [ ] Offline access scope (if needed)
- [ ] Configure custom claims mappers for mobile context
- [ ] Setup deep linking URL scheme (e.g., `trackhub://auth/callback`)
- [ ] Document mobile client configuration

#### Acceptance Criteria (AC)
- ✅ Client `mobile-app` exists with correct settings
- ✅ Deep linking URLs configured correctly
- ✅ PKCE flow enabled for security
- ✅ Custom claims (`projectId`, `tenantId`, `userId`, `roleId`) included in tokens
- ✅ Configuration documented
- ✅ Test authentication flow from Keycloak Admin UI

#### Technical Notes
- Deep linking scheme: `trackhub://auth/callback`
- Use PKCE (Proof Key for Code Exchange) for OAuth2
- Token lifetime: 15 minutes (access), 24 hours (refresh) for mobile

---

### Task 2.2: React Native Keycloak Integration
**Task ID**: `TASK-KEYCLOAK-002-002`  
**Status**: `TODO[]`  
**Assignee**: Mobile Developer  
**Estimated Effort**: 1.5 weeks

#### Checklist
- [ ] Install React Native dependencies:
  ```json
  {
    "react-native-app-auth": "^7.2.0",
    "@react-native-keychain/react-native-keychain": "^8.1.3",
    "react-native-linking": "latest"
  }
  ```
- [ ] Create Keycloak configuration:
  - [ ] Keycloak server URL
  - [ ] Client ID
  - [ ] Redirect URL for deep linking
  - [ ] Scopes: `openid profile email offline_access`
- [ ] Create `KeycloakAuthService` class
- [ ] Implement `login()` method using `react-native-app-auth`
- [ ] Implement `logout()` method
- [ ] Implement `refreshToken()` method
- [ ] Implement `getCurrentUser()` method
- [ ] Handle deep linking for OAuth callback
- [ ] Configure deep linking in `app.json` / `AndroidManifest.xml` / `Info.plist`
- [ ] Update `AuthServiceFactory` to support Keycloak
- [ ] Add feature flag to toggle between old/new auth
- [ ] Handle authentication errors gracefully
- [ ] Add loading states

#### Acceptance Criteria (AC)
- ✅ User can login via Keycloak from mobile app
- ✅ OAuth flow redirects to Keycloak login page
- ✅ After login, redirects back to app via deep linking
- ✅ Tokens stored securely in Keychain (iOS) / Keystore (Android)
- ✅ Token refresh works automatically
- ✅ Logout clears tokens and session
- ✅ Error handling for network failures, user cancellation
- ✅ Feature flag allows rolling back to old auth
- ✅ Works on both iOS and Android
- ✅ Unit tests for KeycloakAuthService (>80% coverage)

#### Technical Notes
- Use `react-native-app-auth` for OAuth2 flow
- Store tokens in Keychain, NOT AsyncStorage
- Automatic token refresh 2 minutes before expiration
- Handle deep linking: `trackhub://auth/callback?code=xxx&state=xxx`

---

### Task 2.3: Secure Token Storage Migration
**Task ID**: `TASK-KEYCLOAK-002-003`  
**Status**: `TODO[]`  
**Assignee**: Mobile Developer  
**Estimated Effort**: 3 days

#### Checklist
- [ ] Replace AsyncStorage token storage with Keychain
- [ ] Create `SecureStorage` utility class
- [ ] Implement Keychain wrappers:
  - [ ] `storeToken(key, value)`
  - [ ] `getToken(key)`
  - [ ] `deleteToken(key)`
  - [ ] `clearAllTokens()`
- [ ] Migrate token storage in `AuthProvider.tsx`
- [ ] Update `authSlice.ts` to use secure storage
- [ ] Handle Keychain errors (permissions, locked device)
- [ ] Add biometric unlock option (optional)
- [ ] Test on iOS (Keychain)
- [ ] Test on Android (Keystore)
- [ ] Test token persistence across app restarts
- [ ] Test token clearing on logout

#### Acceptance Criteria (AC)
- ✅ Tokens stored in Keychain/Keystore (not AsyncStorage)
- ✅ Tokens persist across app restarts
- ✅ Tokens cleared on logout
- ✅ Works on locked devices (when biometric enabled)
- ✅ Error handling for Keychain failures
- ✅ No tokens in AsyncStorage (security audit passed)
- ✅ Migration script to move existing tokens from AsyncStorage to Keychain
- ✅ Unit tests for SecureStorage utility

#### Technical Notes
- iOS: Use `@react-native-keychain/react-native-keychain`
- Android: Uses Android Keystore via same library
- Store access token, refresh token, and ID token separately
- Use biometric protection for sensitive tokens (optional)

---

### Task 2.4: Redux Auth Slice Update
**Task ID**: `TASK-KEYCLOAK-002-004`  
**Status**: `TODO[]`  
**Assignee**: Mobile Developer  
**Estimated Effort**: 4 days

#### Checklist
- [ ] Review current `authSlice.ts` implementation
- [ ] Update `authSlice` to support Keycloak tokens:
  - [ ] Store Keycloak access token
  - [ ] Store Keycloak ID token (for user info)
  - [ ] Store refresh token
  - [ ] Extract claims from ID token (`userId`, `tenantId`, `projectId`, `roleId`)
- [ ] Update `signInSuccess` action to handle Keycloak tokens
- [ ] Update `signOut` action to clear Keycloak tokens
- [ ] Add `refreshToken` action
- [ ] Update `AuthBridge` to use Keycloak token format
- [ ] Update `buildAuthHeaders()` to use Keycloak access token
- [ ] Maintain backward compatibility with old token format (feature flag)
- [ ] Update token refresh logic in `AuthProvider`
- [ ] Test Redux state updates

#### Acceptance Criteria (AC)
- ✅ Redux auth state works with Keycloak tokens
- ✅ `authCtx` includes all required fields (`userId`, `tenantId`, `projectId`, `roleId`)
- ✅ Token refresh updates Redux state correctly
- ✅ Logout clears Redux state
- ✅ Backward compatibility maintained (old tokens still work)
- ✅ Headers built correctly from Keycloak tokens
- ✅ Unit tests for auth slice updates
- ✅ Integration tests with Keycloak

#### Technical Notes
- Parse ID token to extract claims (JWT decode)
- Keep old token format support for migration period
- Use middleware to automatically refresh expired tokens

---

### Task 2.5: GraphQL Client Integration
**Task ID**: `TASK-KEYCLOAK-002-005`  
**Status**: `TODO[]`  
**Assignee**: Mobile Developer  
**Estimated Effort**: 3 days

#### Checklist
- [ ] Update Apollo Client configuration
- [ ] Update `headersProvider` in `AuthBridge`:
  - [ ] Use Keycloak access token in `Authorization` header
  - [ ] Keep custom headers (`crt-project-id`, `crt-tenant-id`, etc.) from token claims
- [ ] Handle token refresh in Apollo Client:
  - [ ] Intercept 401 responses
  - [ ] Refresh token automatically
  - [ ] Retry original request
- [ ] Update all GraphQL queries/mutations to work with Keycloak tokens
- [ ] Test GraphQL requests with Keycloak tokens
- [ ] Test token refresh flow
- [ ] Test error handling (expired tokens, invalid tokens)
- [ ] Update Reactotron integration (if needed)

#### Acceptance Criteria (AC)
- ✅ Apollo Client includes Keycloak token in requests
- ✅ GraphQL queries work with Keycloak authentication
- ✅ GraphQL mutations work with Keycloak authentication
- ✅ Automatic token refresh on 401 errors
- ✅ Custom headers extracted from token claims
- ✅ Error handling for authentication failures
- ✅ No breaking changes to existing GraphQL usage
- ✅ Integration tests pass

#### Technical Notes
- Use Apollo Client link to inject token
- Implement retry logic for token refresh
- Log authentication errors for debugging

---

### Task 2.6: Mini-Apps Integration
**Task ID**: `TASK-KEYCLOAK-002-006`  
**Status**: `TODO[]`  
**Assignee**: Mobile Developer  
**Estimated Effort**: 3 days

#### Checklist
- [ ] Verify host app Keycloak integration works
- [ ] Test checklist mini-app with Keycloak auth
- [ ] Test keezy mini-app with Keycloak auth
- [ ] Test coreCrt mini-app with Keycloak auth
- [ ] Ensure shared SDK auth works for all apps
- [ ] Test context passing between host and mini-apps
- [ ] Test SSO between mini-apps (user logged in once)
- [ ] Update documentation for mini-apps

#### Acceptance Criteria (AC)
- ✅ All mini-apps work with Keycloak authentication
- ✅ SSO works across all apps (login once, access all)
- ✅ Context sharing works correctly
- ✅ No authentication issues in mini-apps
- ✅ Documentation updated

#### Technical Notes
- All mini-apps use shared SDK from `packages/sdk`
- Auth context shared via Redux store
- No need for separate Keycloak setup per mini-app

---

### Task 2.7: Testing & QA
**Task ID**: `TASK-KEYCLOAK-002-007`  
**Status**: `TODO[]`  
**Assignee**: QA/Mobile Developer  
**Estimated Effort**: 1 week

#### Checklist
- [ ] Create test users in Keycloak
- [ ] Test login flow (happy path)
- [ ] Test logout flow
- [ ] Test token refresh
- [ ] Test deep linking scenarios
- [ ] Test error scenarios:
  - [ ] Invalid credentials
  - [ ] Network failures
  - [ ] Expired tokens
  - [ ] User cancellation
- [ ] Test on iOS devices (various versions)
- [ ] Test on Android devices (various versions)
- [ ] Test multi-tenant scenarios
- [ ] Test offline token refresh
- [ ] Performance testing (concurrent logins)
- [ ] Security testing (token manipulation)
- [ ] Test backward compatibility (old auth still works)
- [ ] Regression testing

#### Acceptance Criteria (AC)
- ✅ All test scenarios pass
- ✅ Works on iOS 14+ and Android 10+
- ✅ Performance acceptable (< 3s login flow)
- ✅ Security vulnerabilities addressed
- ✅ No regression in existing functionality
- ✅ Test coverage > 80%
- ✅ Test documentation updated

#### Technical Notes
- Test on physical devices (not just simulators)
- Test with slow network conditions
- Test with Keycloak server offline scenarios

---

## Integration Points

### Mobile App → Keycloak
- OAuth2 Authorization Code flow with PKCE
- Deep linking for OAuth callback
- Token refresh endpoint

### Mobile App → Backend
- GraphQL requests with Keycloak access token
- Custom headers from token claims

### Mini-Apps → Host App
- Shared Redux auth state
- Shared Keycloak tokens via SDK

## Dependencies

### External
- Keycloak server running (Phase 1)
- Mobile client configured (Task 2.1)
- Deep linking infrastructure

### Internal
- Phase 1 completed
- Backend JWT validation working (Phase 1)
- Mobile app build system working
- Feature flag system in place

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deep linking complexity | High | Use proven libraries, thorough testing |
| Token storage migration | Medium | Gradual migration, backup strategy |
| Mini-app compatibility | Medium | Shared SDK, comprehensive testing |
| User experience disruption | High | Feature flag, gradual rollout |
| Performance issues | Medium | Performance testing, optimization |

## Feature Flag Strategy

```typescript
// Feature flag to toggle between old and new auth
const USE_KEYCLOAK_AUTH = process.env.USE_KEYCLOAK_AUTH === 'true';
```

- Phase 2.1-2.6: Development with feature flag OFF (old auth active)
- Phase 2.7: Testing with feature flag ON for test users
- Post-Phase 2: Gradually enable for all users

## Definition of Done

Phase 2 is considered complete when:

- [ ] All tasks (2.1 - 2.7) marked as `TODO[x]` (completed)
- [ ] Mobile app users can login via Keycloak
- [ ] Tokens stored securely in Keychain
- [ ] All mini-apps work with Keycloak
- [ ] Backward compatibility maintained
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged
- [ ] Documentation updated
- [ ] Staging deployment successful
- [ ] QA sign-off received
- [ ] Team demo completed

## Next Steps

After Phase 2 completion:
- Begin Phase 3: Social Login Integration
- Begin Phase 4: Passkey/WebAuthn Support (can run in parallel)
- Monitor mobile app authentication metrics

