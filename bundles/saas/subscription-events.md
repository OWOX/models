---
type: "OWOX Data Mart"
title: "Subscription Events"
description: |
  The movement history behind recurring revenue: one row per subscription change — new,
  expansion, contraction, reactivation, or churn — with the signed revenue and seat deltas
  and the running revenue after each change. This is what reconstructs the revenue waterfall
  and the retention rates the business lives or dies by.
tags: ["owox"]
timestamp: 2026-07-23T12:51:27.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `event_id` | STRING | PK. Unique subscription-event identifier. |
| `account_id` | STRING | Account the event belongs to. FK to [Account](./account.md) |
| `subscription_id` | STRING | Subscription the event belongs to. FK to [Subscription](./subscription.md) |
| `event_ts` | TIMESTAMP | When the subscription change occurred. |
| `event_type` | STRING | MRR-movement type: new / expansion / contraction / reactivation / churn. |
| `plan_from` | STRING | Plan before the change. |
| `plan_to` | STRING | Plan after the change. |
| `mrr_delta` | NUMERIC | Signed MRR change — the MRR-movement waterfall. |
| `seats_delta` | INTEGER | Signed change in seat count. |
| `mrr_after` | NUMERIC | Total MRR after the change. |

# Example Questions

- What does the revenue waterfall look like month to month — how much new, expansion, contraction and churned revenue?
- What are gross and net revenue retention, and which is trending the wrong way?
- How much of expansion comes from seat growth versus tier upgrades?

## Joins

- [Account](./account.md) — `account_id = account_id`
- [Subscription](./subscription.md) — `subscription_id = subscription_id`
