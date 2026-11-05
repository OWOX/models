---
title: "User Traffic Sources"
description: |
  How each user was first acquired: the source, medium and campaign GA4 records for the
  user's first visit, not for any later session. Missing values read `(not set)`. Sessions
  point here through `userTrafficSourceHash`, which matches `trafficSourceHash` in this
  table although the names differ; both are a FARM_FINGERPRINT of the three values. The
  table has no date, so a hash repeats once per run (once per day for daily runs). Count
  distinct hashes. In your own SQL over these tables, deduplicate it before joining, or rows
  multiply; OWOX Data Marts reports collapse joined fields per source row.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 07 · [07_usertrafficsources.sql](./references/sql-transformation/07_usertrafficsources.sql)
- **Destination table:** `usertrafficsources`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `trafficSourceHash` | STRING | User Traffic Source Hash | PK. FARM_FINGERPRINT of the user's first source, medium and campaign, joined without a separator. Sessions carry it as `userTrafficSourceHash`. Unique within one run; repeats across daily runs. |
| `user_source` | STRING | First User Source | The source of the user's first visit, from GA4's `traffic_source.source`. `(not set)` when GA4 has none. |
| `user_medium` | STRING | First User Medium | The medium of the user's first visit, from GA4's `traffic_source.medium`. `(not set)` when GA4 has none. |
| `user_campaign` | STRING | First User Campaign | The campaign of the user's first visit, from GA4's `traffic_source.name`. `(not set)` when GA4 has none. |

# Example Questions

- Which first-touch sources bring `users` who come back for a second visit?
- How much revenue comes from `users` first acquired by paid search?
- Which campaigns acquired the `users` who are still visiting this month?
