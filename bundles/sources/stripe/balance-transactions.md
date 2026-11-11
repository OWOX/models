---
title: "Balance transactions"
description: |
  Every movement of money through the Stripe balance: charges, refunds, disputes, fees, payouts, adjustments. Immutable once written. The accounting spine: `net` by `available_on` is revenue that reached the balance; `source` ties the fee to the charge, refund or payout that caused it.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/balance_transactions"
    title: "Stripe API reference — Balance transactions"
---

## Connector endpoint

- **Endpoint:** Stripe · `balance_transactions`
- **Default destination table:** `stripe_balance_transactions`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `fee` | INTEGER | Fee | All fees taken on this transaction in the smallest currency unit (cents for USD), positive when assessed; fee_details splits it into Stripe, application, tax and payment-method pass-through fees. |
| `net` | INTEGER | Net | Amount after fees in the smallest currency unit (cents for USD): amount minus fee. What moves to the balance and, later, to the bank. |
| `type` | STRING | Type | Transaction type: charge, refund, payout, adjustment, stripe_fee, application_fee, transfer, payment, dispute and about forty more. |
| `amount` | INTEGER | Amount | Gross amount of the transaction in the smallest currency unit (cents for USD); negative for money leaving the balance. |
| `source` | STRING | Source | Id of the object that caused the movement: a charge (ch_), refund (re_), dispute (du_), payout (po_). Join key to those tables. FK to [Charges](./charges.md) |
| `status` | STRING | Status | available or pending: whether the funds can be paid out yet. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `currency` | STRING | Currency | Three-letter ISO currency code of amount, fee and net, lowercase. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `description` | STRING | Description | Free-text description Stripe attaches to the transaction. |
| `fee_details` | STRING | Fee Details | JSON list of the fees that make up fee: each with amount, currency, type (stripe_fee, application_fee, tax) and description. Stored as a JSON string. |
| `available_on` | INTEGER | Available On | When the funds became (or become) available for payout. The date to use for revenue that has reached the balance, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `exchange_rate` | FLOAT | Exchange Rate | Exchange rate applied when the charge currency differs from the balance currency; null otherwise. |
| `reporting_category` | STRING | Reporting Category | Stripe's reporting category (charge, refund, dispute, fee, payout, …), the stable grouping Stripe uses in its own financial reports. |

# Example Questions

- How much did we net after Stripe fees last month, and how much was fees?
- Which balance transactions made up `payout` po_… and do they sum to its amount?
- How much revenue became available for `payout` each week versus how much was charged?

## Joins

- [Charges](./charges.md) — `source = id` [N:1] — When type is charge or payment.
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
- [Refunds](./refunds.md) — `source = id` [N:1] — When type is refund.
  - [Refunds Charges](./charges.md)
    - [Refunds Charges Customers](./customers.md)
    - [Refunds Charges Invoices](./invoices.md)
      - [Refunds Charges Invoices Customers](./customers.md)
      - [Refunds Charges Invoices Subscriptions](./subscriptions.md)
        - [Refunds Charges Invoices Subscriptions Customers](./customers.md)
    - [Refunds Charges Payment intents](./payment-intents.md)
      - [Refunds Charges Payment intents Customers](./customers.md)
      - [Refunds Charges Payment intents Invoices](./invoices.md)
        - [Refunds Charges Payment intents Invoices Customers](./customers.md)
        - [Refunds Charges Payment intents Invoices Subscriptions](./subscriptions.md)
          - [Refunds Charges Payment intents Invoices Subscriptions Customers](./customers.md)
- [Payouts](./payouts.md) — `source = id` [N:1] — When type is payout.
