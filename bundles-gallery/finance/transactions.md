---
type: "OWOX Data Mart"
title: "Transactions"
description: |
  Every payment, withdrawal, transfer, and card authorization flowing through customer
  accounts — the day-to-day activity that shows how engaged customers are and where fraud
  shows up. Each record carries the amount, merchant category, channel, whether it was
  declined, and the fraud assessment made at the time of authorization. The pulse of
  everyday customer behavior.
tags: ["owox"]
timestamp: 2026-07-23T12:02:49.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `txn_id` | STRING | PK. Unique transaction identifier. |
| `account_id` | STRING | Account the transaction belongs to. FK to [Accounts](./accounts.md) |
| `txn_ts` | TIMESTAMP | When the transaction occurred. |
| `txn_type` | STRING | One of `purchase` / `atm_withdrawal` / `transfer` / `direct_debit` / `refund` / `fee`. |
| `mcc` | STRING | Merchant category code. Typical `amount` and implied interchange vary by MCC. |
| `amount` | NUMERIC | Transaction amount. |
| `currency` | STRING | Currency; consistent with the customer's `region`. |
| `is_declined` | BOOLEAN | Whether declined. Overall approval ~85–95%; declines skew to low/mid `fraud_score` (false positives) plus high-score fraud blocks. |
| `fraud_score` | FLOAT | Model score at authorization (0–1). |
| `is_confirmed_fraud` | BOOLEAN | Post-investigation label. Steeply correlated with high `fraud_score`; overall a low-basis-points share of volume. Together with `fraud_score` gives capture rate vs false-positive declines. |
| `channel` | STRING | One of `card_present` / `ecommerce` / `atm` / `online_banking` / `mobile`. |

# Example Questions

- Where does the fraud-detection system catch real fraud versus wrongly declining good customers?
- Which spending categories and channels drive the most transaction volume and value?
- How does everyday account activity differ between engaged customers and those going dormant?

## Joins

- [Accounts](./accounts.md) — `account_id = account_id`
