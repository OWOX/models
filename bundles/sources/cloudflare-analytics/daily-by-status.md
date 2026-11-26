---
title: "Daily by Status"
description: |
  The zone's exact daily requests by HTTP status code, from the daily rollup. One row per UTC day and status; the statuses of a day sum
  to its requests in [Daily Traffic](./daily-traffic.md).
tags: ["owox", "connector", "cloudflare-analytics"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.cloudflare.com/analytics/graphql-api/"
    title: "Cloudflare GraphQL Analytics API reference — Daily by Status"
---

## Connector endpoint

- **Endpoint:** Cloudflare Analytics · `daily_by_status`
- **Default destination table:** `cloudflare_daily_by_status`
- **Manifest version:** 1.0
- **Unique keys:** `date`, `status`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. UTC day the row counts. FK to [Daily Traffic](./daily-traffic.md) |
| `status` | INTEGER | Status | PK. HTTP status Cloudflare returned. |
| `requests` | INTEGER | Requests | Requests Cloudflare served in the row's period and split, people and bots together. |

# Example Questions

- How many 404 and 5xx responses did the zone return per day, and is the share growing?
- What share of requests are redirects?

## Joins

- [Daily Traffic](./daily-traffic.md) — `date = date` [N:1] — The day total the status split comes from.
