---
type: "OWOX Data Mart"
title: "Usage (daily)"
description: |
  Daily product engagement at the account-and-user level: active minutes, high-value actions
  taken, and how many distinct features were touched — the breadth signal for activation. The
  behavioral pulse that explains why accounts expand, stall, or churn.
tags: ["owox"]
timestamp: 2026-07-23T12:51:28.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `usage_id` | STRING | PK. Unique daily-usage record identifier. |
| `account_id` | STRING | Account that generated the usage. FK to [Account](./account.md) |
| `user_id` | STRING | User that generated the usage. FK to [User](./user.md) |
| `usage_date` | DATE | Calendar day of the usage. |
| `active_minutes` | INTEGER | Minutes the user was active in-product. |
| `key_actions` | INTEGER | Count of high-value actions taken. |
| `distinct_features_used` | INTEGER | Count of distinct product features touched that day — activation breadth. |

# Example Questions

- How does product engagement in the first weeks predict whether an account converts and expands?
- Which accounts are quietly disengaging — falling active minutes or narrowing feature use — before they churn?
- Does broader feature adoption go hand in hand with higher retention and revenue?

## Joins

- [Account](./account.md) — `account_id = account_id`
- [User](./user.md) — `user_id = user_id`
