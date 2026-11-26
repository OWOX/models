---
title: "Site Daily"
description: |
  Daily clicks and impressions of the whole site in Bing, across every Bing vertical, from GetRankAndTrafficStats. One row per UTC day.
  The only daily series and the only complete one: it counts Copilot answers and other verticals together with web search, so it is
  not a measure of AI visibility and never compares one to one with the weekly top-query and top-page tables.
tags: ["owox", "connector", "bing-webmaster-tools"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/bingwebmaster/getting-access"
    title: "Bing Webmaster API reference — Site Daily"
---

## Connector endpoint

- **Endpoint:** Bing Webmaster Tools · `site_daily`
- **Default destination table:** `bing_site_daily`
- **Manifest version:** 1.0
- **Unique keys:** `date_raw`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | Day (UTC), parsed from Bing's /Date(epoch ms)/. |
| `clicks` | INTEGER | Clicks | Clicks from Bing to the site that day, all Bing verticals together. |
| `date_raw` | STRING | Date (Bing Raw) | PK. Day as Bing returns it, /Date(epoch ms)/ at 00:00 UTC. Part of the primary key. |
| `impressions` | INTEGER | Impressions | Times Bing showed the site that day, all Bing verticals together. |

# Example Questions

- How did the site's Bing clicks and impressions change month over month?
- On which days did Bing impressions jump or drop, and did clicks follow?
