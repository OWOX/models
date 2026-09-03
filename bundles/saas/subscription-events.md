---
title: "Subscription Events"
description: |
  The movement history behind recurring revenue: one row per subscription change — new,
  expansion, contraction, reactivation, or churn — with the signed revenue and seat deltas
  and the running revenue after each change. This is what reconstructs the revenue waterfall
  and the retention rates the business lives or dies by.

  Running revenue reconciles with each subscription's own contracted rate. A subscription still
  on the books finishes the series on that rate; a subscription that churned was carrying it in
  the period immediately before the churn and the series steps away from it — so a churn reads as
  revenue lost from a customer's full rate, not as a downgrade on the way up to it.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-02T16:01:58.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `event_id` | STRING | Event ID | PK. Unique subscription-event identifier. |
| `account_id` | STRING | Account ID | Account the event belongs to. FK to [Account](./account.md) |
| `subscription_id` | STRING | Subscription ID | Subscription the event belongs to. FK to [Subscription](./subscription.md) |
| `event_ts` | TIMESTAMP | Event Time | When the subscription change occurred. |
| `event_type` | STRING | Event Type | MRR-movement type: new / expansion / contraction / reactivation / churn. |
| `plan_from` | STRING | Plan From | Plan before the change. |
| `plan_to` | STRING | Plan To | Plan after the change. |
| `mrr_delta` | NUMERIC | MRR Delta | Signed MRR change — the MRR-movement waterfall. Always the step between two consecutive levels, so the deltas of a subscription add up to the movement in its recurring revenue over the period. |
| `seats_delta` | INTEGER | Seats Delta | Signed change in seat count. |
| `mrr_after` | NUMERIC | MRR After | Total MRR after the change, reconciled with the subscription's contracted rate: a subscription with no churn in the period ends on that rate, and one that churned was carrying it immediately before the churn. |

# Example Questions

- What does the revenue waterfall look like month to month — how much new, expansion, contraction and churned revenue?
- What are gross and net revenue retention, and which is trending the wrong way?
- How much of expansion comes from seat growth versus tier upgrades?

## Joins

- [Account](./account.md) — `account_id = account_id` — The account whose recurring revenue moved.
- [Subscription](./subscription.md) — `subscription_id = subscription_id` — The subscription this change was made to.
  - [Account](./account.md) — The account behind the changed subscription.
  - [Plan](./plan.md) — The plan the changed subscription is on.
