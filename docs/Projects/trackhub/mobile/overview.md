---
id: overview
title: Tổng quan mobile
sidebar_label: Tổng quan
---

## Tầm nhìn

- Super app đa dịch vụ trên di động, modular hóa bằng mini-apps.

## Phạm vi

- Host + mini-apps (`checklist`, `keezy`), `auth`, `sdk` dùng chung.

## Kiến trúc cao

```mermaid
flowchart LR
  Host[Host App] --> SDK[(Shared SDK)]
  Host --> Auth[Auth Ctx & Providers]
  Host --> MF[Module Federation]
  MF --> Checklist[Mini-app: Checklist]
  MF --> Keezy[Mini-app: Keezy]
  Auth --> Services[(Service/Space Factories)]
```

