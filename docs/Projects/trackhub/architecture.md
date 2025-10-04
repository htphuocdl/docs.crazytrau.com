---
id: architecture
title: Kiến trúc hệ thống
sidebar_label: Kiến trúc
---

## Tổng quan

- Monorepo `app/trackhub` (pnpm workspaces) với packages: `host`, `checklist`, `keezy`, `auth`, `sdk`.
- Mobile app React Native (iOS/Android) dùng Re.Pack/module federation cho mini-app.
- Backend chưa nằm trong repo; định hướng microservices/GraphQL gateway.

## Thành phần

- Host App: shell chứa navigation, theming, SDK chung.
- Mini-apps: `checklist`, `keezy` chạy độc lập, tích hợp qua module federation.
- Auth: provider, services (Auth, Space, Service) và `authCtx` chia sẻ.
- SDK: components, theme, types, utils dùng chung.

## Giao tiếp

- Nội bộ mobile: Context/SDK; API dự kiến REST/GraphQL; event bus mở rộng sau.

## Triển khai

- EAS, CocoaPods/Gradle, mprocs scripts cho dev; hướng tới CI/CD tự động.


