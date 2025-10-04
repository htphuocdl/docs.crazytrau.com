---
id: mobile
title: Kiến trúc ứng dụng di động
sidebar_label: Mobile App
---

## Cấu trúc

- `packages/host`: shell app, navigation, theming, tích hợp mini-app.
- `packages/checklist`, `packages/keezy`: mini-app độc lập.
- `packages/auth`: providers, contexts, services (Auth, Space, Service), `authCtx`.
- `packages/sdk`: components/theme/types/utils dùng chung.

## Navigation

- Stack/Tabs theo module; `TabsNavigator` nhận `authData` và đưa vào `ServiceContext`.

## State & Context

- `useServices` trong host; `authCtx` cung cấp factories (Space/Service/Auth...).

## Build/Run

- Scripts trong `app/trackhub/package.json` và `mprocs/` cho môi trường dev.


