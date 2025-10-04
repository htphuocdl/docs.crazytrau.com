---
id: devops
title: DevOps mobile
sidebar_label: DevOps
---

## Chạy nhanh

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant CLI as mprocs/scripts
  Dev->>CLI: pnpm start / run:host:ios
  CLI-->>Dev: Metro + iOS/Android build
```

## CI/CD (định hướng)

- Lint/Typecheck/Test → Build iOS/Android → OTA/Store.

