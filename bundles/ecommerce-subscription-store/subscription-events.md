---
title: "Subscription Events"
description: |
  Everything that ever happened to a subscription, in order — created, charged, declined,
  retried, skipped, paused, resumed, swapped to another plan, changed in quantity, cancelled
  and reactivated. Each row carries the cycle it belongs to and what it did to recurring
  revenue, which is what makes a month-over-month recurring revenue movement explainable
  rather than merely visible.

  Billing attempts live here alongside lifecycle changes on purpose. A declined charge never
  becomes an order, so without these rows the failed-payment half of churn would be invisible
  — and it is the half that is recoverable, because a retry that succeeds saves a subscriber
  who never intended to leave.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-28T16:51:45.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `event_id` | STRING | PK. Unique identifier of the subscription event. |
| `subscription_id` | STRING | Subscription the event belongs to. FK to [Subscriptions](./subscriptions.md) |
| `event_date` | DATE | Calendar date the event occurred on. |
| `event_timestamp` | TIMESTAMP | Exact moment the event was recorded, in UTC. |
| `event_type` | STRING | What happened: created, charge_success, charge_failed, charge_retry_success, skipped, paused, resumed, plan_swapped, quantity_changed, cancelled or reactivated. |
| `event_category` | STRING | Whether the event is a Billing attempt or a Lifecycle change, so the two can be reported apart. |
| `cycle_number` | INTEGER | Which delivery cycle of the subscription the event relates to, starting at one. |
| `amount` | FLOAT | Amount involved in the event; the charged amount for billing events and zero for lifecycle changes. |
| `mrr_delta` | FLOAT | Signed change this event made to the subscription's monthly recurring value. |
| `retry_number` | INTEGER | Which dunning retry this charge attempt was; zero for a first attempt. |
| `decline_reason` | STRING | Why a charge attempt was declined, such as Insufficient funds, Card expired or Card declined. |
| `quantity_delta` | INTEGER | Signed change in the number of units per delivery, on events that changed the quantity. |

# Example Questions

- How many charges fail each month, and what share of them is recovered by a later retry?
- Are skips protecting retention — do subscribers who skip a cycle stay longer than those who never do?
- What drives recurring revenue movement month over month: new `subscriptions`, quantity and plan changes, or cancellations?

## Joins

- [Subscriptions](./subscriptions.md) — `subscription_id = subscription_id`
