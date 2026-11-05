---
title: "Geo"
description: |
  Where a session came from: country, region and city, one row per combination, as the
  GA 360 export records them. Sessions point here through `geoHash`, a FARM_FINGERPRINT of
  the three values. The table has no date, so a hash repeats once per run (once per day for
  daily runs). Count distinct hashes. In your own SQL over these tables, deduplicate it
  before joining, or rows multiply; OWOX Data Marts reports collapse joined fields per
  source row.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 07 · [07_geo.sql](./references/sql-transformation/07_geo.sql)
- **Destination table:** `geo`
- **Write mode:** Append
- **Built from:** the GA 360 export (`ga_sessions_*`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `geoHash` | STRING | Geo Hash | PK. FARM_FINGERPRINT of country, region and city, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. |
| `country` | STRING | Country | The session's country, as the export records it. |
| `region` | STRING | Region | The session's region or state, as the export records it. |
| `city` | STRING | City | The session's city, as the export records it. |

# Example Questions

- Which countries and cities appear in our traffic?
- How many distinct cities do we see in each country?
- Which regions of a given country do visitors come from?
