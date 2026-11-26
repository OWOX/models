---
title: "Page Stats"
description: |
  Bing's top pages of the site by week, from GetPageStats: impressions, clicks and average positions per page URL. One row per week and page.
  Top pages only; `page` is the full URL as Bing reports it, including subdomains. Bing has no per-page daily series, only these weeks.
tags: ["owox", "connector", "bing-webmaster-tools"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/bingwebmaster/getting-access"
    title: "Bing Webmaster API reference — Page Stats"
---

## Connector endpoint

- **Endpoint:** Bing Webmaster Tools · `page_stats`
- **Default destination table:** `bing_page_stats`
- **Manifest version:** 1.0
- **Unique keys:** `date_raw`, `page`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | Week date (UTC), parsed from Bing's /Date(epoch ms)/. |
| `page` | STRING | Page | PK. Page URL. Bing returns it in the field named Query. |
| `clicks` | INTEGER | Clicks | Clicks from Bing search results to the site in the period of the row. |
| `date_raw` | STRING | Date (Bing Raw) | PK. Week date as Bing returns it, /Date(epoch ms)/ in UTC. Part of the primary key. |
| `impressions` | INTEGER | Impressions | Times Bing showed the site in search results in the period of the row. |
| `avg_click_position` | FLOAT | Average Click Position | Average position of the result when it was clicked; -1 when Bing does not report it, even on rows with clicks. |
| `avg_impression_position` | FLOAT | Average Impression Position | Average position at which Bing showed the result in the period of the row; 1 is the top. |

# Example Questions

- Which pages gained or lost the most Bing clicks week over week?
- Which pages get Bing impressions but rank too low to be clicked?
