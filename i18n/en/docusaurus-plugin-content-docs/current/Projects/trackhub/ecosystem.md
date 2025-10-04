---
id: ecosystem
title: trackhub.life Ecosystem
sidebar_label: Ecosystem
---

## Main Components

```mermaid
flowchart LR
  subgraph Mobile
    Host
    Checklist
    Keezy
  end
  subgraph Backend[NestJS Monorepo]
    GW(GraphQL Gateway)
    SAuth[svc-user]
    SCore[svc-core]
    GWCust[gw-customer]
    LibCore[lib-core]
    LibUser[lib-user]
  end
  subgraph Admin Web
    CoreAdmin[core_admin]
    FEAdmin[crt.fe.admin]
  end
  subgraph DevOps
    Nginx
    HAProxy
    Redis
    RabbitMQ
    ECS/ECR
  end
  Mobile <--> GW
  Admin Web <--> GW
  GW <--> SAuth
  GW <--> SCore
  GW <--> GWCust
  SAuth <--> LibUser
  SCore <--> LibCore
```

## Backend

- NestJS monorepo at `backend/` with apps (gateway, services) and shared libs.
- GraphQL schema at `backend/schema.gql`, API gateway oriented.

## Admin Web

- `frontend/core_admin` and `frontend/crt.fe.admin`: admin portal, codegen, deploy scripts.

## DevOps

- `devops/`: Docker, Nginx/HAProxy, Redis, RabbitMQ, ECS/Terraform.

## Request Flow (overview sequence)

```mermaid
sequenceDiagram
  participant App as Mobile/Web
  participant GW as GraphQL Gateway
  participant Svc as Microservice
  participant DB as Storage
  App->>GW: Query/Mutation
  GW->>Svc: Route/Resolve
  Svc->>DB: CRUD/Events
  DB-->>Svc: Data
  Svc-->>GW: Payload
  GW-->>App: Response
```
