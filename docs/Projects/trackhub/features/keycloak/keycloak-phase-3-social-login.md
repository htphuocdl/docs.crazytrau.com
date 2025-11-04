---
id: keycloak-phase-3-social-login
title: "Phase 3: Social Login Integration"
sidebar_label: "Phase 3 - Social Login"
---

# Phase 3: Social Login Integration

**Phase ID**: `PHASE-KEYCLOAK-003`  
**Status**: `TODO[]`  
**Start Date**: TBD (After Phase 2)  
**Target Completion**: TBD  
**Dependencies**: Phase 2 completed

## Overview

Enable social login (Google, Facebook) through Keycloak Identity Brokering, allowing users to authenticate using their social accounts instead of creating new credentials.

## Objectives

- [ ] Configure Google OAuth in Keycloak
- [ ] Configure Facebook OAuth in Keycloak
- [ ] Implement social login UI in mobile app
- [ ] Implement social login UI in admin portal
- [ ] Handle account linking (social account → existing user)
- [ ] Test social login flows

## Tasks Breakdown

### Task 3.1: Google OAuth Configuration
**Task ID**: `TASK-KEYCLOAK-003-001`  
**Status**: `TODO[]`  
**Assignee**: Backend  
**Estimated Effort**: 2 days

#### Checklist
- [ ] Create Google Cloud Console project (if not exists)
- [ ] Create OAuth 2.0 credentials:
  - [ ] Client ID
  - [ ] Client Secret
  - [ ] Authorized redirect URIs (Keycloak callback URL)
- [ ] Configure Google OAuth consent screen
- [ ] Add Google Identity Provider in Keycloak:
  - [ ] Provider: Google
  - [ ] Client ID: from Google Console
  - [ ] Client Secret: from Google Console
  - [ ] Default scopes: `openid profile email`
- [ ] Configure account linking behavior
- [ ] Configure user attribute mapping:
  - [ ] Email → `email`
  - [ ] Name → `firstName`, `lastName`
  - [ ] Picture → `avatar`
- [ ] Test Google login flow from Keycloak Admin UI

#### Acceptance Criteria (AC)
- ✅ Google Identity Provider configured in Keycloak
- ✅ Google OAuth credentials validated
- ✅ User can login via Google from Keycloak login page
- ✅ User attributes mapped correctly (email, name, avatar)
- [ ] Account linking works (existing user can link Google)
- ✅ Redirect URI configured correctly
- ✅ Configuration documented

#### Technical Notes
- Redirect URI format: `https://keycloak.domain/auth/realms/trackhub/broker/google/endpoint`
- Use Google OAuth 2.0 (not OpenID Connect)
- Store Google credentials securely (environment variables)

---

### Task 3.2: Facebook OAuth Configuration
**Task ID**: `TASK-KEYCLOAK-003-002`  
**Status**: `TODO[]`  
**Assignee**: Backend  
**Estimated Effort**: 2 days

#### Checklist
- [ ] Create Facebook App (if not exists)
- [ ] Configure Facebook App settings:
  - [ ] App ID
  - [ ] App Secret
  - [ ] Valid OAuth Redirect URIs
- [ ] Add Facebook Identity Provider in Keycloak:
  - [ ] Provider: Facebook
  - [ ] App ID: from Facebook
  - [ ] App Secret: from Facebook
  - [ ] Default scopes: `email public_profile`
- [ ] Configure user attribute mapping:
  - [ ] Email → `email`
  - [ ] Name → `firstName`, `lastName`
  - [ ] Picture → `avatar`
- [ ] Configure account linking behavior
- [ ] Test Facebook login flow from Keycloak Admin UI

#### Acceptance Criteria (AC)
- ✅ Facebook Identity Provider configured in Keycloak
- ✅ Facebook App credentials validated
- ✅ User can login via Facebook from Keycloak login page
- ✅ User attributes mapped correctly (email, name, avatar)
- ✅ Account linking works
- ✅ Redirect URI configured correctly
- ✅ Configuration documented

#### Technical Notes
- Redirect URI format: `https://keycloak.domain/auth/realms/trackhub/broker/facebook/endpoint`
- Facebook requires App Review for production (may use Test Mode for development)
- Store Facebook credentials securely

---

### Task 3.3: Mobile App Social Login UI
**Task ID**: `TASK-KEYCLOAK-003-003`  
**Status**: `TODO[]`  
**Assignee**: Mobile Developer  
**Estimated Effort**: 1 week

#### Checklist
- [ ] Update `SignInScreen.tsx`:
  - [ ] Replace TODO comment with actual Google login
  - [ ] Add Facebook login button
  - [ ] Style social login buttons
- [ ] Implement Google login handler:
  - [ ] Call Keycloak with `identity_provider=google` parameter
  - [ ] Handle OAuth redirect
  - [ ] Process tokens from callback
- [ ] Implement Facebook login handler:
  - [ ] Call Keycloak with `identity_provider=facebook` parameter
  - [ ] Handle OAuth redirect
  - [ ] Process tokens from callback
- [ ] Update `KeycloakAuthService`:
  - [ ] Add `loginWithGoogle()` method
  - [ ] Add `loginWithFacebook()` method
- [ ] Handle account linking flow:
  - [ ] If social email matches existing user, prompt for account linking
  - [ ] If new user, create account automatically
- [ ] Add loading states for social login
- [ ] Handle errors (user cancellation, network failures)
- [ ] Update translations (i18n) for social login
- [ ] Test Google login flow
- [ ] Test Facebook login flow

#### Acceptance Criteria (AC)
- ✅ Google login button functional in mobile app
- ✅ Facebook login button functional in mobile app
- ✅ Users can login via Google/Facebook
- ✅ OAuth redirect works correctly
- ✅ Account linking works (existing users can link social accounts)
- ✅ New users created automatically from social login
- ✅ Error handling for cancellation, failures
- ✅ Loading states shown during authentication
- ✅ UI follows design system
- ✅ Works on iOS and Android
- ✅ Translations available for all languages

#### Technical Notes
- Use Keycloak's identity provider parameter: `kc_idp_hint=google`
- Deep linking needed for OAuth callback
- Store provider info in token for future use

---

### Task 3.4: Admin Portal Social Login UI
**Task ID**: `TASK-KEYCLOAK-003-004`  
**Status**: `TODO[]`  
**Assignee**: Frontend Developer  
**Estimated Effort**: 3 days

#### Checklist
- [ ] Update admin portal login page
- [ ] Add Google login button
- [ ] Add Facebook login button
- [ ] Style social login buttons
- [ ] Implement Google login handler:
  - [ ] Redirect to Keycloak with `identity_provider=google`
  - [ ] Handle OAuth callback
- [ ] Implement Facebook login handler:
  - [ ] Redirect to Keycloak with `identity_provider=facebook`
  - [ ] Handle OAuth callback
- [ ] Handle account linking flow
- [ ] Add loading states
- [ ] Handle errors
- [ ] Test Google login
- [ ] Test Facebook login

#### Acceptance Criteria (AC)
- ✅ Google and Facebook login buttons visible on login page
- ✅ Social login works correctly
- ✅ Account linking works
- ✅ Error handling implemented
- ✅ UI follows design system
- ✅ Works in all browsers (Chrome, Firefox, Safari, Edge)

#### Technical Notes
- Use Keycloak's identity provider parameter
- Handle OAuth callback in same-origin or redirect

---

### Task 3.5: Account Linking Implementation
**Task ID**: `TASK-KEYCLOAK-003-005`  
**Status**: `TODO[]`  
**Assignee**: Backend/Frontend/Mobile  
**Estimated Effort**: 1 week

#### Checklist
- [ ] Configure Keycloak account linking behavior:
  - [ ] Link accounts by email (if email matches)
  - [ ] Allow manual account linking
- [ ] Implement account linking UI in mobile app:
  - [ ] Detect if social email matches existing account
  - [ ] Prompt user to link accounts or create new
  - [ ] Show linked accounts in profile
- [ ] Implement account linking UI in admin portal:
  - [ ] Account settings page
  - [ ] Link/unlink social accounts
- [ ] Test account linking scenarios:
  - [ ] Link Google account to existing user
  - [ ] Link Facebook account to existing user
  - [ ] Unlink social account
  - [ ] Multiple social accounts linked to same user

#### Acceptance Criteria (AC)
- ✅ Users can link social accounts to existing accounts
- ✅ Account linking by email works automatically
- ✅ Manual account linking works
- ✅ Users can unlink social accounts
- ✅ Multiple social accounts can be linked
- ✅ UI/UX clear and intuitive
- ✅ Edge cases handled (email conflicts, etc.)

#### Technical Notes
- Keycloak can automatically link by email
- Manual linking via Keycloak Account Console
- Store provider info for future logins

---

### Task 3.6: Testing & QA
**Task ID**: `TASK-KEYCLOAK-003-006`  
**Status**: `TODO[]`  
**Assignee**: QA  
**Estimated Effort**: 1 week

#### Checklist
- [ ] Test Google login on mobile app
- [ ] Test Facebook login on mobile app
- [ ] Test Google login on admin portal
- [ ] Test Facebook login on admin portal
- [ ] Test account linking scenarios
- [ ] Test error scenarios:
  - [ ] User cancels social login
  - [ ] Network failures
  - [ ] Invalid credentials
  - [ ] Email conflicts
- [ ] Test on multiple devices
- [ ] Test on multiple browsers (admin portal)
- [ ] Performance testing
- [ ] Security testing
- [ ] User acceptance testing

#### Acceptance Criteria (AC)
- ✅ All social login flows work correctly
- ✅ Account linking works as expected
- ✅ Error scenarios handled gracefully
- ✅ Performance acceptable
- ✅ Security vulnerabilities addressed
- ✅ UAT feedback incorporated
- ✅ Test documentation updated

#### Technical Notes
- Test with real Google/Facebook accounts
- Test with Test Mode accounts (if applicable)
- Test account linking edge cases

---

## Integration Points

### Mobile App → Keycloak → Google/Facebook
- OAuth2 flow through Keycloak Identity Broker
- Token exchange and user mapping

### Admin Portal → Keycloak → Google/Facebook
- OAuth2 flow through Keycloak Identity Broker
- Browser-based redirect flow

### Keycloak → Google/Facebook
- Identity Provider configuration
- Token exchange
- User attribute mapping

## Dependencies

### External
- Google Cloud Console access
- Facebook Developer account access
- OAuth credentials (Client ID, Secret)

### Internal
- Phase 2 completed (mobile app Keycloak integration)
- Phase 1 completed (admin portal Keycloak integration)

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Google/Facebook API changes | Medium | Use Keycloak abstraction, monitor updates |
| Account linking conflicts | Medium | Clear UX, manual linking option |
| OAuth credential security | High | Secure storage, rotation policy |
| User experience complexity | Medium | Clear UI, documentation |

## Definition of Done

Phase 3 is considered complete when:

- [ ] All tasks (3.1 - 3.6) marked as `TODO[x]` (completed)
- [ ] Google login works on mobile and admin portal
- [ ] Facebook login works on mobile and admin portal
- [ ] Account linking functional
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged
- [ ] Documentation updated
- [ ] QA sign-off received
- [ ] UAT completed
- [ ] Team demo completed

## Next Steps

After Phase 3 completion:
- Continue with Phase 4: Passkey/WebAuthn Support
- Continue with Phase 5: User Migration & Deprecation
- Monitor social login adoption metrics

