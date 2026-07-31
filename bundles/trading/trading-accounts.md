---
title: "Trading Accounts"
description: |
  The accounts clients actually trade on: one row per MT4 or MT5 account, with the terms it
  was opened under — the base currency it is denominated in, the maximum leverage from a
  cautious 1:10 up to 1:500, and how the holder is classified: an ordinary retail client, a
  professional one, a swap-free islamic account or a practice account. Alongside the terms sit
  the two numbers that describe its state: the
  settled balance, and the equity that includes the profit or loss running on positions still
  open. A client can hold several accounts, which is where multi-account behaviour becomes
  visible — a second, higher-leverage account opened next to a conservative first one is a
  meaningful change in how someone is trading.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T07:55:26.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `account_id` | STRING | Account ID | PK. Unique trading account identifier. |
| `client_id` | STRING | Client ID | . Owner of this account — a client may have more than one account, so COUNT(account_id) can exceed COUNT(DISTINCT client_id). FK to [Clients](./clients.md) |
| `trading_platform` | STRING | Trading Platform | Trading platform: `MT4` or `MT5`. |
| `account_type` | STRING | Account Type | `retail`, `professional`, `demo` (no real money), `islamic` (swap-free). |
| `currency` | STRING | Currency | Account's base currency: `USD`, `EUR`, `GBP`, `AUD`. `balance`/`equity` are denominated in this currency, not USD. |
| `leverage` | STRING | Leverage | Maximum leverage on this account: `1:10`, `1:50`, `1:100`, `1:200`, `1:500`. |
| `status` | STRING | Status | Account state: `active`, `inactive`, `closed`. |
| `balance` | FLOAT | Balance | Current balance, in the account's own `currency` — excludes unrealized P&L from open positions. |
| `equity` | FLOAT | Equity | Current equity, in the account's own `currency` — balance adjusted for unrealized P&L on open positions. |
| `country` | STRING | Country | Country of the account holder at account-creation time. |
| `created_at` | TIMESTAMP | Created At | Timestamp the account was opened. |
| `count_deposits` | INTEGER | Count Deposits | Number of deposit transactions made into this specific account (see Deposits for the transactions themselves). |

# Example Questions

- Does higher leverage go with thinner accounts — how do equity and balance compare across leverage bands, and does the pattern differ between MT4 and MT5?
- How many `clients` run more than one account, and do the extra accounts attract their own funding or sit near-empty?
- Which kinds of account go quiet — what share becomes inactive or closed, broken down by account type and base currency?

## Joins

- [Clients](./clients.md) — `client_id = client_id`
