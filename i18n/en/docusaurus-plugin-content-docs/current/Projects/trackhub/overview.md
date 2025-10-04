---
id: overview
title: Overview & Vision
sidebar_label: Overview
---

## Objectives

- Build multi-service super app (B2C/B2B/B2B2C), expandable by modules.
- Unified experience, high performance, optimized development costs.

## Current Scope

- Mobile super app (Host + mini-apps) — detailed documentation in `mobile/` folder.
- trackhub.life ecosystem: backend (NestJS microservices), admin web, devops stack.

## Roadmap

- Short-term: complete module architecture, standardize shared SDK, improve CI/CD.
- Long-term: add marketplace, payment, messaging, loyalty; split backend microservices.

## Ecosystem Diagram (overview)

```mermaid
flowchart LR
  subgraph Mobile
    Host
    Checklist
    Keezy
  end
  subgraph Backend
    GW(GraphQL Gateway)
    SAuth[svc-user/auth]
    SCore[svc-core]
    SCustomer[gw-customer]
  end
  subgraph Admin
    CoreAdmin
    FEAdmin
  end
  Mobile <--> GW
  Admin <--> GW
  GW <--> SAuth
  GW <--> SCore
  GW <--> SCustomer
```

## Non-functional

- Performance, reliability, compliance, scalability; multi-environment (DEV/QA/PROD).
