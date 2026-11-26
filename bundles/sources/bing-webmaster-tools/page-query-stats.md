---
title: "Page Query Stats"
description: |
  The queries of each top page by week, from GetPageQueryStats: impressions, clicks and average positions per page and query. One row per
  week, page and query. The connector reads the page list from GetPageStats and calls Bing once per page, so it is the largest and
  slowest table, and it covers only pages that were in Bing's top-pages list.
tags: ["owox", "connector", "bing-webmaster-tools"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/bingwebmaster/getting-access"
    title: "Bing Webmaster API reference — Page Query Stats"
---

## Connector endpoint

- **Endpoint:** Bing Webmaster Tools · `page_query_stats`
- **Default destination table:** `bing_page_query_stats`
- **Manifest version:** 1.0
- **Unique keys:** `date_raw`, `page`, `query`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | Week date (UTC), parsed from Bing's /Date(epoch ms)/. |
| `page` | STRING | Page | PK. Page URL the queries belong to: one of the pages GetPageStats lists, which the connector asks Bing about one by one. FK to [Page Stats](./page-stats.md) |
| `query` | STRING | Query | PK. The search query, as Bing reports it. FK to [Query Stats](./query-stats.md) |
| `clicks` | INTEGER | Clicks | Clicks from Bing search results to the site in the period of the row. |
| `date_raw` | STRING | Date (Bing Raw) | PK. Week date as Bing returns it, /Date(epoch ms)/ in UTC. Part of the primary key. FK to [Page Stats](./page-stats.md) |
| `impressions` | INTEGER | Impressions | Times Bing showed the site in search results in the period of the row. |
| `avg_click_position` | FLOAT | Average Click Position | Average position of the result when it was clicked; -1 when Bing does not report it, even on rows with clicks. |
| `avg_impression_position` | FLOAT | Average Impression Position | Average position at which Bing showed the result in the period of the row; 1 is the top. |

# Example Questions

- For a page that lost Bing clicks, which of its queries dropped?
- Which of our pages compete in Bing for the same query?
- Which queries bring each page most of its Bing impressions?

## Joins

- [Page Stats](./page-stats.md) — `date_raw = date_raw` AND `page = page` [N:1] — The page's own totals that week, when it made the week's top-pages list.
- [Query Stats](./query-stats.md) — `date_raw = date_raw` AND `query = query` [N:1] — The query's site-wide totals that week, when it made the week's top-queries list.
