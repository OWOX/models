---
title: "Payouts"
description: |
  Transfers from the Stripe balance to the bank account with the arrival date. The bridge to the bank statement.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/payouts"
    title: "Stripe API reference — Payouts"
---

## Connector endpoint

- **Endpoint:** Stripe · `payouts`
- **Default destination table:** `stripe_payouts`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `type` | STRING | Type | bank_account or card. |
| `amount` | INTEGER | Amount | Amount sent to the bank in the smallest currency unit (cents for USD). |
| `method` | STRING | Method | standard or instant. |
| `status` | STRING | Status | paid, pending, in_transit, canceled or failed. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `automatic` | BOOLEAN | Automatic | true for payouts Stripe created on the payout schedule, false for manual ones. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `description` | STRING | Description | Stripe's description, usually STRIPE PAYOUT. |
| `destination` | STRING | Destination | Bank account (ba_) or card (card_) the payout went to. |
| `source_type` | STRING | Source Type | Balance type paid out: card, bank_account or fpx. |
| `arrival_date` | INTEGER | Arrival Date | Date the funds are expected in (or arrived at) the bank. The cash date, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `failure_code` | STRING | Failure Code | Why a payout failed (account_closed, no_account, …). |
| `failure_message` | STRING | Failure Message | Human-readable failure reason. |
| `balance_transaction` | STRING | Balance Transaction | Balance transaction id (txn_) of the payout itself (type payout). Join to balance_transactions. FK to [Balance transactions](./balance-transactions.md) |
| `statement_descriptor` | STRING | Statement Descriptor | Text on the bank statement. |

# Example Questions

- When did each payout arrive at the bank, and which ones failed?
- How many days pass between a `charge`'s created date and its payout's arrival date?

## Joins

- [Balance transactions](./balance-transactions.md) — `balance_transaction = id` [1:1] — The payout's own balance transaction (type payout); the transactions it contains are found with the payout filter on the API or by available_on.
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
  - [Balance transactions Refunds](./refunds.md)
    - [Balance transactions Refunds Charges](./charges.md)
      - [Balance transactions Refunds Charges Customers](./customers.md)
      - [Balance transactions Refunds Charges Invoices](./invoices.md)
        - [Balance transactions Refunds Charges Invoices Customers](./customers.md)
        - [Balance transactions Refunds Charges Invoices Subscriptions](./subscriptions.md)
          - [Balance transactions Refunds Charges Invoices Subscriptions Customers](./customers.md)
      - [Balance transactions Refunds Charges Payment intents](./payment-intents.md)
        - [Balance transactions Refunds Charges Payment intents Customers](./customers.md)
        - [Balance transactions Refunds Charges Payment intents Invoices](./invoices.md)
          - [Balance transactions Refunds Charges Payment intents Invoices Customers](./customers.md)
          - [Balance transactions Refunds Charges Payment intents Invoices Subscriptions](./subscriptions.md)
            - [Balance transactions Refunds Charges Payment intents Invoices Subscriptions Customers](./customers.md)
