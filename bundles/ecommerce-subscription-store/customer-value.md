---
title: "Customer Value"
description: |
  What each customer is worth today: revenue and units over the last twelve months, lifetime
  revenue, how recently they bought, the loyalty band that behaviour puts them in, and where
  they stand with the subscription programme. The session that first brought them in sits in the
  same row, which is what lets value be traced back to the channel that acquired it.

  Subscription standing is explicit — never subscribed, active, paused, churned or reactivated —
  alongside the share of the customer's revenue that is recurring. That combination answers the
  question the programme exists to settle: whether subscribers are genuinely worth more than
  one-time buyers, and by how much.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-28T16:51:41.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `customer_id` | STRING | PK. Customer this value profile describes. FK to [Customers](./customers.md) |
| `acquisition_session_id` | STRING | Browsing session during which the customer was first acquired. FK to [Sessions](./sessions.md) |
| `net_revenue_last_12m` | FLOAT | Revenue the customer generated over the last twelve months, after discounts and returns. |
| `units_sold_last_12m` | INTEGER | Number of individual units the customer bought over the last twelve months. |
| `orders_last_12m` | INTEGER | Number of orders the customer placed over the last twelve months. |
| `lifetime_net_revenue` | FLOAT | Total revenue the customer has generated since their first order. |
| `loyalty_segment` | STRING | Behavioural band the customer falls into, such as New, Returning, Loyal, At risk or Lapsed. |
| `subscriber_status` | STRING | Where the customer stands with the subscription programme: Never subscribed, Active, Paused, Churned or Reactivated. |
| `active_subscriptions` | INTEGER | Number of subscriptions the customer currently holds in an active state. |
| `months_subscribed` | INTEGER | Number of months the customer has held at least one active subscription. |
| `subscription_revenue_share` | FLOAT | Share of the customer's lifetime revenue that came from subscription orders, between zero and one. |
| `first_order_at` | DATE | Date the customer placed their first order. |
| `last_order_at` | DATE | Date the customer placed their most recent order. |
| `recency_days` | INTEGER | Number of days since the customer's most recent order. |
| `acquisition_channel_grouping` | STRING | Channel the customer was originally acquired through, such as Paid Search, Paid Social, Organic or Direct. |

# Example Questions

- How much more is a subscriber worth over twelve months than a one-time buyer, and does that gap hold across acquisition channels?
- Which channels deliver `customers` who go on to subscribe, rather than customers who buy once and leave?
- How much revenue sits with `customers` who have lapsed, and which loyalty bands are worth a win-back campaign?

## Joins

- [Customers](./customers.md) — `customer_id = customer_id`
- [Sessions](./sessions.md) — `acquisition_session_id = session_id`
