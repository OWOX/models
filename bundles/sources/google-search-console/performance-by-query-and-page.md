---
title: "Performance by query and page"
description: |
  Daily clicks, impressions, CTR and position for every query and landing page pair: which URL Google showed for which query. The largest table and the one that answers cannibalisation questions.
tags: ["owox", "connector", "google-search-console"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.google.com/webmaster-tools/v1/searchanalytics/query"
    title: "Google Search Console API reference — Performance by query and page"
---

## Connector endpoint

- **Endpoint:** Google Search Console · `performance_by_query_page`
- **Default destination table:** `search_console_by_query_page`
- **Manifest version:** 1.0
- **Unique keys:** `site_url`, `search_type`, `date`, `query`, `page`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ctr` | FLOAT | CTR | clicks / impressions for the row, 0 to 1. Never average this column; recompute SUM(clicks)/SUM(impressions) in SQL. |
| `date` | DATE | Date | PK. Day in Pacific Time, as Search Console reports it. FK to [Performance by query](./performance-by-query.md) |
| `page` | STRING | Page | PK. The final URL Google linked to, after redirects, as Search Console records it. FK to [Performance by page](./performance-by-page.md) |
| `query` | STRING | Query | PK. The search query the user typed. Google omits rare and privacy-filtered queries, so SUM(clicks) here is below the by_date total. FK to [Performance by query](./performance-by-query.md) |
| `clicks` | INTEGER | Clicks | Clicks from Google Search results to the property for this row. |
| `position` | FLOAT | Position | Average top position of the property's results in this row, 1 = first. Weight by impressions in SQL: SUM(position*impressions)/SUM(impressions). |
| `site_url` | STRING | Site URL | PK. The property, stamped from the Search Console property parameter. Key column together with search_type and the dimensions. FK to [Properties](./properties.md) |
| `impressions` | INTEGER | Impressions | Times a result for the property was shown to a user (an impression counts once a result is on a page the user viewed, scrolling not required). |
| `search_type` | STRING | Search Type | PK. Search type the row belongs to (web, image, video, news, discover, googleNews), stamped from the Search type parameter. FK to [Performance by query](./performance-by-query.md) |

# Example Questions

- Which of our pages compete for the same query, and which one did Google show most?
- For a query that lost clicks, did Google switch the page it shows?

## Joins

- [Properties](./properties.md) — `site_url = site_url` [N:1] — The property the rows were read for.
- [Performance by query](./performance-by-query.md) — `site_url = site_url` AND `search_type = search_type` AND `date = date` AND `query = query` [N:1] — Same site_url, search_type and date: the pages Google showed for one query on one day.
  - [Performance by query Performance by date](./performance-by-date.md)
    - [Performance by query Performance by date Properties](./properties.md)
  - [Performance by query Properties](./properties.md)
- [Performance by page](./performance-by-page.md) — `site_url = site_url` AND `search_type = search_type` AND `date = date` AND `page = page` [N:1] — Same site_url, search_type and date: the queries one page was shown for on one day.
  - [Performance by page Performance by date](./performance-by-date.md)
    - [Performance by page Performance by date Properties](./properties.md)
  - [Performance by page Properties](./properties.md)
