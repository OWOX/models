---
title: "Event Traffic Sources"
description: |
  The traffic source GA4 records on a single event or page view, from its `source`,
  `medium`, `campaign`, `term` and `content` parameters: UTM tags, or GA4's own attribution
  such as `organic` or `referral`. One row per combination. Events and Pageviews point here
  through `eventTrafficSourceHash`. Most hits carry none of these parameters: they share one
  hash, whose row has every value empty, meaning nothing was recorded on the hit, not a
  missing record. The table has no date, so a hash repeats once per run (once per day for
  daily runs). Count distinct hashes. In your own SQL over these tables, deduplicate it
  before joining, or rows multiply; OWOX Data Marts reports collapse joined fields per
  source row.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 08 · [08_eventstrafficsources.sql](./references/sql-transformation/08_eventstrafficsources.sql)
- **Destination table:** `eventstrafficsources`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `eventTrafficSourceHash` | STRING | Event Traffic Source Hash | PK. FARM_FINGERPRINT of source, medium, campaign, term and content, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. |
| `source` | STRING | Event Source | The `source` parameter GA4 records on the hit: a UTM source, or GA4's own such as `google`. Empty when the hit carries none. |
| `medium` | STRING | Event Medium | The `medium` parameter GA4 records on the hit: a UTM medium, or GA4's own such as `organic` or `referral`. Empty when the hit carries none. |
| `campaign` | STRING | Event Campaign | The `campaign` parameter on the hit. Empty when the hit carries none. |
| `keyword` | STRING | Event Keyword | The `term` parameter on the hit, such as a paid keyword. Empty when the hit carries none. |
| `adContent` | STRING | Event Ad Content | The `content` parameter on the hit, such as an ad variant. Empty when the hit carries none. |

# Example Questions

- Which sources and mediums appear most often on page views?
- How many `events` carry each campaign's UTM tags?
- What share of page views carry any source at all?
