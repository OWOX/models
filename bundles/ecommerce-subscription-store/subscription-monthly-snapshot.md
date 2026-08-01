---
title: "Subscription Monthly Snapshot"
description: |
  Where every subscriber stood at the end of each month: how many subscriptions they held, how
  much recurring and one-time revenue they produced, how many cycles were charged, skipped or
  declined, and whether that month was their first, their last, or a return after a break.
  Retention and recurring revenue become a single grouping rather than a window calculation.

  The cohort the subscriber belongs to travels with every row, so month-three and month-twelve
  retention can be read straight off this mart and compared across cadences and acquisition
  channels. Recurring and one-time revenue are kept apart deliberately: a store that sells both
  ways cannot judge the health of its subscription programme from a blended total.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-01T08:55:47.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `snapshot_id` | STRING | Snapshot ID | PK. Unique identifier of the subscriber-month record. |
| `month` | DATE | Month | First day of the month the snapshot describes. |
| `customer_id` | STRING | Customer ID | Subscriber the snapshot describes. FK to [Customers](./customers.md) |
| `primary_selling_plan_id` | STRING | Primary Selling Plan ID | Offer that carried most of this subscriber's recurring revenue in the month. FK to [Selling Plans](./selling-plans.md) |
| `cohort_month` | DATE | Cohort Month | Month the subscriber first subscribed in, used as the cohort anchor. |
| `months_since_cohort` | INTEGER | Months Since Cohort | Number of months between the cohort month and this snapshot month. |
| `status_at_month_end` | STRING | Status At Month End | Where the subscriber stood on the last day of the month: Active, Paused or Cancelled. |
| `active_subscriptions` | INTEGER | Active Subscriptions | Number of subscriptions the customer held in an active state at month end. |
| `paused_subscriptions` | INTEGER | Paused Subscriptions | Number of the customer's subscriptions that were paused at month end. |
| `recurring_revenue` | FLOAT | Recurring Revenue | Revenue the customer generated from subscription charges during the month. |
| `one_time_revenue` | FLOAT | One Time Revenue | Revenue the customer generated from one-time orders during the month. |
| `total_revenue` | FLOAT | Total Revenue | All revenue the customer generated during the month, recurring and one-time together. |
| `cycles_charged` | INTEGER | Cycles Charged | Number of subscription cycles successfully charged during the month. |
| `failed_charges` | INTEGER | Failed Charges | Number of charge attempts declined during the month. |
| `skipped_cycles` | INTEGER | Skipped Cycles | Number of deliveries the subscriber chose to skip during the month. |
| `is_new_subscriber` | BOOLEAN | Is New Subscriber | Whether the customer's first ever subscription started in this month. |
| `is_churned` | BOOLEAN | Is Churned | Whether the customer's last active subscription ended in this month. |
| `is_reactivated` | BOOLEAN | Is Reactivated | Whether the customer returned to an active subscription this month after a period without one. |

# Example Questions

- How do monthly subscriber cohorts retain over three, six and twelve months, and which cadence produces the stickiest ones?
- What share of total revenue is recurring, and is that share growing month over month?
- How many subscribers reactivate after churning, and how much revenue do they bring back compared with a newly acquired subscriber?

## Joins

- [Customers](./customers.md) — `customer_id = customer_id`
- [Selling Plans](./selling-plans.md) — `primary_selling_plan_id = selling_plan_id`
