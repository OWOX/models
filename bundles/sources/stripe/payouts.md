---
title: "Payouts"
description: |
  Transfers from the Stripe balance to the bank account with the arrival date. The bridge to the bank statement.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/payouts"
    title: "Stripe API reference — Payouts"
---

## Connector endpoint

- **Endpoint:** Stripe · `payouts`
- **Default destination table:** `stripe_payouts`
- **Unique keys:** `id`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `amount` | INTEGER | Amount | Amount sent to the bank in the smallest currency unit (cents for USD). |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `status` | STRING | Status | paid, pending, in_transit, canceled or failed. |
| `type` | STRING | Type | bank_account or card. |
| `method` | STRING | Method | standard or instant. |
| `automatic` | BOOLEAN | Automatic | true for payouts Stripe created on the payout schedule, false for manual ones. |
| `arrival_date` | TIMESTAMP | Arrival Date | Date the funds are expected in (or arrived at) the bank. The cash date. |
| `balance_transaction` | STRING | Balance Transaction | FK to [Balance transactions](./balance-transactions.md). Balance transaction id (txn_) of the payout itself (type payout). Join to balance_transactions. |
| `destination` | STRING | Destination | Bank account (ba_) or card (card_) the payout went to. |
| `failure_code` | STRING | Failure Code | Why a payout failed (account_closed, no_account, …). |
| `failure_message` | STRING | Failure Message | Human-readable failure reason. |
| `statement_descriptor` | STRING | Statement Descriptor | Text on the bank statement. |
| `description` | STRING | Description | Stripe's description, usually STRIPE PAYOUT. |
| `source_type` | STRING | Source Type | Balance type paid out: card, bank_account or fpx. |

# Example Questions

- When did each payout arrive at the bank, and which ones failed?
- How many days pass between a charge's created date and its payout's arrival date?

## Joins

- [Balance transactions](./balance-transactions.md) — `balance_transaction = id` [1:1] — The payout's own balance transaction (type payout); the transactions it contains are found with the payout filter on the API or by available_on.
