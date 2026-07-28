---
title: "Subscriptions"
description: |
  One row per subscription contract — who subscribed, to which product on which offer, how
  much it bills per cycle, how many cycles it has survived, and, when it ended, why. This is
  the centre of the recurring business: the active rows are the revenue base, and the ended
  rows are the entire churn story with its reason attached.

  A contract distinguishes the two ways subscriptions die, which reporting that only counts
  cancellations cannot: a subscriber who decided to leave, and a subscriber whose card kept
  failing until the retries ran out. Pause and skip are held apart from cancellation too, so a
  subscriber taking a break is never counted as lost.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-28T16:51:45.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `subscription_id` | STRING | PK. Unique identifier of the subscription contract. |
| `customer_id` | STRING | Customer who owns this subscription. FK to [Customers](./customers.md) |
| `selling_plan_id` | STRING | Subscription offer the contract was created on. FK to [Selling Plans](./selling-plans.md) |
| `product_id` | STRING | Product being delivered on this subscription. FK to [Products](./products.md) |
| `status` | STRING | Current state of the contract: Active, Paused or Cancelled. |
| `started_at` | DATE | Date the subscription was created. |
| `cohort_month` | DATE | First day of the month the subscription started in, used for retention cohorts. |
| `quantity` | INTEGER | Number of units delivered on each cycle. |
| `unit_price` | FLOAT | Price charged per unit on this contract, after the plan discount. |
| `recurring_value` | FLOAT | Amount billed on each cycle, being quantity multiplied by the unit price. |
| `monthly_recurring_value` | FLOAT | Recurring value normalised to a 30-day month, so cadences of different lengths can be summed into one recurring revenue figure. |
| `billing_interval_days` | INTEGER | Number of days between two charges on this contract. |
| `cycles_completed` | INTEGER | Number of cycles successfully charged and delivered so far. |
| `cycles_remaining` | INTEGER | Deliveries still owed on a prepaid contract; zero for pay-as-you-go. |
| `next_charge_date` | DATE | Date the next charge is scheduled for, on active contracts. |
| `last_charge_date` | DATE | Date of the most recent successful charge. |
| `paused_at` | DATE | Date the subscriber paused the contract, when it is currently paused. |
| `cancelled_at` | DATE | Date the contract ended, when it is no longer active. |
| `cancel_reason` | STRING | Why the contract ended, such as Too much product, Too expensive, Product quality, Found alternative, No longer needed or Payment failure. |
| `cancel_type` | STRING | Whether the ending was Voluntary, meaning the subscriber chose it, or Involuntary, meaning payment retries were exhausted. |
| `failed_payment_count` | INTEGER | Number of charge attempts on this contract that were declined. |
| `max_retries_reached` | BOOLEAN | Whether the dunning process ran out of retries on this contract. |
| `is_prepaid` | BOOLEAN | Whether the contract was paid upfront for several deliveries. |
| `tenure_days` | INTEGER | Number of days the contract has been alive, counted to its end date or to today. |

# Example Questions

- What share of churn is involuntary — failed payments rather than a decision to leave — and how has that share moved?
- Which cancellation reasons dominate, and do they differ between the shortest and the longest delivery cadences?
- How long does a subscription survive on average, and how much recurring revenue does it produce before it ends?

## Joins

- [Customers](./customers.md) — `customer_id = customer_id`
- [Products](./products.md) — `product_id = product_id`
- [Selling Plans](./selling-plans.md) — `selling_plan_id = selling_plan_id`
