---
title: "Hourly Traffic"
description: |
  The zone's exact hourly totals from Cloudflare's hourly rollup: requests, page views, unique client IPs, bytes, cached requests and threats.
  One row per UTC hour, all hosts, people and bots together; not sampled. Unique IPs of different hours do not add up to the day's.
tags: ["owox", "connector", "cloudflare-analytics"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.cloudflare.com/analytics/graphql-api/"
    title: "Cloudflare GraphQL Analytics API reference — Hourly Traffic"
---

## Connector endpoint

- **Endpoint:** Cloudflare Analytics · `hourly_traffic`
- **Default destination table:** `cloudflare_hourly_traffic`
- **Manifest version:** 1.0
- **Unique keys:** `hour`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | UTC day the row counts. FK to [Daily Traffic](./daily-traffic.md) |
| `hour` | DATETIME | Hour | PK. Start of the UTC hour. |
| `bytes` | INTEGER | Bytes | Bytes Cloudflare sent to clients in the row's period and split. |
| `threats` | INTEGER | Threats | Requests Cloudflare counted as threats in the row's period and split. |
| `uniques` | INTEGER | Unique IPs | Unique client IPs in that hour; the same IP in two hours counts in both, so hours do not add up to the day. |
| `requests` | INTEGER | Requests | Requests Cloudflare served in the row's period and split, people and bots together. |
| `page_views` | INTEGER | Page Views | Cloudflare page views in the row's period: successful HTML responses, bots included. |
| `cached_requests` | INTEGER | Cached Requests | Requests Cloudflare served from its cache in the row's period. |

# Example Questions

- At which hours of the day does traffic peak, and does the cache keep up?
- Which hours had a burst of threats?

## Joins

- [Daily Traffic](./daily-traffic.md) — `date = date` [N:1] — The day the hour belongs to.
