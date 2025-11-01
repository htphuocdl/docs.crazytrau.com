---
id: keycloak-phase-1-admin-portal
title: "Phase 1: Keycloak Setup & Admin Portal Integration"
sidebar_label: "Phase 1 - Admin Portal"
---

# Phase 1: Keycloak Setup & Admin Portal Integration

**Phase ID**: `PHASE-KEYCLOAK-001`  
**Status**: `TODO[]`  
**Start Date**: TBD  
**Target Completion**: TBD  
**Dependencies**: None

## Overview

Setup Keycloak server infrastructure and integrate authentication with the admin portal (`crt.fe.admin`) as the first step of Keycloak migration.

## Objectives

- [ ] Deploy and configure Keycloak server
- [ ] Create Keycloak realm and clients for admin portal
- [ ] Integrate Keycloak authentication in React admin portal
- [ ] Implement JWT token validation in backend
- [ ] Test end-to-end authentication flow

## Tasks Breakdown

### Task 1.1: Keycloak Infrastructure Setup
**Task ID**: `TASK-KEYCLOAK-001-001`  
**Status**: `TODO[x]` (Docker setup completed)  
**Assignee**: DevOps/Backend  
**Estimated Effort**: 1 week

#### Checklist
- [x] Provision Keycloak server (Docker/K8s/EC2)
  - ✅ Docker Compose configuration created at `devops/keycloak/docker-compose.dev.yml`
  - ✅ Using Keycloak 24.0.0 image
  - ✅ Integrated with main project start script
- [x] Configure Keycloak database (PostgreSQL recommended)
  - ✅ Database: CockroachDB (PostgreSQL-compatible)
  - ✅ Database name: `keycloak`
  - ✅ Connection string configured in `devops/keycloak/.env`
  - ✅ Connection: `postgresql://crazytrau_auth:xxx@crazytrau-auth-6051.6xw.aws-ap-southeast-1.cockroachlabs.cloud:26257/keycloak?sslmode=verify-full`
- [ ] Setup SSL/TLS certificates (Development: HTTP enabled, Production: HTTPS required)
- [x] Configure Keycloak admin credentials (secure storage)
  - ✅ Admin credentials configured in `devops/keycloak/.env`
  - ✅ Default: `KEYCLOAK_ADMIN=admin`, `KEYCLOAK_ADMIN_PASSWORD=admin`
- [ ] Setup backup strategy for Keycloak data (TODO: Production backup strategy)
- [x] Configure health checks and monitoring
  - ✅ Health check endpoint: `http://localhost:8080/health/ready`
  - ✅ Metrics enabled: `KC_METRICS_ENABLED=true`
  - ✅ Health check in Docker Compose with 30s interval
- [x] Document Keycloak infrastructure architecture
  - ✅ Documentation at `devops/keycloak/README.md`

#### Acceptance Criteria (AC)
- ✅ Keycloak server accessible via HTTP (dev: port 8080, prod: HTTPS required)
- ✅ Keycloak admin console accessible at `http://localhost:8080`
- ✅ Database connection pool configured correctly via environment variables
- ✅ Health check endpoint returns 200 OK (`/health/ready`)
- ✅ Infrastructure documented in `devops/keycloak/README.md`
- [ ] CI/CD pipeline can deploy Keycloak updates (TODO: Production deployment)

#### Technical Notes
- **Docker Setup Location**: `devops/keycloak/`
- **Docker Compose File**: `devops/keycloak/docker-compose.dev.yml`
- **Environment File**: `devops/keycloak/.env`
- **Keycloak Version**: 24.0.0 (supports Organizations, WebAuthn/Passkey)
- **Database**: CockroachDB (PostgreSQL-compatible) 
- **Database Connection**: Configured via `DATABASE_KEYCLOAK_URL` or individual env vars
- **Ports**: HTTP 8080, HTTPS 8443
- **Network**: Connected to `crt-dev-net` Docker network
- **Health Check**: Configured with 60s start period, 30s interval
- **Start Script Integration**: Automatically started by `pnpm start` command
- **Access**: Admin Console at `http://localhost:8080` (credentials in `.env`)

---

### Task 1.2: Keycloak Realm & Client Configuration
**Task ID**: `TASK-KEYCLOAK-001-002`  
**Status**: `TODO[]`  
**Assignee**: Backend  
**Estimated Effort**: 3 days

#### Checklist
- [ ] Create master realm (if needed)
- [ ] Create `trackhub` realm for application
- [ ] Configure realm settings (security, tokens, sessions)
- [ ] Create `admin-portal` client in Keycloak
- [ ] Configure client settings:
  - [ ] Client ID: `admin-portal`
  - [ ] Access Type: `public` (for React app)
  - [ ] Valid Redirect URIs: configured for admin portal URLs
  - [ ] Web Origins: configured for CORS
  - [ ] Enabled OAuth2/OIDC flows: Authorization Code, Refresh Token
- [ ] Configure client scopes for custom claims (`tenantId`, `projectId`)
- [ ] Create client mappers for custom claims
- [ ] Test client configuration

#### Acceptance Criteria (AC)
- ✅ Realm `trackhub` created and configured
- ✅ Client `admin-portal` exists with correct settings
- ✅ Authorization Code flow working
- ✅ Refresh token flow working
- ✅ Custom claims (`tenantId`, `projectId`) included in ID token
- ✅ CORS configured correctly for admin portal domain
- ✅ Redirect URIs include all required URLs (dev, staging, prod)
- ✅ Configuration documented in `docs/keycloak-realm-config.md`

#### Technical Notes
- Use Authorization Code flow with PKCE for public clients
- Token lifetime: 5 minutes (access), 30 minutes (refresh)
- Session timeout: 30 minutes idle, 8 hours max

---

### Task 1.3: React Admin Portal Integration
**Task ID**: `TASK-KEYCLOAK-001-003`  
**Status**: `TODO[]`  
**Assignee**: Frontend  
**Estimated Effort**: 1 week

#### Checklist
- [ ] Install Keycloak React dependencies:
  ```json
  {
    "@react-keycloak/web": "^3.0.0",
    "keycloak-js": "^24.0.0"
  }
  ```
- [ ] Create Keycloak configuration file
- [ ] Create `KeycloakProvider` wrapper component
- [ ] Update `App.tsx` to wrap with `KeycloakProvider`
- [ ] Create `useKeycloakAuth` hook
- [ ] Update authentication context to use Keycloak
- [ ] Implement login redirect flow
- [ ] Implement logout flow
- [ ] Handle token refresh automatically
- [ ] Update Apollo Client to use Keycloak token
- [ ] Add loading states during authentication
- [ ] Handle authentication errors gracefully
- [ ] Update routing to protect authenticated routes

#### Acceptance Criteria (AC)
- ✅ User can login via Keycloak from admin portal
- ✅ User is redirected to Keycloak login page when unauthenticated
- ✅ After login, user returns to admin portal with valid session
- ✅ Token automatically refreshed before expiration
- ✅ Logout clears session and redirects to login
- ✅ GraphQL requests include Keycloak token in Authorization header
- ✅ All protected routes require authentication
- ✅ Error handling for network failures, expired tokens
- ✅ Loading states shown during authentication flows
- ✅ Code follows project linting and formatting standards

#### Technical Notes
- Use `keycloak-js` for OIDC client
- Token stored in memory (not localStorage for security)
- Automatic token refresh with 30s buffer before expiration
- Redirect to `/login` on authentication errors

---

### Task 1.4: Backend JWT Validation
**Task ID**: `TASK-KEYCLOAK-001-004`  
**Status**: `TODO[]`  
**Assignee**: Backend  
**Estimated Effort**: 1 week

#### Checklist
- [ ] Install NestJS authentication packages:
  ```json
  {
    "@nestjs/passport": "^10.0.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "jwks-rsa": "^3.1.0"
  }
  ```
- [ ] Create `libs/crt.lib.auth/src/keycloak/` directory structure
- [ ] Create `KeycloakStrategy` (Passport JWT strategy)
- [ ] Configure JWKS endpoint URL
- [ ] Implement JWKS public key caching (24h TTL)
- [ ] Create `JwtAuthGuard` for protecting routes
- [ ] Create `KeycloakGuard` decorator
- [ ] Extract custom claims from token (`tenantId`, `projectId`, `userId`, `roleId`)
- [ ] Create `KeycloakUser` DTO with claims mapping
- [ ] Update GraphQL context to include Keycloak user
- [ ] Add Keycloak authentication to GraphQL gateway
- [ ] Test JWT validation with valid tokens
- [ ] Test JWT validation with invalid/expired tokens
- [ ] Add error handling for authentication failures

#### Acceptance Criteria (AC)
- ✅ JWT tokens from Keycloak validated successfully
- ✅ JWKS public keys cached and refreshed automatically
- ✅ Custom claims extracted and available in GraphQL context
- ✅ Protected routes require valid JWT token
- ✅ Invalid tokens return 401 Unauthorized
- ✅ Expired tokens return 401 with clear error message
- ✅ GraphQL resolvers can access user context (tenantId, projectId, userId)
- ✅ Token validation latency < 50ms (p95) with caching
- ✅ Unit tests for JWT validation (>80% coverage)
- ✅ Integration tests for authentication flow

#### Technical Notes
- Use `jwks-rsa` to fetch and cache JWKS public keys
- Cache keys for 24 hours, refresh on validation failure
- Token validation should check: signature, expiration, issuer, audience
- Custom claims mapper: `tenantId` → `customTenantId`, `projectId` → `customProjectId`

---

### Task 1.5: End-to-End Testing
**Task ID**: `TASK-KEYCLOAK-001-005`  
**Status**: `TODO[]`  
**Assignee**: QA/Frontend/Backend  
**Estimated Effort**: 3 days

#### Checklist
- [ ] Create test Keycloak users (admin, regular user)
- [ ] Test complete login flow from admin portal
- [ ] Test token refresh flow
- [ ] Test logout flow
- [ ] Test protected GraphQL queries with Keycloak token
- [ ] Test protected GraphQL mutations with Keycloak token
- [ ] Test error scenarios:
  - [ ] Invalid credentials
  - [ ] Expired token
  - [ ] Invalid token signature
  - [ ] Network failures
- [ ] Test multi-tenant scenarios (different tenantId in token)
- [ ] Test session timeout
- [ ] Performance testing (concurrent logins, token validation)
- [ ] Security testing (token manipulation, XSS)
- [ ] Document test results

#### Acceptance Criteria (AC)
- ✅ All happy path scenarios pass
- ✅ All error scenarios handled correctly
- ✅ Performance meets requirements (token validation < 50ms p95)
- ✅ Security vulnerabilities addressed
- ✅ Test coverage > 80% for authentication code
- ✅ Test documentation updated with results
- ✅ No regression in existing functionality

#### Technical Notes
- Use Jest for unit tests
- Use Supertest for integration tests
- Use Cypress/Playwright for E2E tests
- Test with real Keycloak instance (not mocks) for integration tests

---

## Docker Setup Details

### Location
All Keycloak Docker configuration files are located in:
```
devops/keycloak/
├── docker-compose.dev.yml  # Docker Compose configuration
├── .env                    # Environment variables (database credentials)
├── .env.example            # Example environment file
└── README.md               # Setup documentation
```

### Start Keycloak

**Option 1: Via main start script** (Recommended)
```bash
# From project root
pnpm start
# Keycloak will start automatically if .env file exists
```

**Option 2: Manual start**
```bash
cd devops/keycloak
docker compose -f docker-compose.dev.yml up -d
```

### Access Keycloak

- **Admin Console**: http://localhost:8080
- **Admin Credentials**: Check `devops/keycloak/.env`
  - Default: `admin` / `admin`
- **Health Check**: http://localhost:8080/health/ready
- **Metrics**: Enabled (check logs for endpoint)

### Environment Configuration

The `.env` file contains:
- `KEYCLOAK_ADMIN`: Admin username (default: `admin`)
- `KEYCLOAK_ADMIN_PASSWORD`: Admin password
- `DATABASE_KEYCLOAK_URL`: Full database connection string
- `DATABASE_KEYCLOAK_HOST`: Database host
- `DATABASE_KEYCLOAK_PORT`: Database port (default: 26257)
- `DATABASE_KEYCLOAK_NAME`: Database name (default: `keycloak`)
- `DATABASE_KEYCLOAK_USER`: Database user
- `DATABASE_KEYCLOAK_PASSWORD`: Database password
- `KEYCLOAK_HTTP_PORT`: HTTP port (default: 8080)
- `KEYCLOAK_HTTPS_PORT`: HTTPS port (default: 8443)

### Database Connection

Keycloak connects to CockroachDB using:
```
postgresql://crazytrau_auth:xxx@crazytrau-auth-6051.6xw.aws-ap-southeast-1.cockroachlabs.cloud:26257/keycloak?sslmode=verify-full
```

**Note**: Update the password (`xxx`) in `devops/keycloak/.env` with actual database password.

### Verify Installation

1. Check container is running:
   ```bash
   docker ps | grep keycloak
   ```

2. Check health:
   ```bash
   curl http://localhost:8080/health/ready
   ```
   Should return: `{"status":"UP"}`

3. Check logs:
   ```bash
   docker logs -f keycloak
   ```

4. Access admin console:
   - Open: http://localhost:8080
   - Login with credentials from `.env`

## Integration Points

### Admin Portal → Keycloak
- Authorization Code flow with PKCE
- Token refresh mechanism
- Logout endpoint
- Base URL: `http://localhost:8080` (development)

### Backend → Keycloak
- JWKS endpoint: `http://localhost:8080/realms/trackhub/protocol/openid-connect/certs`
- Token introspection (optional, for advanced scenarios)
- Realm: `trackhub` (to be created in Task 1.2)

### Admin Portal → Backend
- GraphQL requests with `Authorization: Bearer <token>` header
- Token passed via Apollo Client headers

## Dependencies

### External
- Keycloak server deployed (Task 1.1)
- SSL certificates issued
- DNS configured for Keycloak domain

### Internal
- Admin portal build system working
- Backend GraphQL gateway running
- Database accessible

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Keycloak server downtime | High | High availability setup, health checks |
| Token validation latency | Medium | JWKS caching, performance testing |
| CORS configuration errors | Medium | Thorough testing, staging environment |
| Token expiration issues | Medium | Automatic refresh, clear error messages |

## Definition of Done

Phase 1 is considered complete when:

- [ ] All tasks (1.1 - 1.5) marked as `TODO[x]` (completed)
- [ ] Admin portal users can login via Keycloak
- [ ] GraphQL queries work with Keycloak tokens
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged
- [ ] Documentation updated
- [ ] Staging environment deployed and tested
- [ ] Team demo completed

## Next Steps

After Phase 1 completion:
- Begin Phase 2: Mobile App Authentication Migration
- Gather feedback from admin portal users
- Refine configuration based on Phase 1 learnings

