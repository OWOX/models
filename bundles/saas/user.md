---
title: "User"
description: |
  The people inside each account: one row per user seat, with role, seat type, when they were
  invited, and how recently they were active. Seat-level activity is what turns a licensed
  account into an adopted one — and idle seats are early signs of shrinking value.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-11T08:35:01.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `user_id` | STRING | User ID | PK. Unique user identifier. |
| `account_id` | STRING | Account ID | Owning account. FK to [Account](./account.md) |
| `email` | STRING | Email | User's email address. |
| `role` | STRING | Role | User's role within the account. |
| `seat_type` | STRING | Seat Type | Type of seat assigned (e.g. full / viewer). |
| `invited_at` | TIMESTAMP | Invited At | When the user was invited. |
| `last_active_at` | TIMESTAMP | Last Active At | Most recent activity timestamp. |
| `is_active` | BOOLEAN | Is Active | Whether the seat is currently active. |

# Example Questions

- What share of licensed seats is actually active, and how does seat adoption vary by `account`?
- Which roles and seat types are the most engaged?
- Are `accounts` with many dormant seats the ones heading toward contraction?

## Joins

- [Account](./account.md) — `account_id = account_id` — Every seat belongs to one paying account, so roles, activity and seat counts roll up to the company.
