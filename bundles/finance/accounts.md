---
title: "Accounts"
description: |
  Every product a customer has opened — the funded relationships that turn a sign-up into
  an active customer. Tracks how each holding was activated, its current balance, and
  whether it is still active, dormant, frozen, closed, or written off. This is where you see
  who actually became a funded customer and how healthy those relationships are.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-23T12:02:48.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `account_id` | STRING | Account ID | PK. Unique account identifier. |
| `customer_id` | STRING | Customer ID | Owning customer. FK to [Customer](./customer.md) |
| `product_id` | STRING | Product ID | Product held in this account. FK to [Product](./product.md) |
| `opened_at` | DATE | Opened At | Date the account was opened. Only customers with `kyc_status = passed` open accounts. |
| `status` | STRING | Status | Current account status. One of `active` / `dormant` / `frozen` / `closed` / `charged_off`. |
| `current_balance` | NUMERIC | Current Balance | Current account balance. |
| `activated_at` | DATE | Activated At | First funding / first card use; `≥ opened_at`; null if never activated. |
| `is_active` | BOOLEAN | Is Active | Pure derivation: `is_active = (status = 'active')`. Not drawn independently. |

# Example Questions

- What share of opened accounts ever get activated, and how long does activation typically take?
- How are `balances` distributed across active versus dormant relationships?
- Which `product` types have the highest rate of accounts going dormant or being closed?

## Joins

- [Customer](./customer.md) — `customer_id = customer_id` — The customer who holds this account.
- [Product](./product.md) — `product_id = product_id` — The product this account was opened on.
