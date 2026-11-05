---
title: "Traffic Sources"
description: |
  The source, medium, campaign, keyword and ad content Google Analytics attributed a
  session to, one row per combination. They are read as they are from the export's
  `trafficSource` record, such as `google` / `organic`, `(direct)` / `(none)`, or the UTM
  tags of a campaign. Sessions point here through `trafficSourceHash`, a FARM_FINGERPRINT
  of the five values. The table has no date, so a hash repeats once per run (once per day
  for daily runs). Count distinct hashes. In your own SQL over these tables, deduplicate it
  before joining, or rows multiply; OWOX Data Marts reports collapse joined fields per
  source row.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 09 · [09_trafficsources.sql](./references/sql-transformation/09_trafficsources.sql)
- **Destination table:** `trafficsources`
- **Write mode:** Append
- **Built from:** the GA 360 export (`ga_sessions_*`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `trafficSourceHash` | STRING | Traffic Source Hash | PK. FARM_FINGERPRINT of source, medium, campaign, keyword and ad content, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. |
| `source` | STRING | Source | Where the session came from, from `trafficSource.source`, such as `google` or `(direct)`. |
| `medium` | STRING | Medium | The kind of traffic, from `trafficSource.medium`, such as `organic`, `cpc`, `referral` or `(none)`. |
| `campaign` | STRING | Campaign | The campaign name, from `trafficSource.campaign`. |
| `keyword` | STRING | Keyword | The keyword or search term, from `trafficSource.keyword`. |
| `adContent` | STRING | Ad Content | The ad variant, from `trafficSource.adContent`. |

# Example Questions

- Which campaigns run under each source and medium?
- Which keywords appear for paid search traffic?
- Which ad content variants does each campaign use?
