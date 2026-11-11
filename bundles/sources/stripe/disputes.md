---
title: "Disputes"
description: |
  Chargebacks: disputed amount, reason, status and the evidence deadline. A dispute debits the amount plus a fee from the balance.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/disputes"
    title: "Stripe API reference — Disputes"
---

## Connector endpoint

- **Endpoint:** Stripe · `disputes`
- **Default destination table:** `stripe_disputes`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `amount` | INTEGER | Amount | Disputed amount in the smallest currency unit (cents for USD). |
| `charge` | STRING | Charge | Charge id (ch_) disputed. Join to charges. FK to [Charges](./charges.md) |
| `reason` | STRING | Reason | fraudulent, product_not_received, duplicate, subscription_canceled, credit_not_processed, general, … |
| `status` | STRING | Status | warning_needs_response, warning_under_review, warning_closed, needs_response, under_review, won or lost. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `payment_intent` | STRING | Payment Intent | Payment intent id (pi_) disputed. FK to [Payment intents](./payment-intents.md) |
| `evidence_due_by` | INTEGER | Evidence Due By | Deadline to submit evidence, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `balance_transactions` | STRING | Balance Transactions | JSON list of the balance transactions (debit and, if won, credit) tied to the dispute. Stored as a JSON string. |
| `is_charge_refundable` | BOOLEAN | Is Charge Refundable | Whether the charge can still be refunded instead of fought. |
| `evidence_has_evidence` | BOOLEAN | Evidence Has Evidence | Whether evidence has been submitted. |

# Example Questions

- How many disputes are open, how much is at stake, and when is evidence due?
- What is our dispute rate (disputes per hundred `charges`) by month?

## Joins

- [Charges](./charges.md) — `charge = id` [N:1] — The charge the customer disputed.
  - [Charges Balance transactions](./balance-transactions.md)
    - [Charges Balance transactions Payouts](./payouts.md)
    - [Charges Balance transactions Refunds](./refunds.md)
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
- [Payment intents](./payment-intents.md) — `payment_intent = id` [N:1] — The disputed payment intent, when the charge had one.
  - [Payment intents Charges](./charges.md)
    - [Payment intents Charges Balance transactions](./balance-transactions.md)
      - [Payment intents Charges Balance transactions Payouts](./payouts.md)
      - [Payment intents Charges Balance transactions Refunds](./refunds.md)
    - [Payment intents Charges Customers](./customers.md)
    - [Payment intents Charges Invoices](./invoices.md)
      - [Payment intents Charges Invoices Customers](./customers.md)
      - [Payment intents Charges Invoices Subscriptions](./subscriptions.md)
        - [Payment intents Charges Invoices Subscriptions Customers](./customers.md)
  - [Payment intents Customers](./customers.md)
  - [Payment intents Invoices](./invoices.md)
    - [Payment intents Invoices Charges](./charges.md)
      - [Payment intents Invoices Charges Balance transactions](./balance-transactions.md)
        - [Payment intents Invoices Charges Balance transactions Payouts](./payouts.md)
        - [Payment intents Invoices Charges Balance transactions Refunds](./refunds.md)
      - [Payment intents Invoices Charges Customers](./customers.md)
    - [Payment intents Invoices Customers](./customers.md)
    - [Payment intents Invoices Subscriptions](./subscriptions.md)
      - [Payment intents Invoices Subscriptions Customers](./customers.md)
