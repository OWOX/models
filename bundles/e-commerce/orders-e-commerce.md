---
type: "OWOX Data Mart"
title: "🥈 Orders (E-Commerce)"
description: "This data mart contains transaction-level records for all completed and in-progress orders, enabling analysis of customer purchasing behavior, order timelines, and fulfillment status. Each row represents a single order, linked to both a customer and a session, allowing you to track conversions and attribute purchases to user activity"
tags: ["owox"]
timestamp: 2026-07-23T07:01:13.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | STRING | Unique identifier of the session where the order was placed FK to [🥈 Sessions (E-Commerce)](./sessions-e-commerce.md) |
| `customer_id` | INTEGER | Unique identifier of the customer who placed the order FK to [🥈 Customers (E-Commerce)](./customers-e-commerce.md) |
| `order_date` | DATE | The date when the transaction was completed |
| `order_id` | STRING | PK. Unique identifier of the purchase transaction FK to [🥈 Purchases (E-Commerce)](./purchases-e-commerce.md) |
| `status` | STRING | Current fulfillment state of the order (e.g., Completed) |

## Joins

- [Products](./products-e-commerce.md)
- [Purchases](./purchases-e-commerce.md) — `order_id = order_id`
- [Customers](./customers-e-commerce.md) — `customer_id = customer_id`
- [Sessions](./sessions-e-commerce.md) — `session_id = session_id`
