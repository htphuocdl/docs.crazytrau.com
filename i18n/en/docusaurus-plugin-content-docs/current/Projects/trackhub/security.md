---
id: security
title: Security & Compliance
sidebar_label: Security & Compliance
---

## Authentication & Authorization

- Planned: OAuth2/OIDC + JWT; multi-tenant via `SpaceService`.
- RBAC/ABAC for role and attribute-based permissions.

## Data Protection

- Encryption in-transit (HTTPS) and at-rest (Keychain/Keystore for tokens).
- Hide sensitive info in logs; secret management via CI/CD.

## Compliance

- GDPR: consent, data deletion on request.
- PCI DSS (if payment): domain separation, tokenization, no PAN storage.

## Application Security Practices

- Measures: secure storage, certificate pinning (planned), jailbreak/root detection (as needed).
