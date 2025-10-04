---
id: mobile
title: Mobile App Architecture
sidebar_label: Mobile App
---

## Structure

- `packages/host`: shell app, navigation, theming, mini-app integration.
- `packages/checklist`, `packages/keezy`: independent mini-apps.
- `packages/auth`: providers, contexts, services (Auth, Space, Service), `authCtx`.
- `packages/sdk`: shared components/theme/types/utils.

## Navigation

- Stack/Tabs by module; `TabsNavigator` receives `authData` and provides `ServiceContext`.

## State & Context

- `useServices` in host; `authCtx` provides factories (Space/Service/Auth...).

## Build/Run

- Scripts in `app/trackhub/package.json` and `mprocs/` for dev environment.

