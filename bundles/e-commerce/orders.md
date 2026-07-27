---
title: "Orders"
description: |
  One row per order placed on the storefront — the header of the transaction, tying the
  browsing session it came from to the customer who placed it, the date, and the fulfilment
  state. Because a cancelled or returned order still occupies a row, gross order counts and
  settled revenue can be told apart instead of quietly merged.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T16:47:24.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | STRING | Unique identifier of the session where the order was placed FK to [Sessions](./sessions.md) |
| `customer_id` | INTEGER | Unique identifier of the customer who placed the order FK to [Customers](./customers.md) |
| `order_date` | DATE | The date when the transaction was completed |
| `order_id` | STRING | PK. Unique identifier of the purchase transaction FK to [Purchases](./purchases.md) |
| `status` | STRING | Current fulfillment state of the order (e.g., Completed) |

# Example Questions

- How many orders reach completion versus cancellation or return, and is that share drifting over time?
- What is average order value by `country`, device or acquisition channel?
- How long after a `session`'s first `pageview` does an order actually land?

## Joins

- [Products](./products.md)
- [Purchases](./purchases.md) — `order_id = order_id`
- [Customers](./customers.md) — `customer_id = customer_id`
- [Sessions](./sessions.md) — `session_id = session_id`
