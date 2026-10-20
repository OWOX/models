---
title: "Subscription"
description: |
  The billing spine: one row per subscription showing which account is on which plan, at what
  monthly recurring revenue and seat count, on what cadence, and with any negotiated discount.
  It also reveals which subscriptions stay on a plan one tier below the account's under
  grandfathered pricing. The source of truth for what each customer pays today.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-14T22:50:10.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `subscription_id` | STRING | Subscription ID | PK. Unique subscription identifier. |
| `account_id` | STRING | Account ID | Account that owns the subscription. FK to [Account](./account.md) |
| `plan_id` | STRING | Plan ID | Plan the subscription is billed on, at the subscription's own billing interval. On the account's tier, except about one in ten grandfathered one tier below. FK to [Plan](./plan.md) |
| `status` | STRING | Status | Subscription status: active / past_due / canceled. |
| `seats_licensed` | INTEGER | Seats Licensed | Number of seats licensed on the subscription. Follows the size of the account, so a grandfathered subscription keeps its account's seats on the cheaper plan. |
| `mrr` | NUMERIC | MRR | Contracted monthly recurring revenue in USD: seats times the plan's per-seat monthly price, less the discount. The rate on the agreement, unchanged by cancellation. |
| `active_mrr` | NUMERIC | Active MRR | Live monthly recurring revenue: still contracted unless canceled, when it drops to 0. Equal to `mrr` for `active` and `past_due` subscriptions alike — a failed payment does not by itself stop the contract. |
| `currency` | STRING | Currency | Currency the customer is billed in, aligned to the account's region. Every amount in this model is stated in USD. |
| `billing_interval` | STRING | Billing Interval | Billing cadence: monthly / annual. |
| `started_at` | DATE | Started At | Date the subscription started — on or after its account signed up. Its billing anniversaries fall on this day. |
| `current_period_start` | DATE | Current Period Start | Start of the current billing period — the latest billing anniversary, or the last one before cancellation. |
| `current_period_end` | DATE | Current Period End | End of the current billing period. |
| `canceled_at` | DATE | Canceled At | Date the subscription was canceled, if it was. Every subscription of a churned account is canceled. |
| `discount_pct` | NUMERIC | Discount % | Negotiated discount fraction applied to list price, if any. |

## Calculated fields

### `arpa` · FLOAT · Metric

- **Alias:** ARPA

Average live MRR per paying account. Divides by distinct accounts, not subscriptions — many accounts hold several — and leaves canceled subscriptions out of both sides.

```sql
SAFE_DIVIDE(SUM(active_mrr), COUNT(DISTINCT IF(active_mrr > 0, account_id, NULL)))
```

### `discount_band` · STRING · Column

- **Alias:** Discount Band

List price, Light, Moderate or Deep discount, from the negotiated discount. A row-level formula that behaves as a dimension: group and filter by it.

```sql
CASE WHEN discount_pct IS NULL OR discount_pct = 0 THEN 'List price' WHEN discount_pct < 0.12 THEN 'Light (5-11%)' WHEN discount_pct < 0.19 THEN 'Moderate (12-18%)' ELSE 'Deep (19%+)' END
```

# Example Questions

- What is total recurring revenue, and how is it spread across tiers, billing intervals and seat counts?
- How common are negotiated discounts, and how much list price do they give away?
- Which `accounts` sit on grandfathered pricing that no longer matches their current tier?

## Joins

- [Account](./account.md) — `account_id = account_id` [N:1] — The account paying for this subscription.
- [Plan](./plan.md) — `plan_id = plan_id` [N:1] — The plan this subscription is billed on.
