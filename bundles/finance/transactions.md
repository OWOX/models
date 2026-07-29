---
title: "Transactions"
description: |
  Every payment, withdrawal, transfer, and card authorization flowing through customer
  accounts — the day-to-day activity that shows how engaged customers are and where fraud
  shows up. Each record carries the amount, merchant category, channel, whether it was
  declined, and the fraud assessment made at the time of authorization. The pulse of
  everyday customer behavior.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-29T14:32:40.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `txn_id` | STRING | Transaction ID | PK. Unique transaction identifier. |
| `account_id` | STRING | Account ID | Account the transaction belongs to. FK to [Accounts](./accounts.md) |
| `txn_ts` | TIMESTAMP | Transaction Time | When the transaction occurred. |
| `txn_type` | STRING | Transaction Type | One of `purchase` / `atm_withdrawal` / `transfer` / `direct_debit` / `refund` / `fee`. |
| `mcc` | STRING | MCC | Merchant category code. Typical `amount` and implied interchange vary by MCC. |
| `amount` | NUMERIC | Amount | Transaction amount. |
| `currency` | STRING | Currency | Currency; consistent with the customer's `region`. |
| `is_declined` | BOOLEAN | Is Declined | Whether declined. Overall approval ~85–95%; declines skew to low/mid `fraud_score` (false positives) plus high-score fraud blocks. |
| `fraud_score` | FLOAT | Fraud Score | Model score at authorization (0–1). |
| `is_confirmed_fraud` | BOOLEAN | Is Confirmed Fraud | Post-investigation label. Steeply correlated with high `fraud_score`; overall a low-basis-points share of volume. Together with `fraud_score` gives capture rate vs false-positive declines. |
| `channel` | STRING | Channel | One of `card_present` / `ecommerce` / `atm` / `online_banking` / `mobile`. |

# Example Questions

- Where does the fraud-detection system catch real fraud versus wrongly declining good `customers`?
- Which spending categories and channels drive the most transaction volume and value?
- How does everyday `account` activity differ between engaged `customers` and those going dormant?

## Joins

- [Accounts](./accounts.md) — `account_id = account_id`
