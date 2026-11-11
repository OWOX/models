---
title: "Products"
description: |
  The catalogue: every product, active or not.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/products"
    title: "Stripe API reference — Products"
---

## Connector endpoint

- **Endpoint:** Stripe · `products`
- **Default destination table:** `stripe_products`
- **Unique keys:** `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `name` | STRING | Name | Product name. |
| `active` | BOOLEAN | Active | Whether the product can be sold. |
| `description` | STRING | Description | Product description. |
| `type` | STRING | Type | service or good. |
| `default_price` | STRING | Default Price | Default price id (price_). |
| `unit_label` | STRING | Unit Label | Label for units (seat, GB) shown on invoices. |
| `statement_descriptor` | STRING | Statement Descriptor | Statement descriptor override. |
| `updated` | TIMESTAMP | Updated | Last update time. |
| `metadata` | JSON | Metadata | Metadata object as a JSON string. |

# Example Questions

- Which products are active, and which still carry subscriptions?
