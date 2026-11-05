---
title: "Geo"
description: |
  Where a session came from, as GA4 resolves it from the visitor's IP address: country,
  region and city, one row per combination. When a session's events disagree, the value from
  its latest event wins. Sessions point here through `geoHash`, a FARM_FINGERPRINT of the
  three values. The table has no date, so a hash repeats once per run (once per day for
  daily runs). Count distinct hashes. In your own SQL over these tables, deduplicate it
  before joining, or rows multiply; OWOX Data Marts reports collapse joined fields per
  source row.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 10 · [10_geo.sql](./references/sql-transformation/10_geo.sql)
- **Destination table:** `geo`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `geoHash` | STRING | Geo Hash | PK. FARM_FINGERPRINT of country, region and city, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. |
| `country` | STRING | Country | The country, by name, as GA4 reports it. |
| `region` | STRING | Region | The region or state within the country. |
| `city` | STRING | City | The city. |

# Example Questions

- Which countries bring the most purchase revenue?
- Which cities bring the most distinct buyers?
- How does the share of page views by region change month to month?
