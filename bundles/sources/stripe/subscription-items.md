---
title: "Subscription items"
description: |
  The lines of every subscription: price and quantity. MRR = quantity × unit amount normalised to a month.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/subscription_items"
    title: "Stripe API reference — Subscription items"
---

## Connector endpoint

- **Endpoint:** Stripe · `subscription_items`
- **Default destination table:** `stripe_subscription_items`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `metadata` | STRING | Metadata | Metadata object as a JSON string. |
| `price_id` | STRING | Price ID | Price id (price_). Join to prices. FK to [Prices](./prices.md) |
| `quantity` | INTEGER | Quantity | Units of the price on this item. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `product_id` | STRING | Product ID | Product id (prod_). Join to products. FK to [Products](./products.md) |
| `unit_amount` | INTEGER | Unit Amount | Unit price in the smallest currency unit (cents for USD). |
| `subscription` | STRING | Subscription | Subscription id (sub_). Join to subscriptions. FK to [Subscriptions](./subscriptions.md) |
| `price_currency` | STRING | Price Currency | Currency of the price. |
| `price_nickname` | STRING | Price Nickname | Price nickname (plan name) if set. |
| `recurring_interval` | STRING | Recurring Interval | month, year, week or day. |
| `recurring_interval_count` | INTEGER | Recurring Interval Count | Number of intervals per billing cycle (3 with month = quarterly). |

# Example Questions

- What is MRR today, by `product` and by billing interval?
- How did MRR move this month: new, expansion, contraction, churn?

## Joins

- [Subscriptions](./subscriptions.md) — `subscription = id` [N:1] — The subscription the item is a line of.
  - [Subscriptions Customers](./customers.md)
  - [Subscriptions Invoices](./invoices.md)
    - [Subscriptions Invoices Charges](./charges.md)
      - [Subscriptions Invoices Charges Balance transactions](./balance-transactions.md)
        - [Subscriptions Invoices Charges Balance transactions Payouts](./payouts.md)
        - [Subscriptions Invoices Charges Balance transactions Refunds](./refunds.md)
      - [Subscriptions Invoices Charges Customers](./customers.md)
      - [Subscriptions Invoices Charges Payment intents](./payment-intents.md)
        - [Subscriptions Invoices Charges Payment intents Customers](./customers.md)
    - [Subscriptions Invoices Customers](./customers.md)
- [Prices](./prices.md) — `price_id = id` [N:1] — The price the customer is subscribed to.
  - [Prices Products](./products.md)
- [Products](./products.md) — `product_id = id` [N:1] — The product of that price.
