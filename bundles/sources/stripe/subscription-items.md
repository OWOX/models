---
title: "Subscription items"
description: |
  The lines of every subscription: price and quantity. MRR = quantity × unit amount normalised to a month.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/subscription_items"
    title: "Stripe API reference — Subscription items"
---

## Connector endpoint

- **Endpoint:** Stripe · `subscription_items`
- **Default destination table:** `stripe_subscription_items`
- **Unique keys:** `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `subscription` | STRING | Subscription | FK to [Subscriptions](./subscriptions.md). Subscription id (sub_). Join to subscriptions. |
| `quantity` | INTEGER | Quantity | Units of the price on this item. |
| `price_id` | STRING | Price ID | FK to [Prices](./prices.md). Price id (price_). Join to prices. |
| `product_id` | STRING | Product ID | FK to [Products](./products.md). Product id (prod_). Join to products. |
| `unit_amount` | INTEGER | Unit Amount | Unit price in the smallest currency unit (cents for USD). |
| `price_currency` | STRING | Price Currency | Currency of the price. |
| `recurring_interval` | STRING | Recurring Interval | month, year, week or day. |
| `recurring_interval_count` | INTEGER | Recurring Interval Count | Number of intervals per billing cycle (3 with month = quarterly). |
| `price_nickname` | STRING | Price Nickname | Price nickname (plan name) if set. |
| `metadata` | JSON | Metadata | Metadata object as a JSON string. |

# Example Questions

- What is MRR today, by `product` and by billing interval?
- How did MRR move this month: new, expansion, contraction, churn?

## Joins

- [Subscriptions](./subscriptions.md) — `subscription = id` [N:1]
- [Prices](./prices.md) — `price_id = id` [N:1]
- [Products](./products.md) — `product_id = id` [N:1]
