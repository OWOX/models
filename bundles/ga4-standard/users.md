---
title: "Users"
description: |
  The visitors behind sessions, one row per GA4 pseudo user ID: the identifier GA4 gives a
  browser or app instance, not a person. The same person on two devices, or after clearing
  cookies, is two users here. `clientId`, `userId`, `visitorId`, `phone` and `email` are
  always empty: slots for identifiers from other sources. Sessions point here through
  `userHash`, a FARM_FINGERPRINT of all six identifiers, today the pseudo user ID alone. The
  table has no date, so a hash repeats once per run (once per day for daily runs). Count
  distinct hashes. In your own SQL over these tables, deduplicate it before joining, or rows
  multiply; OWOX Data Marts reports collapse joined fields per source row.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 11 · [11_users.sql](./references/sql-transformation/11_users.sql)
- **Destination table:** `users`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `userHash` | STRING | User Hash | PK. FARM_FINGERPRINT of the six identifiers below, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. |
| `clientId` | STRING | Client ID | Always empty. A slot for a client ID from another source. |
| `userId` | STRING | User ID | Always empty. A slot for your own user ID; GA4's `user_id` is not loaded here. |
| `visitorId` | STRING | Visitor ID | Always empty. A slot for a visitor ID from another source. |
| `userPseudoId` | STRING | GA4 Pseudo User ID | GA4's `user_pseudo_id`: one browser or app instance. |
| `phone` | STRING | Phone | Always empty. A slot for a phone number from your CRM. |
| `email` | STRING | Email | Always empty. A slot for an email address from your CRM. |

# Example Questions

- How many distinct users visited each month?
- On which visit do users make their first purchase?
- What share of users came back within 30 days?
