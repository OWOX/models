---
title: "Invoice line items"
description: |
  Every line on every invoice: what was billed, for which price and product, for which period.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/invoice-line-item"
    title: "Stripe API reference — Invoice line items"
---

## Connector endpoint

- **Endpoint:** Stripe · `invoice_line_items`
- **Default destination table:** `stripe_invoice_line_items`
- **Unique keys:** `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `invoice` | STRING | Invoice | FK to [Invoices](./invoices.md). Invoice id (in_) the line belongs to. Join to invoices. |
| `amount` | INTEGER | Amount | Line amount in the smallest currency unit (cents for USD), after quantity, before invoice-level discounts. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `description` | STRING | Description | Line description as printed. |
| `quantity` | INTEGER | Quantity | Units billed. |
| `period_start` | TIMESTAMP | Period Start | Start of the period this line covers. |
| `period_end` | TIMESTAMP | Period End | End of the period. |
| `price_id` | STRING | Price ID | FK to [Prices](./prices.md). Price id (price_). Join to prices. |
| `product_id` | STRING | Product ID | FK to [Products](./products.md). Product id (prod_). Join to products. |
| `unit_amount` | INTEGER | Unit Amount | Unit price in the smallest currency unit (cents for USD). |
| `recurring_interval` | STRING | Recurring Interval | month, year, week or day for recurring prices. |
| `proration` | BOOLEAN | Proration | true for a proration line after a plan change. |
| `type` | STRING | Type | invoiceitem or subscription. |
| `subscription` | STRING | Subscription | Subscription id (sub_) when the line bills a subscription. |
| `subscription_item` | STRING | Subscription Item | FK to [Subscription items](./subscription-items.md). Subscription item id (si_). Join to subscription_items. |
| `discountable` | BOOLEAN | Discountable | Whether invoice discounts apply to this line. |

# Example Questions

- Which `products` and `prices` drive invoiced revenue?
- How much of this month's invoicing is prorations from plan changes?

## Joins

- [Invoices](./invoices.md) — `invoice = id` [N:1]
- [Prices](./prices.md) — `price_id = id` [N:1]
- [Products](./products.md) — `product_id = id` [N:1]
- [Subscription items](./subscription-items.md) — `subscription_item = id` [N:1] — For subscription lines.
