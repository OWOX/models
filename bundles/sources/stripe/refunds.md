---
title: "Refunds"
description: |
  Money returned to customers: how much, on which charge, why, and the balance transaction that reversed it.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/refunds"
    title: "Stripe API reference — Refunds"
---

## Connector endpoint

- **Endpoint:** Stripe · `refunds`
- **Default destination table:** `stripe_refunds`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `amount` | INTEGER | Amount | Refunded amount in the smallest currency unit (cents for USD). |
| `charge` | STRING | Charge | Charge id (ch_) refunded. Join to charges. FK to [Charges](./charges.md) |
| `reason` | STRING | Reason | duplicate, fraudulent, requested_by_customer or expired_uncaptured_charge; null when not given. |
| `status` | STRING | Status | pending, requires_action, succeeded, failed or canceled. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `description` | STRING | Description | Optional description. |
| `payment_intent` | STRING | Payment Intent | Payment intent id (pi_) refunded. |
| `receipt_number` | STRING | Receipt Number | Receipt number shown to the customer. |
| `balance_transaction` | STRING | Balance Transaction | Balance transaction id (txn_) of the refund. Join to balance_transactions. FK to [Balance transactions](./balance-transactions.md) |

# Example Questions

- How much was refunded this month, by reason?
- Which `products` (through the `invoice` lines of the refunded `charge`) are refunded most?

## Joins

- [Charges](./charges.md) — `charge = id` [N:1] — The charge the money was returned on.
  - [Charges Balance transactions](./balance-transactions.md)
    - [Charges Balance transactions Payouts](./payouts.md)
  - [Charges Customers](./customers.md)
  - [Charges Invoices](./invoices.md)
    - [Charges Invoices Customers](./customers.md)
    - [Charges Invoices Subscriptions](./subscriptions.md)
      - [Charges Invoices Subscriptions Customers](./customers.md)
  - [Charges Payment intents](./payment-intents.md)
    - [Charges Payment intents Customers](./customers.md)
    - [Charges Payment intents Invoices](./invoices.md)
      - [Charges Payment intents Invoices Customers](./customers.md)
      - [Charges Payment intents Invoices Subscriptions](./subscriptions.md)
        - [Charges Payment intents Invoices Subscriptions Customers](./customers.md)
- [Balance transactions](./balance-transactions.md) — `balance_transaction = id` [N:1] — The money leaving the balance.
  - [Balance transactions Charges](./charges.md)
    - [Balance transactions Charges Customers](./customers.md)
    - [Balance transactions Charges Invoices](./invoices.md)
      - [Balance transactions Charges Invoices Customers](./customers.md)
      - [Balance transactions Charges Invoices Subscriptions](./subscriptions.md)
        - [Balance transactions Charges Invoices Subscriptions Customers](./customers.md)
    - [Balance transactions Charges Payment intents](./payment-intents.md)
      - [Balance transactions Charges Payment intents Customers](./customers.md)
      - [Balance transactions Charges Payment intents Invoices](./invoices.md)
        - [Balance transactions Charges Payment intents Invoices Customers](./customers.md)
        - [Balance transactions Charges Payment intents Invoices Subscriptions](./subscriptions.md)
          - [Balance transactions Charges Payment intents Invoices Subscriptions Customers](./customers.md)
  - [Balance transactions Payouts](./payouts.md)
