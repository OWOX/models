---
type: "OWOX Data Mart"
title: "Search Requests"
description: "One row per search/browse request — the demand and match-quality signal."
tags: ["owox"]
timestamp: 2026-07-24T10:45:11.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `request_id` | STRING | PK. Unique search request identifier. |
| `buyer_id` | STRING | Buyer who made the search. FK to [Buyer](./buyer.md) |
| `category_id` | STRING | Category the search was scoped to. FK to [Category](./category.md) |
| `requested_at` | TIMESTAMP | When the search was made. |
| `query` | STRING | Raw search text entered by the buyer. |
| `results_count` | INTEGER | Number of results returned. |
| `clicked` | BOOLEAN | Whether the buyer clicked a result. |
| `converted` | BOOLEAN | Whether the search led to an order. |
| `order_id` | STRING | Order the search converted into, if any. FK to [Orders](./orders.md) |
| `time_to_match_mins` | FLOAT | Search → transaction latency in minutes (null unless converted). |

## Joins

- [Buyer](./buyer.md) — `buyer_id = buyer_id`
- [Category](./category.md) — `category_id = category_id`
- [Orders](./orders.md) — `order_id = order_id`
