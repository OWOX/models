---
title: "Event Info"
description: |
  The category, action and label behind event hits, one row per combination, as the site
  sent them. Events point here through their `pageHash` column, which despite its name
  holds this table's `eventHash`, a FARM_FINGERPRINT of the three values. Each run adds the
  combinations of its own window. The table has no date, so a hash repeats once per run
  (once per day for daily runs). Count distinct hashes. In your own SQL over these tables,
  deduplicate it before joining, or rows multiply; OWOX Data Marts reports collapse joined
  fields per source row.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 12 · [12_eventinfo.sql](./references/sql-transformation/12_eventinfo.sql)
- **Destination table:** `eventinfo`
- **Write mode:** Append
- **Built from:** `_temp_objects` (staging), which holds only the current run's window

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `eventHash` | STRING | Event Hash | PK. FARM_FINGERPRINT of category, action and label, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. Events carry it as `pageHash`. |
| `eventCategory` | STRING | Event Category | The event category the site sent. |
| `eventAction` | STRING | Event Action | The event action the site sent. |
| `eventLabel` | STRING | Event Label | The event label the site sent. Empty when the event had none. |

# Example Questions

- Which actions are tracked under each event category?
- Which labels does a given event action use?
- How many distinct event categories does the site send?
