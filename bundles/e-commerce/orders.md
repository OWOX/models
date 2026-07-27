---
title: "Orders"
description: "This data mart contains transaction-level records for all completed and in-progress orders, enabling analysis of customer purchasing behavior, order timelines, and fulfillment status. Each row represents a single order, linked to both a customer and a session, allowing you to track conversions and attribute purchases to user activity"
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T15:06:19.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | STRING | Unique identifier of the session where the order was placed FK to [Sessions](./sessions.md) |
| `customer_id` | INTEGER | Unique identifier of the customer who placed the order FK to [Customers](./customers.md) |
| `order_date` | DATE | The date when the transaction was completed |
| `order_id` | STRING | PK. Unique identifier of the purchase transaction FK to [Purchases](./purchases.md) |
| `status` | STRING | Current fulfillment state of the order (e.g., Completed) |

## Joins

- [Products](./products.md)
- [Purchases](./purchases.md) — `order_id = order_id`
- [Customers](./customers.md) — `customer_id = customer_id`
- [Sessions](./sessions.md) — `session_id = session_id`
