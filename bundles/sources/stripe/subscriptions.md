---
title: "Subscriptions"
description: |
  One row per subscription in any status with its period, trial and cancellation facts. Recurring revenue is read from subscription items.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/subscriptions"
    title: "Stripe API reference — Subscriptions"
---

## Connector endpoint

- **Endpoint:** Stripe · `subscriptions`
- **Default destination table:** `stripe_subscriptions`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `status` | STRING | Status | trialing, active, past_due, unpaid, canceled, incomplete, incomplete_expired or paused. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `customer` | STRING | Customer | Customer id (cus_). Join to customers. FK to [Customers](./customers.md) |
| `ended_at` | INTEGER | Ended At | When the subscription ended, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `metadata` | STRING | Metadata | Metadata object as a JSON string. |
| `cancel_at` | INTEGER | Cancel At | Scheduled cancellation time, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `trial_end` | INTEGER | Trial End | Trial end, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `start_date` | INTEGER | Start Date | When the subscription started, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `canceled_at` | INTEGER | Canceled At | When the subscription was canceled, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `trial_start` | INTEGER | Trial Start | Trial start, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `days_until_due` | INTEGER | Days Until Due | Days until an invoice is due for send_invoice subscriptions. |
| `latest_invoice` | STRING | Latest Invoice | Latest invoice id (in_). Join to invoices. FK to [Invoices](./invoices.md) |
| `collection_method` | STRING | Collection Method | charge_automatically or send_invoice. |
| `current_period_end` | INTEGER | Current Period End | End of the current billing period; the next invoice date, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `cancellation_reason` | STRING | Cancellation Reason | Reason given at cancellation. |
| `cancel_at_period_end` | BOOLEAN | Cancel At Period End | true when set to cancel at the end of the current period. |
| `current_period_start` | INTEGER | Current Period Start | Start of the current billing period, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `cancellation_feedback` | STRING | Cancellation Feedback | Customer feedback at cancellation. |
| `default_payment_method` | STRING | Default Payment Method | Default payment method id (pm_). |

# Example Questions

- How many subscriptions are active, trialing, past due or canceled right now?
- How many subscriptions are set to cancel at the end of the period?
- Why do `customers` cancel, according to the cancellation reason?

## Joins

- [Customers](./customers.md) — `customer = id` [N:1] — The customer who owns the subscription.
- [Invoices](./invoices.md) — `latest_invoice = id` [N:1] — The most recent invoice.
  - [Invoices Charges](./charges.md)
    - [Invoices Charges Balance transactions](./balance-transactions.md)
      - [Invoices Charges Balance transactions Payouts](./payouts.md)
      - [Invoices Charges Balance transactions Refunds](./refunds.md)
    - [Invoices Charges Customers](./customers.md)
    - [Invoices Charges Payment intents](./payment-intents.md)
      - [Invoices Charges Payment intents Customers](./customers.md)
  - [Invoices Customers](./customers.md)
