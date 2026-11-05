---
title: "Pages"
description: |
  The pages behind page views: host name, path and title, one row per combination. The path
  is cut at the first `?`, `#` or `;`, so query strings and anchors are dropped. The title
  is part of the key, so one path with two titles is two pages. Page views point here
  through `pageHash`, a FARM_FINGERPRINT of host, path and title. Each run adds the pages
  of its own window. The table has no date, so a hash repeats once per run (once per day
  for daily runs). Count distinct hashes. In your own SQL over these tables, deduplicate it
  before joining, or rows multiply; OWOX Data Marts reports collapse joined fields per
  source row.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 11 · [11_page.sql](./references/sql-transformation/11_page.sql)
- **Destination table:** `page`
- **Write mode:** Append
- **Built from:** `_temp_objects` (staging), which holds only the current run's window

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `pageHash` | STRING | Page Hash | PK. FARM_FINGERPRINT of host name, path and title, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. |
| `hostName` | STRING | Host Name | The host name of the page, such as `www.example.com`. |
| `pagePath` | STRING | Page Path | The path of the page, cut at the first `?`, `#` or `;`. |
| `pageTitle` | STRING | Page Title | The title of the page, as the browser sent it. |

# Example Questions

- Which paths appear under more than one page title?
- How many distinct pages does each host serve?
- Which page titles does a given section of the site use?
