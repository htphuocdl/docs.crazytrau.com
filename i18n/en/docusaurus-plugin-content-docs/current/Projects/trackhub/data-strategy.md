---
id: data-strategy
title: Data Strategy
sidebar_label: Data Strategy
---

## Data Model

- Main entities: User, Space, Service, Task, Item.

## Data Flow

- App → API Gateway → Services → Storage; Analytics separate pipeline.

## Data Consistency

- Planned Saga/Outbox for distributed transactions.

## Storage

- Hot: Redis/Database OLTP; Cold: S3/Data Lake.

## Analytics & BI

- Warehouse (BigQuery/Redshift/Snowflake), tracking plan (Segment/Mixpanel/GA).
