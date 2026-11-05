---
title: "Users"
description: |
  The visitors behind sessions, one row per client ID: the identifier Google Analytics gives
  a browser, not a person. The model builds a user from `clientId` alone; the other
  identifier columns are always empty, slots for other sources. Where the export carries no
  `clientId`, as in Google's public sample, every session lands on one user hash and this
  table holds one row per run. Sessions point here through `userHash`. The table has no
  date, so a hash repeats once per run (once per day for daily runs). Count distinct
  hashes. In your own SQL over these tables, deduplicate it before joining, or rows
  multiply; OWOX Data Marts reports collapse joined fields per source row.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 10 · [10_users.sql](./references/sql-transformation/10_users.sql)
- **Destination table:** `users`
- **Write mode:** Append
- **Built from:** the GA 360 export (`ga_sessions_*`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `userHash` | STRING | User Hash | PK. FARM_FINGERPRINT of the six identifiers below, joined without a separator, with an empty value in place of NULL; today the client ID alone. Unique within one run; repeats across daily runs. |
| `clientId` | STRING | Client ID | The export's `clientId`: one browser. Empty in exports that do not carry it, Google's public sample included. |
| `userId` | STRING | User ID | Always empty. A slot for your own user ID. |
| `visitorId` | STRING | Visitor ID | Always empty. A slot for a visitor ID from another source. |
| `userPseudoId` | STRING | Pseudo User ID | Always empty. A slot for a GA4 pseudo user ID. |
| `phone` | STRING | Phone | Always empty. A slot for a phone number from your CRM. |
| `email` | STRING | Email | Always empty. A slot for an email address from your CRM. |

# Example Questions

- How many distinct client IDs have we seen?
- Does our export carry a client ID at all, or do all `sessions` share one user?
- Is a given client ID among the visitors we have on file?
