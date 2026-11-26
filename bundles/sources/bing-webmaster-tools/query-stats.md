---
title: "Query Stats"
description: |
  Bing's top search queries for the site by week, from GetQueryStats: impressions, clicks and average positions. One row per week and query.
  Top queries only, not the full query set. Rows are kept across runs and Bing's list for a week can differ from one call to the next,
  so a week can hold slightly more queries than one call returns.
tags: ["owox", "connector", "bing-webmaster-tools"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/bingwebmaster/getting-access"
    title: "Bing Webmaster API reference — Query Stats"
---

## Connector endpoint

- **Endpoint:** Bing Webmaster Tools · `query_stats`
- **Default destination table:** `bing_query_stats`
- **Manifest version:** 1.0
- **Unique keys:** `date_raw`, `query`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | Week date (UTC), parsed from Bing's /Date(epoch ms)/. |
| `query` | STRING | Query | PK. The search query, as Bing reports it in its top-queries list for the week. |
| `clicks` | INTEGER | Clicks | Clicks from Bing search results to the site in the period of the row. |
| `date_raw` | STRING | Date (Bing Raw) | PK. Week date as Bing returns it, /Date(epoch ms)/ in UTC. Part of the primary key. |
| `impressions` | INTEGER | Impressions | Times Bing showed the site in search results in the period of the row. |
| `avg_click_position` | FLOAT | Average Click Position | Average position of the result when it was clicked; -1 when Bing does not report it, even on rows with clicks. |
| `avg_impression_position` | FLOAT | Average Impression Position | Average position at which Bing showed the result in the period of the row; 1 is the top. |

# Example Questions

- Which queries brought the most Bing clicks last month, and at what average position?
- Which queries sit just below the top results with many impressions and few clicks?
- Which queries entered or left Bing's top list in the last four weeks?
