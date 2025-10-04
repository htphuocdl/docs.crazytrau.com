---
id: data-strategy
title: Chiến lược dữ liệu
sidebar_label: Data Strategy
---

## Mô hình dữ liệu

- Entities chính: User, Space, Service, Task, Item.

## Luồng dữ liệu

- App → API Gateway → Services → Storage; Analytics tách pipeline.

## Nhất quán dữ liệu

- Định hướng Saga/Outbox cho giao dịch phân tán.

## Lưu trữ

- Hot: Redis/Database OLTP; Cold: S3/Data Lake.

## Phân tích & BI

- Warehouse (BigQuery/Redshift/Snowflake), tracking plan (Segment/Mixpanel/GA).

