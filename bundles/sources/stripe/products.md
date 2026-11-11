---
title: "Products"
description: |
  The catalogue: every product, active or not.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/products"
    title: "Stripe API reference — Products"
---

## Connector endpoint

- **Endpoint:** Stripe · `products`
- **Default destination table:** `stripe_products`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `name` | STRING | Name | Product name. |
| `type` | STRING | Type | service or good. |
| `active` | BOOLEAN | Active | Whether the product can be sold. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `updated` | INTEGER | Updated | Last update time, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `metadata` | STRING | Metadata | Metadata object as a JSON string. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `unit_label` | STRING | Unit Label | Label for units (seat, GB) shown on invoices. |
| `description` | STRING | Description | Product description. |
| `default_price` | STRING | Default Price | Default price id (price_). |
| `statement_descriptor` | STRING | Statement Descriptor | Statement descriptor override. |

# Example Questions

- Which products are active, and which still carry `subscriptions`?
- Which inactive products still appear on this month's `invoice` lines?
