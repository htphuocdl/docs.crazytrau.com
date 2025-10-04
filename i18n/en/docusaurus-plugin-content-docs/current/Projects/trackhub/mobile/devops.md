---
id: devops
title: Mobile DevOps
sidebar_label: DevOps
---

## Quick Start

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant CLI as mprocs/scripts
  Dev->>CLI: pnpm start / run:host:ios
  CLI-->>Dev: Metro + iOS/Android build
```

## CI/CD (planned)

- Lint/Typecheck/Test → Build iOS/Android → OTA/Store.
