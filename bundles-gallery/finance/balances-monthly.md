---
type: "OWOX Data Mart"
title: "Balances (monthly)"
description: |
  A month-by-month snapshot of every account's balance and the money it earns or costs the
  business — interest earned on lending, interest paid on deposits, and fee income. This is
  the view for understanding the earning power of the book over time and how balances build
  up or run down.
tags: ["owox"]
timestamp: 2026-07-23T12:02:48.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `snapshot_id` | STRING | PK. Unique identifier for the monthly balance snapshot. |
| `account_id` | STRING | Account the snapshot belongs to. FK to [Accounts](./accounts.md) |
| `month` | DATE | Calendar month of the snapshot. |
| `avg_balance` | NUMERIC | Average balance over the month. Carries month-over-month persistence per account (a random walk, not IID noise). |
| `interest_earned` | NUMERIC | Interest income the bank earns on the account. Non-zero for `card` / `loan` / `BNPL` products (APR × outstanding balance); ~0 for `deposit`. |
| `interest_paid` | NUMERIC | Interest the bank pays out to the customer. Non-zero for `deposit` products (deposit APY × `avg_balance`); ~0 for `card` / `loan` / `BNPL`. |
| `fees` | NUMERIC | Fee income for the month; scales with `avg_balance` / activity, not an independent draw. |

# Example Questions

- What is the net interest margin across the book, and how does it trend month over month?
- Which products and balance tiers contribute most to interest and fee income?
- How stable are deposit balances over time, and where is money quietly draining away?

## Joins

- [Accounts](./accounts.md) — `account_id = account_id`
