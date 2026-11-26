---
title: "Daily by Browser"
description: |
  The zone's exact daily page views by browser family, as Cloudflare reads the user agent. One row per UTC day and browser family.
  Bot families such as BingBot or AppleBot are browser families here too, so this is not a people-only split.
tags: ["owox", "connector", "cloudflare-analytics"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.cloudflare.com/analytics/graphql-api/"
    title: "Cloudflare GraphQL Analytics API reference — Daily by Browser"
---

## Connector endpoint

- **Endpoint:** Cloudflare Analytics · `daily_by_browser`
- **Default destination table:** `cloudflare_daily_by_browser`
- **Manifest version:** 1.0
- **Unique keys:** `date`, `browser_family`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. UTC day the row counts. FK to [Daily Traffic](./daily-traffic.md) |
| `page_views` | INTEGER | Page Views | Page views of that browser family that day. |
| `browser_family` | STRING | Browser Family | PK. Browser family Cloudflare derives from the user agent, e.g. Chrome, Safari, BingBot. |

# Example Questions

- Which browser families bring the most page views?
- How many page views a day come from bot families rather than browsers?

## Joins

- [Daily Traffic](./daily-traffic.md) — `date = date` [N:1] — The day total the browser split comes from.
