---
title: "🥈 Orders"
description: "This data mart contains transaction-level records for all completed and in-progress orders, enabling analysis of customer purchasing behavior, order timelines, and fulfillment status. Each row represents a single order, linked to both a customer and a session, allowing you to track conversions and attribute purchases to user activity"
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-24T16:38:20.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | STRING | Unique identifier of the session where the order was placed |
| `customer_id` | INTEGER | Unique identifier of the customer who placed the order |
| `order_date` | DATE | The date when the transaction was completed |
| `order_id` | STRING | PK. Unique identifier of the purchase transaction |
| `status` | STRING | Current fulfillment state of the order (e.g., Completed) |

## Joins

- Products
- Purchases
- Customers
- Sessions
