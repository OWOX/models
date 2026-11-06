---
title: "Performance by date"
description: |
  Daily clicks, impressions, CTR and average position for the whole property and one search type, the same totals the Performance report header shows. One row per day; the smallest table and the reference every breakdown is checked against, because the query breakdown omits anonymised queries. Loaded by date window with a 3-day lag so only finalised days land.
tags: ["owox", "connector", "google-search-console"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developers.google.com/webmaster-tools/v1/searchanalytics/query"
    title: "OWOX Data Marts — Google Search Console custom connector (GoogleSearchConsole, 8 nodes) on the Search Console API v1"
  - id: "vendor-reference"
    resource: "https://developers.google.com/webmaster-tools/v1/searchanalytics/query"
    title: "Google Search Console API reference — Performance by date"
---

## Connector endpoint

- **Endpoint:** Google Search Console · `performance_by_date`
- **Default destination table:** `search_console_by_date`
- **Unique keys:** `site_url`, `search_type`, `date`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `site_url` | STRING | Site URL | PK. FK to [Properties](./properties.md). The property, stamped from the Search Console property parameter. Key column together with search_type and the dimensions. |
| `search_type` | STRING | Search Type | PK. Search type the row belongs to (web, image, video, news, discover, googleNews), stamped from the Search type parameter. |
| `date` | DATE | Date | PK. Day in Pacific Time, as Search Console reports it. |
| `clicks` | INTEGER | Clicks | Clicks from Google Search results to the property for this row. |
| `impressions` | INTEGER | Impressions | Times a result for the property was shown to a user (an impression counts once a result is on a page the user viewed, scrolling not required). |
| `ctr` | FLOAT | CTR | clicks / impressions for the row, 0 to 1. Never average this column; recompute SUM(clicks)/SUM(impressions) in SQL. |
| `position` | FLOAT | Position | Average top position of the property's results in this row, 1 = first. Weight by impressions in SQL: SUM(position*impressions)/SUM(impressions). |

# Example Questions

- Is organic traffic down because impressions fell, position worsened or CTR dropped, week over week?
- What were the property's clicks and impressions for each of the last 16 months, before the bulk export existed?

## Joins

- [Properties](./properties.md) — `site_url = site_url` [N:1] — Every performance table carries the property.
