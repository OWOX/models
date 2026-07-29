---
title: "Subscription"
description: |
  The billing spine: one row per subscription showing which account is on which plan, at what
  monthly recurring revenue and seat count, on what cadence, and with any negotiated discount.
  It also reveals where a subscription's plan has drifted from the account's current tier under
  grandfathered or discounted pricing. The source of truth for what each customer pays today.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-29T14:32:52.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `subscription_id` | STRING | Subscription ID | PK. Unique subscription identifier. |
| `account_id` | STRING | Account ID | Account that owns the subscription. FK to [Account](./account.md) |
| `plan_id` | STRING | Plan ID | Plan the subscription is billed on. May differ from the account's current tier under grandfathered pricing or a negotiated discount. FK to [Plan](./plan.md) |
| `status` | STRING | Status | Subscription status: trialing / active / past_due / canceled. |
| `seats_licensed` | INTEGER | Seats Licensed | Number of seats licensed on the subscription. |
| `mrr` | NUMERIC | MRR | Monthly recurring revenue for the subscription. |
| `currency` | STRING | Currency | Billing currency, aligned to the account's region. |
| `billing_interval` | STRING | Billing Interval | Billing cadence: monthly / annual. |
| `started_at` | DATE | Started At | Date the subscription started. |
| `current_period_start` | DATE | Current Period Start | Start of the current billing period. |
| `current_period_end` | DATE | Current Period End | End of the current billing period. |
| `canceled_at` | DATE | Canceled At | Date the subscription was canceled, if it was. |
| `discount_pct` | NUMERIC | Discount % | Negotiated discount fraction applied to list price, if any. |

# Example Questions

- What is total recurring revenue, and how is it spread across tiers, billing intervals and seat counts?
- How common are negotiated discounts, and how much list price do they give away?
- Which `accounts` sit on grandfathered pricing that no longer matches their current tier?

## Joins

- [Account](./account.md) — `account_id = account_id`
- [Plan](./plan.md) — `plan_id = plan_id`
