---
title: "Invoices"
description: |
  One row per invoice with amounts, status, period and payment. Status moves after creation (draft → open → paid, void, uncollectible).
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/invoices"
    title: "Stripe API reference — Invoices"
---

## Connector endpoint

- **Endpoint:** Stripe · `invoices`
- **Default destination table:** `stripe_invoices`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `tax` | INTEGER | Tax | Tax amount in the smallest currency unit (cents for USD). |
| `paid` | BOOLEAN | Paid | Whether the invoice is paid. |
| `total` | INTEGER | Total | Total after discounts and tax in the smallest currency unit (cents for USD). |
| `charge` | STRING | Charge | Charge id (ch_) that paid it. Join to charges. FK to [Charges](./charges.md) |
| `number` | STRING | Number | Invoice number shown to the customer. |
| `status` | STRING | Status | draft, open, paid, uncollectible or void. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `paid_at` | INTEGER | Paid At | When the invoice was paid, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `customer` | STRING | Customer | Customer id (cus_). Join to customers. FK to [Customers](./customers.md) |
| `due_date` | INTEGER | Due Date | When payment is due (send_invoice collection), as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `metadata` | STRING | Metadata | Metadata object as a JSON string. |
| `subtotal` | INTEGER | Subtotal | Sum of line items before discounts and tax in the smallest currency unit (cents for USD). |
| `attempted` | BOOLEAN | Attempted | Whether payment was attempted. |
| `voided_at` | INTEGER | Voided At | When the invoice was voided, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `amount_due` | INTEGER | Amount Due | Amount still to collect when finalized in the smallest currency unit (cents for USD). |
| `period_end` | INTEGER | Period End | End of the usage period, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `amount_paid` | INTEGER | Amount Paid | Amount paid in the smallest currency unit (cents for USD). |
| `finalized_at` | INTEGER | Finalized At | When the invoice was finalized, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `period_start` | INTEGER | Period Start | Start of the usage period the invoice covers, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `subscription` | STRING | Subscription | Subscription id (sub_) when the invoice bills a subscription. Join to subscriptions. FK to [Subscriptions](./subscriptions.md) |
| `attempt_count` | INTEGER | Attempt Count | Number of payment attempts made. |
| `billing_reason` | STRING | Billing Reason | subscription_create, subscription_cycle, subscription_update, manual, upcoming, … |
| `payment_intent` | STRING | Payment Intent | Payment intent id (pi_). |
| `amount_remaining` | INTEGER | Amount Remaining | Amount outstanding in the smallest currency unit (cents for USD). |
| `starting_balance` | INTEGER | Starting Balance | Customer balance applied at creation in the smallest currency unit (cents for USD). |
| `collection_method` | STRING | Collection Method | charge_automatically or send_invoice. |
| `hosted_invoice_url` | STRING | Hosted Invoice URL | Link to the hosted invoice page. |

# Example Questions

- How much is invoiced, paid and still outstanding this month?
- Which invoices are past due and how many payment attempts have been made?
- How much billed revenue was voided or became uncollectible?

## Joins

- [Customers](./customers.md) — `customer = id` [N:1] — The customer who is billed.
- [Subscriptions](./subscriptions.md) — `subscription = id` [N:1] — Set for subscription invoices.
  - [Subscriptions Customers](./customers.md)
- [Charges](./charges.md) — `charge = id` [N:1] — The charge that paid it.
  - [Charges Balance transactions](./balance-transactions.md)
    - [Charges Balance transactions Payouts](./payouts.md)
    - [Charges Balance transactions Refunds](./refunds.md)
  - [Charges Customers](./customers.md)
  - [Charges Payment intents](./payment-intents.md)
    - [Charges Payment intents Customers](./customers.md)
