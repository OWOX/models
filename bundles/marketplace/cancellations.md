---
type: "OWOX Data Mart"
title: "Cancellations"
description: "One row per cancelled order — the stage, cause, initiator and refund."
tags: ["owox"]
timestamp: 2026-07-24T10:45:13.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `cancellation_id` | STRING | PK. Unique cancellation identifier. |
| `order_id` | STRING | Order that was cancelled. FK to [Orders](./orders.md) |
| `cancelled_at` | TIMESTAMP | When the cancellation happened. |
| `cancelled_by` | STRING | Who cancelled: buyer, seller or platform. |
| `stage` | STRING | Order stage at cancellation: pre-payment, pre-fulfilment or in-transit. |
| `reason` | STRING | Stated cancellation reason. |
| `refund_amount` | NUMERIC | Amount refunded to the buyer (never more than the order's gmv). |

## Joins

- [Orders](./orders.md) — `order_id = order_id`
