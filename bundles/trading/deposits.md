---
title: "Deposits"
description: |
  The money ledger: one row per funding transaction, money in and money out, tied to the
  client, the trading account it moved through and the lead the client originally came from.
  Each transaction carries its amount in the currency it was made in and converted to USD, the
  rate used at the time, the payment method behind it — card, wire, crypto or an e-wallet —
  and a processing status, because a meaningful share of attempted funding never completes:
  it fails, is reversed or is cancelled, and counting those as revenue overstates the business.
  One row per client is flagged as that client's first ever deposit, which is where the
  acquisition funnel finally turns into cash.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T07:25:16.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `deposit_id` | STRING | Deposit ID | PK. Unique transaction identifier. |
| `client_id` | STRING | Client ID | . FK to [Clients](./clients.md) |
| `account_id` | STRING | Account ID | . The specific trading account the money moved into/out of. FK to [Trading Accounts](./trading-accounts.md) |
| `lead_id` | STRING | Lead ID | . This client's originating lead. NULL if not traceable. FK to [Leads](./leads.md) |
| `deposit_datetime` | TIMESTAMP | Deposit Datetime | Timestamp the transaction was initiated. |
| `transaction_type` | STRING | Transaction Type | `deposit` (money in) or `withdrawal` (money out). Filter on this before summing amounts — don't sum deposits and withdrawals together. |
| `is_ftd` | BOOLEAN | Is Ftd | True only for the single row that is this client's very first-ever deposit. Row-level equivalent of Clients.is_ftd (which is a per-client flag, not per-transaction). |
| `status` | STRING | Status | Processing status: `pending`, `completed`, `failed`, `reversed`, `cancelled`. Attempted rows carry their own `payment_method`, `currency`, `amount_local` and `exchange_rate`, so payment friction can be measured and valued; only `amount_normalized` is completion-gated — always filter `status = 'completed'` before summing revenue. |
| `amount_local` | FLOAT | Amount Local | Transaction amount in its original currency. Populated on attempted transactions too — a failed or pending payment has an amount — so `amount_local * exchange_rate` is the USD value of money that never arrived. For cross-currency totals of money that DID arrive use `amount_normalized`. |
| `currency` | STRING | Currency | Original transaction currency, taken from the account the money moved through. Populated on attempted transactions too. |
| `amount_normalized` | FLOAT | Amount Normalized | Transaction amount converted to USD. NULL unless `status = 'completed'` — the one completion-gated money column, so unarrived money can never reach a revenue total. SUM this (filtered to `transaction_type = 'deposit'`, `status = 'completed'`) for "deposit volume"/"revenue" questions. |
| `exchange_rate` | FLOAT | Exchange Rate | Conversion rate captured at transaction time; `1.0` on USD rows. Populated on attempted transactions too. |
| `payment_method` | STRING | Payment Method | `card`, `wire_transfer`, `crypto`, `skrill`, `neteller`, `paypal`. Populated on attempted transactions too — the rail a failed payment was attempted on is the point of asking — so failure rates are comparable across methods. |
| `country` | STRING | Country | Client's country at the time of the transaction. |
| `created_at` | TIMESTAMP | Created At | Record creation timestamp in the warehouse. |
| `count_deposits` | INTEGER | Count Deposits | Always `1` on every row; SUM to count transactions matching a filter (e.g. count of completed deposits). |

# Example Questions

- Which payment methods fail or get reversed most often, and how much money never actually arrives because of it?
- How does a `client`'s first deposit compare in size to everything they deposit afterwards, and does that depend on how they paid?
- What is our net money flow by month once withdrawals are set against completed deposits, and which countries are net outflows?

## Joins

- [Clients](./clients.md) — `client_id = client_id`
- [Leads](./leads.md) — `lead_id = lead_id`
- [Trading Accounts](./trading-accounts.md) — `account_id = account_id`
