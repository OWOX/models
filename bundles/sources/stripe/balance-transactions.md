---
title: "Balance transactions"
description: |
  Every movement of money through the Stripe balance: charges, refunds, disputes, fees, payouts, adjustments. Immutable once written. The accounting spine: `net` by `available_on` is revenue that reached the balance; `source` ties the fee to the charge, refund or payout that caused it.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/balance_transactions"
    title: "Stripe API reference — Balance transactions"
---

## Connector endpoint

- **Endpoint:** Stripe · `balance_transactions`
- **Default destination table:** `stripe_balance_transactions`
- **Unique keys:** `id`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `amount` | INTEGER | Amount | Gross amount of the transaction in the smallest currency unit (cents for USD); negative for money leaving the balance. |
| `fee` | INTEGER | Fee | Stripe fees taken on this transaction in the smallest currency unit (cents for USD). |
| `net` | INTEGER | Net | Amount after fees in the smallest currency unit (cents for USD): amount minus fee. What moves to the balance and, later, to the bank. |
| `currency` | STRING | Currency | Three-letter ISO currency code of amount, fee and net, lowercase. |
| `type` | STRING | Type | Transaction type: charge, refund, payout, adjustment, stripe_fee, application_fee, transfer, payment, dispute and about forty more. |
| `reporting_category` | STRING | Reporting Category | Stripe's reporting category (charge, refund, dispute, fee, payout, …), the stable grouping Stripe uses in its own financial reports. |
| `source` | STRING | Source | FK to [Payouts](./payouts.md). Id of the object that caused the movement: a charge (ch_), refund (re_), dispute (du_), payout (po_). Join key to those tables. |
| `status` | STRING | Status | available or pending: whether the funds can be paid out yet. |
| `available_on` | TIMESTAMP | Available On | When the funds became (or become) available for payout. The date to use for revenue that has reached the balance. |
| `exchange_rate` | FLOAT | Exchange Rate | Exchange rate applied when the charge currency differs from the balance currency; null otherwise. |
| `description` | STRING | Description | Free-text description Stripe attaches to the transaction. |
| `fee_details` | JSON | Fee Details | JSON list of the fees that make up fee: each with amount, currency, type (stripe_fee, application_fee, tax) and description. |

# Example Questions

- How much did we net after Stripe fees last month, and how much was fees?
- Which balance transactions made up payout po_… and do they sum to its amount?
- How much revenue became available for payout each week versus how much was charged?

## Joins

- [Charges](./charges.md) — `source = id` [N:1] — When type is charge or payment.
- [Refunds](./refunds.md) — `source = id` [N:1] — When type is refund.
- [Payouts](./payouts.md) — `source = id` [N:1] — When type is payout.
