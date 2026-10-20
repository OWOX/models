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
timestamp: 2026-10-19T16:01:10.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `event_id` | STRING | Event ID | PK. Unique subscription-event identifier. |
| `account_id` | STRING | Account ID | Account the event belongs to. FK to [Account](./account.md) |
| `subscription_id` | STRING | Subscription ID | Subscription the event belongs to. FK to [Subscription](./subscription.md) |
| `event_ts` | TIMESTAMP | Event Time | When the subscription change occurred. |
| `event_type` | STRING | Event Type | MRR-movement type: new (an account's first subscription starting) / expansion (more seats, a higher tier, or an existing account's additional subscription starting) / contraction / reactivation (a win-back after a churn) / churn. |
| `plan_from` | STRING | Plan From | Plan tier before the change. Empty when a subscription starts or is won back. Differs from `plan_to` only on a tier change; a seat change keeps the tier. |
| `plan_to` | STRING | Plan To | Plan tier after the change. Empty on a churn. |
| `mrr_delta` | NUMERIC | MRR Delta | Signed MRR change — the MRR-movement waterfall. Always the step between two consecutive levels, so the deltas of a subscription add up to the movement in its recurring revenue over the period. |
| `seats_delta` | INTEGER | Seats Delta | Signed change in seat count: all of the subscription's seats on a start, win-back or churn, zero on a pure tier change. |
| `mrr_after` | NUMERIC | MRR After | The subscription's MRR after the change, reconciled with its contracted rate: a live subscription ends on that rate, and a canceled one was carrying it immediately before its churn, which takes it to 0. |

## Calculated fields

### `mrr_gained` · NUMERIC · Metric

- **Alias:** MRR Gained

Recurring revenue added: new, expansion and reactivation MRR summed at whatever grain the report asks for. Group by `event_type` to split it into its three sources.

```sql
SUM(IF(event_type IN ('new', 'expansion', 'reactivation'), mrr_delta, 0))
```

### `mrr_lost` · NUMERIC · Metric

- **Alias:** MRR Lost

Recurring revenue taken back: contraction and churned MRR, as a positive amount. Group by `event_type` to see how much is downgrades and how much is customers leaving.

```sql
-SUM(IF(event_type IN ('contraction', 'churn'), mrr_delta, 0))
```

### `net_new_mrr` · NUMERIC · Metric

- **Alias:** Net New MRR

Net change in recurring revenue: MRR Gained minus MRR Lost. Reads the two formulas, so all three always agree.

```sql
mrr_gained - mrr_lost
```

### `quick_ratio` · FLOAT · Metric

- **Alias:** SaaS Quick Ratio

Growth efficiency: MRR Gained per dollar of MRR Lost. Above 1 the base grows; the higher, the less growth is spent replacing what leaves. NULL where nothing was lost.

```sql
SAFE_DIVIDE(mrr_gained, mrr_lost)
```

# Example Questions

- What does the revenue waterfall look like month to month — how much new, expansion, contraction and churned revenue?
- What are gross and net revenue retention, and which is trending the wrong way?
- How much of expansion comes from seat growth versus tier upgrades?

## Joins

- [Account](./account.md) — `account_id = account_id` [N:1] — The account whose recurring revenue moved.
- [Subscription](./subscription.md) — `subscription_id = subscription_id` [N:1] — The subscription this change was made to.
  - [Subscription Account](./account.md) — The account behind the changed subscription.
  - [Subscription Plan](./plan.md) — The plan the changed subscription is on.
