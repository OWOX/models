---
title: "Performance by query and page"
description: |
  Daily clicks, impressions, CTR and position for every query and landing page pair: which URL Google showed for which query. The largest table and the one that answers cannibalisation questions.
tags: ["owox", "connector", "google-search-console"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developers.google.com/webmaster-tools/v1/searchanalytics/query"
    title: "OWOX Data Marts — Google Search Console custom connector (GoogleSearchConsole, 8 nodes) on the Search Console API v1"
  - id: "vendor-reference"
    resource: "https://developers.google.com/webmaster-tools/v1/searchanalytics/query"
    title: "Google Search Console API reference — Performance by query and page"
---

## Connector endpoint

- **Endpoint:** Google Search Console · `performance_by_query_page`
- **Default destination table:** `search_console_by_query_page`
- **Unique keys:** `site_url`, `search_type`, `date`, `query`, `page`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `site_url` | STRING | Site URL | PK. FK to [Properties](./properties.md). The property, stamped from the Search Console property parameter. Key column together with search_type and the dimensions. |
| `search_type` | STRING | Search Type | PK. Search type the row belongs to (web, image, video, news, discover, googleNews), stamped from the Search type parameter. |
| `date` | DATE | Date | PK. Day in Pacific Time, as Search Console reports it. |
| `query` | STRING | Query | PK. FK to [Performance by query](./performance-by-query.md). The search query the user typed. Google omits rare and privacy-filtered queries, so SUM(clicks) here is below the by_date total. |
| `page` | STRING | Page | PK. FK to [Performance by page](./performance-by-page.md). The final URL Google linked to, after redirects, as Search Console records it. |
| `clicks` | INTEGER | Clicks | Clicks from Google Search results to the property for this row. |
| `impressions` | INTEGER | Impressions | Times a result for the property was shown to a user (an impression counts once a result is on a page the user viewed, scrolling not required). |
| `ctr` | FLOAT | CTR | clicks / impressions for the row, 0 to 1. Never average this column; recompute SUM(clicks)/SUM(impressions) in SQL. |
| `position` | FLOAT | Position | Average top position of the property's results in this row, 1 = first. Weight by impressions in SQL: SUM(position*impressions)/SUM(impressions). |

# Example Questions

- Which of our pages compete for the same query, and which one did Google show most?
- For a query that lost clicks, did Google switch the page it shows?

## Joins

- [Properties](./properties.md) — `site_url = site_url` [N:1]
- [Performance by query](./performance-by-query.md) — `site_url = site_url`, `search_type = search_type`, `date = date`, `query = query` [N:1] — Same site_url, search_type and date: the pages Google showed for one query on one day.
- [Performance by page](./performance-by-page.md) — `site_url = site_url`, `search_type = search_type`, `date = date`, `page = page` [N:1] — Same site_url, search_type and date: the queries one page was shown for on one day.
