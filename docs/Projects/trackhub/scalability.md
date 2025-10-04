---
id: scalability
title: Khả năng mở rộng & Tin cậy
sidebar_label: Scalability & Reliability
---

## Cân bằng tải & Auto-scaling

- K8s/ECS (định hướng), HPA theo CPU/QPS.

## Cache

- CDN cho assets, Redis cho session/config, cache tầng API.

## MQ & Resilience

- Message queue cho tác vụ nền; retry, backoff, circuit breaker.

## Sẵn sàng & DR

- Multi-AZ/region (định hướng), backup/restore định kỳ, RTO/RPO rõ ràng.

