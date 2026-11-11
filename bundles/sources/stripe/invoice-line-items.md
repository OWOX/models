---
title: "Invoice line items"
description: |
  Every line on every invoice: what was billed, for which price and product, for which period.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/invoice-line-item"
    title: "Stripe API reference — Invoice line items"
---

## Connector endpoint

- **Endpoint:** Stripe · `invoice_line_items`
- **Default destination table:** `stripe_invoice_line_items`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `type` | STRING | Type | invoiceitem or subscription. |
| `amount` | INTEGER | Amount | Line amount in the smallest currency unit (cents for USD), after quantity, before invoice-level discounts. |
| `invoice` | STRING | Invoice | Invoice id (in_) the line belongs to. Join to invoices. FK to [Invoices](./invoices.md) |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `price_id` | STRING | Price ID | Price id (price_). Join to prices. FK to [Prices](./prices.md) |
| `quantity` | INTEGER | Quantity | Units billed. |
| `proration` | BOOLEAN | Proration | true for a proration line after a plan change. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `period_end` | INTEGER | Period End | End of the period, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `product_id` | STRING | Product ID | Product id (prod_). Join to products. FK to [Products](./products.md) |
| `description` | STRING | Description | Line description as printed. |
| `unit_amount` | INTEGER | Unit Amount | Unit price in the smallest currency unit (cents for USD). |
| `discountable` | BOOLEAN | Discountable | Whether invoice discounts apply to this line. |
| `period_start` | INTEGER | Period Start | Start of the period this line covers, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `subscription` | STRING | Subscription | Subscription id (sub_) when the line bills a subscription. |
| `subscription_item` | STRING | Subscription Item | Subscription item id (si_). Join to subscription_items. FK to [Subscription items](./subscription-items.md) |
| `recurring_interval` | STRING | Recurring Interval | month, year, week or day for recurring prices. |

# Example Questions

- Which `products` and `prices` drive invoiced revenue?
- How much of this month's invoicing is prorations from plan changes?

## Joins

- [Invoices](./invoices.md) — `invoice = id` [N:1] — The invoice the line is printed on.
  - [Invoices Charges](./charges.md)
    - [Invoices Charges Balance transactions](./balance-transactions.md)
      - [Invoices Charges Balance transactions Payouts](./payouts.md)
      - [Invoices Charges Balance transactions Refunds](./refunds.md)
    - [Invoices Charges Customers](./customers.md)
    - [Invoices Charges Payment intents](./payment-intents.md)
      - [Invoices Charges Payment intents Customers](./customers.md)
  - [Invoices Customers](./customers.md)
  - [Invoices Subscriptions](./subscriptions.md)
    - [Invoices Subscriptions Customers](./customers.md)
- [Prices](./prices.md) — `price_id = id` [N:1] — The price the line bills; empty on a line without one.
  - [Prices Products](./products.md)
- [Products](./products.md) — `product_id = id` [N:1] — The product of that price.
- [Subscription items](./subscription-items.md) — `subscription_item = id` [N:1] — For subscription lines.
  - [Subscription items Prices](./prices.md)
    - [Subscription items Prices Products](./products.md)
  - [Subscription items Products](./products.md)
  - [Subscription items Subscriptions](./subscriptions.md)
    - [Subscription items Subscriptions Customers](./customers.md)
    - [Subscription items Subscriptions Invoices](./invoices.md)
      - [Subscription items Subscriptions Invoices Charges](./charges.md)
        - [Subscription items Subscriptions Invoices Charges Balance transactions](./balance-transactions.md)
          - [Subscription items Subscriptions Invoices Charges Balance transactions Payouts](./payouts.md)
          - [Subscription items Subscriptions Invoices Charges Balance transactions Refunds](./refunds.md)
        - [Subscription items Subscriptions Invoices Charges Customers](./customers.md)
        - [Subscription items Subscriptions Invoices Charges Payment intents](./payment-intents.md)
          - [Subscription items Subscriptions Invoices Charges Payment intents Customers](./customers.md)
      - [Subscription items Subscriptions Invoices Customers](./customers.md)
