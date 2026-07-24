---
type: "OWOX Data Mart"
title: "User"
description: |
  The people inside each account: one row per user seat, with role, seat type, when they were
  invited, and how recently they were active. Seat-level activity is what turns a licensed
  account into an adopted one — and idle seats are early signs of shrinking value.
tags: ["owox"]
timestamp: 2026-07-23T12:51:27.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | STRING | PK. Unique user identifier. |
| `account_id` | STRING | Owning account. FK to [Account](./account.md) |
| `email` | STRING | User's email address. |
| `role` | STRING | User's role within the account. |
| `seat_type` | STRING | Type of seat assigned (e.g. full / viewer). |
| `invited_at` | TIMESTAMP | When the user was invited. |
| `last_active_at` | TIMESTAMP | Most recent activity timestamp. |
| `is_active` | BOOLEAN | Whether the seat is currently active. |

# Example Questions

- What share of licensed seats is actually active, and how does seat adoption vary by account?
- Which roles and seat types are the most engaged?
- Are accounts with many dormant seats the ones heading toward contraction?

## Joins

- [Account](./account.md) — `account_id = account_id`
