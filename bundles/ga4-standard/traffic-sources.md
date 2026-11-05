---
title: "Traffic Sources"
description: |
  The source, medium, campaign, keyword and ad content a session is attributed to, one row
  per combination. They come from parameters GA4 records on events: UTM tags, or GA4's own
  attribution such as `organic` or `referral`. A session opened by `session_start` takes the
  first values its GA4 session carries; one split off mid-visit takes those of the event
  that split it. With none it reads `(direct)` / `(none)`. Sessions point here through
  `trafficSourceHash`. The table has no date, so a hash repeats once per run (once per day
  for daily runs). Count distinct hashes. In your own SQL over these tables, deduplicate it
  before joining, or rows multiply; OWOX Data Marts reports collapse joined fields per
  source row.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 06 · [06_trafficsources.sql](./references/sql-transformation/06_trafficsources.sql)
- **Destination table:** `trafficsources`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `trafficSourceHash` | STRING | Traffic Source Hash | PK. FARM_FINGERPRINT of source, medium, campaign, keyword and ad content, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. |
| `source` | STRING | Source | Where the session came from: a UTM source or GA4's own, such as `google`. `(direct)` when the session carries none; `google` for a session split off mid-visit by an event with a gclid. |
| `medium` | STRING | Medium | The kind of traffic: a UTM medium or GA4's own, such as `organic` or `referral`. `(none)` when the session carries none; `cpc` for a session split off mid-visit by an event with a gclid. |
| `campaign` | STRING | Campaign | The campaign name, from the `campaign` parameter. Empty when the session carries none. |
| `keyword` | STRING | Keyword | The keyword or search term, from the `term` parameter. Empty when the session carries none. |
| `adContent` | STRING | Ad Content | The ad variant, from the `content` parameter. Empty when the session carries none. |

# Example Questions

- Which source and medium bring the most page views?
- Which campaigns drive the most purchase revenue?
- How does purchase revenue from organic search compare with paid?
