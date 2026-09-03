---
title: "Usage (daily)"
description: |
  Daily product engagement at the account-and-user level: active minutes, high-value actions
  taken, and how many distinct features were touched — the breadth signal for activation. The
  behavioral pulse that explains why accounts expand, stall, or churn.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-02T16:01:59.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `usage_id` | STRING | Usage ID | PK. Unique daily-usage record identifier. |
| `account_id` | STRING | Account ID | Account that generated the usage. FK to [Account](./account.md) |
| `user_id` | STRING | User ID | User that generated the usage. FK to [User](./user.md) |
| `usage_date` | DATE | Usage Date | Calendar day of the usage. |
| `active_minutes` | INTEGER | Active Minutes | Minutes the user was active in-product. |
| `key_actions` | INTEGER | Key Actions | Count of high-value actions taken. |
| `distinct_features_used` | INTEGER | Distinct Features Used | Count of distinct product features touched that day — activation breadth. |

# Example Questions

- How does product engagement in the first weeks predict whether an `account` converts and expands?
- Which `accounts` are quietly disengaging — falling active minutes or narrowing feature use — before they churn?
- Does broader feature adoption go hand in hand with higher retention and revenue?

## Joins

- [Account](./account.md) — `account_id = account_id` — The account that generated the usage.
- [User](./user.md) — `user_id = user_id` — The seat that generated the usage.
  - [Account](./account.md) — The account of the seat that generated the usage.
