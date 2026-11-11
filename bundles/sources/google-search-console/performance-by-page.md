---
title: "Performance by page"
description: |
  Daily clicks, impressions, CTR and position per landing URL (the final URL after redirects). The table to join to sessions, leads or publish dates in the data warehouse by page URL.
tags: ["owox", "connector", "google-search-console"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.google.com/webmaster-tools/v1/searchanalytics/query"
    title: "Google Search Console API reference — Performance by page"
---

## Connector endpoint

- **Endpoint:** Google Search Console · `performance_by_page`
- **Default destination table:** `search_console_by_page`
- **Manifest version:** 1.0
- **Unique keys:** `site_url`, `search_type`, `date`, `page`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ctr` | FLOAT | CTR | clicks / impressions for the row, 0 to 1. Never average this column; recompute SUM(clicks)/SUM(impressions) in SQL. |
| `date` | DATE | Date | PK. Day in Pacific Time, as Search Console reports it. FK to [Performance by date](./performance-by-date.md) |
| `page` | STRING | Page | PK. The final URL Google linked to, after redirects, as Search Console records it. |
| `clicks` | INTEGER | Clicks | Clicks from Google Search results to the property for this row. |
| `position` | FLOAT | Position | Average top position of the property's results in this row, 1 = first. Weight by impressions in SQL: SUM(position*impressions)/SUM(impressions). |
| `site_url` | STRING | Site URL | PK. The property, stamped from the Search Console property parameter. Key column together with search_type and the dimensions. FK to [Properties](./properties.md) |
| `impressions` | INTEGER | Impressions | Times a result for the property was shown to a user (an impression counts once a result is on a page the user viewed, scrolling not required). |
| `search_type` | STRING | Search Type | PK. Search type the row belongs to (web, image, video, news, discover, googleNews), stamped from the Search type parameter. FK to [Performance by date](./performance-by-date.md) |

# Example Questions

- Which pages lost or gained the most clicks this month against last?
- Did a rewritten article's clicks and position move after its publish date?

## Joins

- [Properties](./properties.md) — `site_url = site_url` [N:1] — The property the rows were read for.
- [Performance by date](./performance-by-date.md) — `site_url = site_url` AND `search_type = search_type` AND `date = date` [N:1] — Same site_url and search_type; Google counts impressions per page, so page impressions can exceed the day total.
  - [Performance by date Properties](./properties.md)
