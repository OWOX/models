---
title: "Daily Traffic"
description: |
  The zone's exact daily totals from Cloudflare's daily rollup: requests, page views, unique client IPs, bytes, cached requests and bytes,
  threats and encrypted requests. One row per UTC day, all hosts of the zone, people and bots together; not sampled. The reference every
  daily split sums back to.
tags: ["owox", "connector", "cloudflare-analytics"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.cloudflare.com/analytics/graphql-api/"
    title: "Cloudflare GraphQL Analytics API reference — Daily Traffic"
---

## Connector endpoint

- **Endpoint:** Cloudflare Analytics · `daily_traffic`
- **Default destination table:** `cloudflare_daily_traffic`
- **Manifest version:** 1.0
- **Unique keys:** `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. UTC day the row counts. |
| `bytes` | INTEGER | Bytes | Bytes Cloudflare sent to clients for the zone that day. |
| `threats` | INTEGER | Threats | Requests Cloudflare counted as threats that day. |
| `uniques` | INTEGER | Unique IPs | Unique client IPs that day. |
| `requests` | INTEGER | Requests | Requests Cloudflare served for the zone that day, people and bots together. |
| `page_views` | INTEGER | Page Views | Cloudflare page views: successful HTML responses, bots included. |
| `cached_bytes` | INTEGER | Cached Bytes | Bytes served from Cloudflare's cache that day. |
| `cached_requests` | INTEGER | Cached Requests | Requests served from Cloudflare's cache that day. |
| `encrypted_requests` | INTEGER | Encrypted Requests | Requests that day sent over an encrypted (HTTPS) connection. |

# Example Questions

- How did requests, page views and unique IPs change week over week?
- What share of requests and bytes does the cache serve each day?
