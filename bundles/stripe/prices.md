---
title: "Prices"
description: |
  Every price (plan) of every product: amount, currency, billing interval, active flag.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/prices"
    title: "Stripe API reference — Prices"
---

## Connector endpoint

- **Endpoint:** Stripe · `prices`
- **Default destination table:** `stripe_prices`
- **Unique keys:** `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `product` | STRING | Product | FK to [Products](./products.md). Product id (prod_). Join to products. |
| `active` | BOOLEAN | Active | Whether the price can be used on new subscriptions. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `unit_amount` | INTEGER | Unit Amount | Price per unit in the smallest currency unit (cents for USD); null for tiered or metered prices. |
| `type` | STRING | Type | one_time or recurring. |
| `billing_scheme` | STRING | Billing Scheme | per_unit or tiered. |
| `recurring_interval` | STRING | Recurring Interval | month, year, week or day for recurring prices. |
| `recurring_interval_count` | INTEGER | Recurring Interval Count | Intervals per billing cycle. |
| `recurring_usage_type` | STRING | Recurring Usage Type | licensed or metered. |
| `nickname` | STRING | Nickname | Price nickname (plan name). |
| `lookup_key` | STRING | Lookup Key | Your own key for the price. |
| `tax_behavior` | STRING | Tax Behavior | inclusive, exclusive or unspecified. |
| `metadata` | JSON | Metadata | Metadata object as a JSON string. |

# Example Questions

- Which prices (plans) are in use, at what amount and interval?
- How much list revenue do legacy inactive prices still bill?

## Joins

- [Products](./products.md) — `product = id` [N:1]
