---
id: keycloak-phase-4-passkey
title: "Phase 4: Passkey/WebAuthn Support"
sidebar_label: "Phase 4 - Passkey"
---

# Phase 4: Passkey/WebAuthn Support

**Phase ID**: `PHASE-KEYCLOAK-004`  
**Status**: `TODO[]`  
**Start Date**: TBD (After Phase 2, can run parallel with Phase 3)  
**Target Completion**: TBD  
**Dependencies**: Phase 2 completed

## Overview

Enable passwordless authentication using WebAuthn/Passkey technology, allowing users to authenticate using biometrics (fingerprint, face recognition) or device security keys.

## Objectives

- [ ] Enable WebAuthn authentication in Keycloak
- [ ] Implement Passkey registration flow
- [ ] Implement Passkey authentication flow in mobile app
- [ ] Implement Passkey authentication flow in admin portal
- [ ] Support multiple Passkeys per user
- [ ] Handle Passkey management (add, remove, rename)

## Tasks Breakdown

### Task 4.1: Keycloak WebAuthn Configuration
**Task ID**: `TASK-KEYCLOAK-004-001`  
**Status**: `TODO[]`  
**Assignee**: Backend  
**Estimated Effort**: 2 days

#### Checklist
- [ ] Verify Keycloak version supports WebAuthn (v22+)
- [ ] Enable WebAuthn authentication flow in Keycloak realm:
  - [ ] Add WebAuthn authenticator to authentication flow
  - [ ] Configure WebAuthn settings:
    - [ ] Relying Party Name: Trackhub
    - [ ] Relying Party ID: domain name
    - [ ] Signature Algorithms: ES256, RS256
    - [ ] Attestation: Direct (for mobile), None (for web)
    - [ ] Resident Keys: Required (for Passkeys)
- [ ] Configure WebAuthn policy:
  - [ ] User verification: Required (biometric)
  - [ ] Authenticator attachment: Platform (mobile), Cross-platform (USB keys)
  - [ ] Timeout: 60 seconds
- [ ] Test WebAuthn registration from Keycloak Admin UI
- [ ] Test WebAuthn authentication from Keycloak Admin UI

#### Acceptance Criteria (AC)
- ✅ WebAuthn enabled in Keycloak realm
- ✅ WebAuthn authentication flow configured
- ✅ Registration flow works from Admin UI
- ✅ Authentication flow works from Admin UI
- ✅ Configuration documented
- ✅ Supports both platform (mobile) and cross-platform (USB) authenticators

#### Technical Notes
- Keycloak 22+ required for full WebAuthn/Passkey support
- Relying Party ID must match domain (HTTPS required)
- Resident keys enable Passkey functionality

---

### Task 4.2: Mobile App Passkey Registration
**Task ID**: `TASK-KEYCLOAK-004-002`  
**Status**: `TODO[]`  
**Assignee**: Mobile Developer  
**Estimated Effort**: 1.5 weeks

#### Checklist
- [ ] Install React Native WebAuthn libraries:
  ```json
  {
    "react-native-webauthn": "^1.0.0",
    "@react-native-async-storage/async-storage": "^2.0.0"
  }
  ```
- [ ] Check device WebAuthn support:
  - [ ] iOS: Check `PublicKeyCredential` API availability
  - [ ] Android: Check WebView WebAuthn support
- [ ] Create Passkey registration UI:
  - [ ] Add "Register Passkey" button in profile/settings
  - [ ] Passkey name input field
  - [ ] Biometric prompt UI
  - [ ] Success/error messages
- [ ] Implement Passkey registration flow:
  - [ ] Initiate registration from Keycloak (get challenge)
  - [ ] Call native WebAuthn API to create credential
  - [ ] Send credential to Keycloak for registration
  - [ ] Store Passkey metadata locally
- [ ] Handle registration errors:
  - [ ] User cancellation
  - [ ] Device not supported
  - [ ] Biometric not available
  - [ ] Network failures
- [ ] Test Passkey registration on iOS
- [ ] Test Passkey registration on Android

#### Acceptance Criteria (AC)
- ✅ Users can register Passkeys from mobile app
- ✅ Biometric prompt appears correctly
- ✅ Passkey registration completes successfully
- ✅ Passkey metadata stored and accessible
- ✅ Error handling works correctly
- ✅ Works on iOS 14+ and Android 10+
- ✅ UI/UX clear and intuitive
- ✅ Unit tests for registration flow

#### Technical Notes
- iOS: Use `PublicKeyCredential` Web API (iOS 14+)
- Android: Use WebView WebAuthn (Android 10+)
- Platform authenticators use device biometrics
- Store Passkey info in Keychain/Keystore

---

### Task 4.3: Mobile App Passkey Authentication
**Task ID**: `TASK-KEYCLOAK-004-003`  
**Status**: `TODO[]`  
**Assignee**: Mobile Developer  
**Estimated Effort**: 1.5 weeks

#### Checklist
- [ ] Create Passkey login UI:
  - [ ] Add "Login with Passkey" option on login screen
  - [ ] Show available Passkeys if multiple
  - [ ] Biometric prompt UI
- [ ] Implement Passkey authentication flow:
  - [ ] Initiate authentication from Keycloak (get challenge)
  - [ ] Call native WebAuthn API to authenticate
  - [ ] Send authentication response to Keycloak
  - [ ] Receive Keycloak tokens
  - [ ] Store tokens in secure storage
- [ ] Handle multiple Passkeys:
  - [ ] Show list of Passkeys if multiple registered
  - [ ] Allow user to select Passkey
- [ ] Handle authentication errors:
  - [ ] User cancellation
  - [ ] Passkey not found
  - [ ] Biometric authentication failed
  - [ ] Network failures
- [ ] Update `KeycloakAuthService`:
  - [ ] Add `loginWithPasskey()` method
- [ ] Test Passkey authentication on iOS
- [ ] Test Passkey authentication on Android

#### Acceptance Criteria (AC)
- ✅ Users can login with Passkeys
- ✅ Biometric authentication works correctly
- ✅ Multiple Passkeys supported
- ✅ Error handling works correctly
- ✅ Works on iOS 14+ and Android 10+
- ✅ Authentication flow < 3 seconds
- ✅ Unit tests for authentication flow

#### Technical Notes
- Use same WebAuthn API as registration
- Keycloak handles Passkey validation
- Store tokens same way as password login

---

### Task 4.4: Admin Portal Passkey Support
**Task ID**: `TASK-KEYCLOAK-004-004`  
**Status**: `TODO[]`  
**Assignee**: Frontend Developer  
**Estimated Effort**: 1 week

#### Checklist
- [ ] Check browser WebAuthn support
- [ ] Create Passkey registration UI in admin portal:
  - [ ] "Register Passkey" button in account settings
  - [ ] Passkey name input
  - [ ] Registration flow
- [ ] Implement Passkey registration:
  - [ ] Call Keycloak WebAuthn registration endpoint
  - [ ] Use browser WebAuthn API (`navigator.credentials.create()`)
  - [ ] Send credential to Keycloak
- [ ] Create Passkey login UI:
  - [ ] "Login with Passkey" option on login page
- [ ] Implement Passkey authentication:
  - [ ] Call Keycloak WebAuthn authentication endpoint
  - [ ] Use browser WebAuthn API (`navigator.credentials.get()`)
  - [ ] Process Keycloak tokens
- [ ] Handle Passkey management:
  - [ ] List registered Passkeys
  - [ ] Remove Passkeys
  - [ ] Rename Passkeys
- [ ] Test in Chrome, Firefox, Safari, Edge

#### Acceptance Criteria (AC)
- ✅ Users can register Passkeys from admin portal
- ✅ Users can login with Passkeys from admin portal
- ✅ Passkey management works
- ✅ Works in all modern browsers
- ✅ Error handling implemented
- ✅ UI follows design system

#### Technical Notes
- Browser WebAuthn API: `navigator.credentials.create()` and `navigator.credentials.get()`
- HTTPS required for WebAuthn
- Cross-platform authenticators (USB keys) supported

---

### Task 4.5: Passkey Management
**Task ID**: `TASK-KEYCLOAK-004-005`  
**Status**: `TODO[]`  
**Assignee**: Mobile/Frontend Developer  
**Estimated Effort**: 1 week

#### Checklist
- [ ] Create Passkey management UI in mobile app:
  - [ ] List registered Passkeys in profile/settings
  - [ ] Show Passkey name, creation date
  - [ ] "Remove Passkey" action
  - [ ] "Rename Passkey" action
- [ ] Create Passkey management UI in admin portal:
  - [ ] List registered Passkeys in account settings
  - [ ] Remove, rename actions
- [ ] Implement Passkey removal:
  - [ ] Call Keycloak API to remove Passkey
  - [ ] Update local storage
- [ ] Implement Passkey rename:
  - [ ] Call Keycloak API to update Passkey name
  - [ ] Update local storage
- [ ] Handle edge cases:
  - [ ] Last Passkey removal (prevent lockout)
  - [ ] Passkey not found errors
- [ ] Test Passkey management flows

#### Acceptance Criteria (AC)
- ✅ Users can view registered Passkeys
- ✅ Users can remove Passkeys
- ✅ Users can rename Passkeys
- ✅ Last Passkey removal prevented (or requires password)
- ✅ UI clear and intuitive
- ✅ Works on mobile and web

#### Technical Notes
- Keycloak provides APIs for Passkey management
- Prevent removing last Passkey (require password backup)

---

### Task 4.6: Testing & QA
**Task ID**: `TASK-KEYCLOAK-004-006`  
**Status**: `TODO[]`  
**Assignee**: QA  
**Estimated Effort**: 1 week

#### Checklist
- [ ] Test Passkey registration on iOS
- [ ] Test Passkey registration on Android
- [ ] Test Passkey registration on web browsers
- [ ] Test Passkey authentication on all platforms
- [ ] Test multiple Passkeys per user
- [ ] Test Passkey management
- [ ] Test error scenarios:
  - [ ] User cancellation
  - [ ] Biometric failure
  - [ ] Device not supported
  - [ ] Network failures
  - [ ] Invalid Passkey
- [ ] Test cross-device scenarios:
  - [ ] Register on mobile, use on web (if synced)
  - [ ] Register on web, use on mobile (if synced)
- [ ] Performance testing
- [ ] Security testing:
  - [ ] Passkey cannot be copied
  - [ ] Biometric prompt cannot be bypassed
- [ ] User acceptance testing

#### Acceptance Criteria (AC)
- ✅ All Passkey flows work correctly
- ✅ Works on all supported platforms
- ✅ Error scenarios handled gracefully
- ✅ Performance acceptable
- ✅ Security requirements met
- ✅ UAT feedback incorporated
- ✅ Test documentation updated

#### Technical Notes
- Test with real biometrics (fingerprint, face)
- Test with USB security keys
- Test with platform and cross-platform authenticators

---

## Integration Points

### Mobile App → Keycloak
- WebAuthn registration endpoint
- WebAuthn authentication endpoint
- Passkey management APIs

### Admin Portal → Keycloak
- WebAuthn registration endpoint
- WebAuthn authentication endpoint
- Passkey management APIs

### Device → Mobile App / Browser
- Native WebAuthn API calls
- Biometric authentication prompts

## Dependencies

### External
- Keycloak 22+ (WebAuthn support)
- HTTPS domain (required for WebAuthn)
- Device biometric support (fingerprint, face)

### Internal
- Phase 2 completed (mobile app Keycloak integration)
- Phase 1 completed (admin portal Keycloak integration)

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Device compatibility | Medium | Graceful degradation, clear error messages |
| Browser compatibility | Medium | Feature detection, fallback to password |
| User adoption | Medium | Clear UX, education, optional feature |
| Biometric failures | Low | Fallback to password, clear error messages |

## Definition of Done

Phase 4 is considered complete when:

- [ ] All tasks (4.1 - 4.6) marked as `TODO[x]` (completed)
- [ ] Passkey registration works on mobile and web
- [ ] Passkey authentication works on mobile and web
- [ ] Passkey management functional
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged
- [ ] Documentation updated
- [ ] QA sign-off received
- [ ] UAT completed
- [ ] Team demo completed

## Next Steps

After Phase 4 completion:
- Continue with Phase 5: User Migration & Deprecation
- Monitor Passkey adoption metrics
- Consider additional authentication methods (SMS, Email OTP)

