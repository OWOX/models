---
title: "Prices"
description: |
  Every price (plan) of every product: amount, currency, billing interval, active flag.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/prices"
    title: "Stripe API reference — Prices"
---

## Connector endpoint

- **Endpoint:** Stripe · `prices`
- **Default destination table:** `stripe_prices`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `type` | STRING | Type | one_time or recurring. |
| `active` | BOOLEAN | Active | Whether the price can be used on new subscriptions. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `product` | STRING | Product | Product id (prod_). Join to products. FK to [Products](./products.md) |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `metadata` | STRING | Metadata | Metadata object as a JSON string. |
| `nickname` | STRING | Nickname | Price nickname (plan name). |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `lookup_key` | STRING | Lookup Key | Your own key for the price. |
| `unit_amount` | INTEGER | Unit Amount | Price per unit in the smallest currency unit (cents for USD); set only when billing_scheme is per_unit, null for tiered prices. |
| `tax_behavior` | STRING | Tax Behavior | inclusive, exclusive or unspecified. |
| `billing_scheme` | STRING | Billing Scheme | per_unit or tiered. |
| `recurring_interval` | STRING | Recurring Interval | month, year, week or day for recurring prices. |
| `recurring_usage_type` | STRING | Recurring Usage Type | licensed or metered. |
| `recurring_interval_count` | INTEGER | Recurring Interval Count | Intervals per billing cycle. |

# Example Questions

- Which prices (plans) are in use, at what amount and interval?
- How much list revenue do legacy inactive prices still bill?

## Joins

- [Products](./products.md) — `product = id` [N:1] — The product this price sells.
