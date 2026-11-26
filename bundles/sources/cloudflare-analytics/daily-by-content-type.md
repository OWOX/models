---
title: "Daily by Content Type"
description: |
  The zone's exact daily requests and bytes by response content type: html, md, js, css, images, and empty for redirects. One row per UTC
  day and content type.
tags: ["owox", "connector", "cloudflare-analytics"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.cloudflare.com/analytics/graphql-api/"
    title: "Cloudflare GraphQL Analytics API reference — Daily by Content Type"
---

## Connector endpoint

- **Endpoint:** Cloudflare Analytics · `daily_by_content_type`
- **Default destination table:** `cloudflare_daily_by_content_type`
- **Manifest version:** 1.0
- **Unique keys:** `date`, `content_type`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. UTC day the row counts. FK to [Daily Traffic](./daily-traffic.md) |
| `bytes` | INTEGER | Bytes | Bytes Cloudflare sent to clients in the row's period and split. |
| `requests` | INTEGER | Requests | Requests Cloudflare served in the row's period and split, people and bots together. |
| `content_type` | STRING | Content Type | PK. Content type of the response as Cloudflare names it: html, md, js, css, gif, empty for redirects. |

# Example Questions

- How many HTML and Markdown pages does the zone serve a day, against assets?
- Which content types carry most of the bytes?

## Joins

- [Daily Traffic](./daily-traffic.md) — `date = date` [N:1] — The day total the content-type split comes from.
