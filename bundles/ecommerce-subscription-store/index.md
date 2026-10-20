---
title: "E-commerce Subscription Store"
description: |
  An online store that sells the same products two ways — once, and on a schedule — modeled end
  to end. Traffic, sessions and pageviews describe how shoppers arrive and move through the
  storefront; the catalog describes what they browse; orders and order lines capture what they
  buy and what it earns; and a dedicated subscription layer captures the part that makes this
  business predictable: the contracts, the offers behind them, every charge and lifecycle change
  they go through, and where each subscriber stands at the end of every month.

  The subscription layer is built around the two facts a recurring business lives on. First, that
  churn has two causes — a subscriber who decides to leave, and a subscriber whose card kept
  failing — and only one of them is recoverable. Second, that a skip or a pause is not a
  cancellation, and reporting that conflates them understates retention. Cancellation reasons,
  dunning retries, skips and pauses are therefore first-class, alongside the offer each contract
  runs on, so the discount the programme gives away can be weighed against the retention it buys.
  Advertising spend is unified on a daily grain and shares campaign naming with the storefront's
  traffic sources, which makes cost per subscriber answerable next to cost per order.

  **How this business is managed**
  - **Marketing** — brings shoppers in and turns first orders into subscriptions, at a cost per new subscriber the business can pay back.
  - **Retention** — keeps subscribers subscribed, and wins back the ones a failed card would otherwise cost.
  - **Finance** — grows the recurring share of revenue without giving away the margin behind it.

  **Key metrics** (finished months only — the current month is still filling)
  - New subscribers — visits where [Sessions · Is Subscription Conversion](./sessions.md?field=is_subscription_conversion), by [Sessions · Date](./sessions.md?field=date).
  - Subscriber churn — [Subscription Monthly Snapshot · Subscriber Churn Rate (monthly)](./subscription-monthly-snapshot.md?field=subscriber_churn_rate), by [Subscription Monthly Snapshot · Month](./subscription-monthly-snapshot.md?field=month).
  - Settled revenue — [Orders · Settled Revenue](./orders.md?field=settled_revenue), split by [Orders · Purchase Type](./orders.md?field=purchase_type); the subscription part of it, [Orders · Subscription Revenue Share](./orders.md?field=subscription_revenue_share), by [Orders · Order Date](./orders.md?field=order_date).
  - Ad spend — [Ad Spend · Spend](./ad-spend.md?field=spend).

  **Key Data Marts**
  - [Subscriptions](./subscriptions.md) — every subscription contract, its offer, its value and, when it ended, why.
  - [Subscription Monthly Snapshot](./subscription-monthly-snapshot.md) — where each subscriber stood at every month end.
  - [Orders](./orders.md) — the money on every order, one-time and subscription alike.
  - [Sessions](./sessions.md) — every visit, the channel behind it and what it ended in.
  - [Ad Spend](./ad-spend.md) — what each platform and campaign costs, day by day.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-10-20T17:56:48Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Vlad Flaks](https://github.com/vladflaks), [Rus Obolonsky](https://github.com/Obolrus)

| Data Mart | Fields |
|-----------|--------|
| [Ad Spend](./ad-spend.md) | 13 |
| [Customer Value](./customer-value.md) | 15 |
| [Customers](./customers.md) | 9 |
| [Order Items](./order-items.md) | 13 |
| [Orders](./orders.md) | 19 |
| [Page Views](./page-views.md) | 7 |
| [Pages](./pages.md) | 5 |
| [Products](./products.md) | 10 |
| [Selling Plans](./selling-plans.md) | 10 |
| [Sessions](./sessions.md) | 15 |
| [Subscription Events](./subscription-events.md) | 12 |
| [Subscription Monthly Snapshot](./subscription-monthly-snapshot.md) | 18 |
| [Subscriptions](./subscriptions.md) | 24 |
| [Traffic Sources](./traffic-sources.md) | 8 |
| [Visitors](./visitors.md) | 11 |

# Example Questions

- What share of revenue is recurring, how is it moving month over month, and which of new `subscriptions`, `plan changes` and cancellations is driving the change?
- How do subscriber cohorts retain over three, six and twelve months, and which delivery cadence and acquisition channel produce the stickiest subscribers?
- What does a new subscriber cost by channel, and how does that compare with the lifetime revenue they return — including the discount the `subscription programme` gives away?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/ecommerce-subscription-store)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![E-commerce Subscription Store model diagram](../res/screens/ecommerce-subscription-store.svg)
