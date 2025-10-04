---
id: qa
title: Đảm bảo chất lượng
sidebar_label: QA & Testing
---

## Chiến lược kiểm thử

- Unit: Jest/Testing Library cho RN.
- Integration: test navigation/contexts.
- E2E: Detox/Appium (định hướng).
- Contract testing: OpenAPI/GraphQL schema (định hướng).

## Dữ liệu test

- Fixtures/seeds; môi trường DEV/Staging tách biệt.

## Phát hành

- Feature flags, canary/blue-green (định hướng OTA + store).

## Hiệu năng

- k6/JMeter cho backend; RN profiler cho frontend.

