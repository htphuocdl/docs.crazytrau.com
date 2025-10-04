---
id: architecture
title: System Architecture
sidebar_label: Architecture
---

## Overview

- Monorepo `app/trackhub` (pnpm workspaces) with packages: `host`, `checklist`, `keezy`, `auth`, `sdk`.
- React Native mobile app (iOS/Android) using Re.Pack/module federation for mini-app.
- Backend not yet in repo; planned microservices/GraphQL gateway.

## Components

- Host App: shell containing navigation, theming, shared SDK.
- Mini-apps: `checklist`, `keezy` running independently, integrated via module federation.
- Auth: provider, services (Auth, Space, Service) and shared `authCtx`.
- SDK: shared components, theme, types, utils.

## Communication

- Internal mobile: Context/SDK; planned REST/GraphQL API; extensible event bus later.

## Deployment

- EAS, CocoaPods/Gradle, mprocs scripts for dev; heading towards automated CI/CD.
