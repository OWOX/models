---
title: "Performance by query"
description: |
  Daily clicks, impressions, CTR and position per search query, paged at 25,000 rows so the long tail Google exposes is loaded, not the 1,000 rows the interface exports. Google omits rare and privacy-filtered queries, so the table sums below the day total.
tags: ["owox", "connector", "google-search-console"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.google.com/webmaster-tools/v1/searchanalytics/query"
    title: "Google Search Console API reference — Performance by query"
---

## Connector endpoint

- **Endpoint:** Google Search Console · `performance_by_query`
- **Default destination table:** `search_console_by_query`
- **Manifest version:** 1.0
- **Unique keys:** `site_url`, `search_type`, `date`, `query`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ctr` | FLOAT | CTR | clicks / impressions for the row, 0 to 1. Never average this column; recompute SUM(clicks)/SUM(impressions) in SQL. |
| `date` | DATE | Date | PK. Day in Pacific Time, as Search Console reports it. FK to [Performance by date](./performance-by-date.md) |
| `query` | STRING | Query | PK. The search query the user typed. Google omits rare and privacy-filtered queries, so SUM(clicks) here is below the by_date total. |
| `clicks` | INTEGER | Clicks | Clicks from Google Search results to the property for this row. |
| `position` | FLOAT | Position | Average top position of the property's results in this row, 1 = first. Weight by impressions in SQL: SUM(position*impressions)/SUM(impressions). |
| `site_url` | STRING | Site URL | PK. The property, stamped from the Search Console property parameter. Key column together with search_type and the dimensions. FK to [Properties](./properties.md) |
| `impressions` | INTEGER | Impressions | Times a result for the property was shown to a user (an impression counts once a result is on a page the user viewed, scrolling not required). |
| `search_type` | STRING | Search Type | PK. Search type the row belongs to (web, image, video, news, discover, googleNews), stamped from the Search type parameter. FK to [Performance by date](./performance-by-date.md) |

# Example Questions

- Which queries sit on page two (position 11 to 20) with the most impressions, the quick wins?
- Which queries lost the most clicks this month against last?
- How much of the day's clicks is in queries Google reports, versus the day total (the anonymised share)?

## Joins

- [Properties](./properties.md) — `site_url = site_url` [N:1] — The property the rows were read for.
- [Performance by date](./performance-by-date.md) — `site_url = site_url` AND `search_type = search_type` AND `date = date` [N:1] — Same site_url and search_type: the day's queries roll up to the day total, minus the anonymised share.
  - [Performance by date Properties](./properties.md)
