---
title: "Cancellations"
description: |
  One row for every order that was cancelled — and only those. Each row records who pulled
  the plug (buyer, seller or platform), at which stage (pre-payment, pre-fulfilment or
  in-transit), the stated reason, and how much was refunded. Because refund magnitude scales
  with stage — near zero pre-payment, close to full once fulfilment is underway — this is
  where an ops or trust-and-safety lead finds the fixable concentration of fill-rate failures.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T15:57:45.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `cancellation_id` | STRING | Cancellation ID | PK. Unique cancellation identifier. |
| `order_id` | STRING | Order ID | Order that was cancelled. FK to [Orders](./orders.md) |
| `cancelled_at` | TIMESTAMP | Cancelled At | When the cancellation happened. |
| `cancelled_by` | STRING | Cancelled By | Who cancelled: buyer, seller or platform. |
| `stage` | STRING | Stage | Order stage at cancellation: pre-payment, pre-fulfilment or in-transit. |
| `reason` | STRING | Reason | Stated cancellation reason. |
| `refund_amount` | NUMERIC | Refund Amount | Amount refunded to the buyer (never more than the order's gmv). |

# Example Questions

- Are cancellations concentrated in a stage or reason we can actually fix, and who is driving them — `buyers`, `sellers` or our own platform?
- What is the refund exposure by `category`, and how does it track the cancellation stage mix?
- Which `sellers` cancel disproportionately, hurting the `buyer` experience?

## Joins

- [Orders](./orders.md) — `order_id = order_id`
