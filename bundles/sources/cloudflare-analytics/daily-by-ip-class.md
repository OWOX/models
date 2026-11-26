---
title: "Daily by IP Class"
description: |
  The zone's exact daily requests by Cloudflare's IP class: searchEngine, badHost, tor, allowlist, monitoringService, unknown and others.
  One row per UTC day and IP class.
tags: ["owox", "connector", "cloudflare-analytics"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.cloudflare.com/analytics/graphql-api/"
    title: "Cloudflare GraphQL Analytics API reference — Daily by IP Class"
---

## Connector endpoint

- **Endpoint:** Cloudflare Analytics · `daily_by_ip_class`
- **Default destination table:** `cloudflare_daily_by_ip_class`
- **Manifest version:** 1.0
- **Unique keys:** `date`, `ip_class`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. UTC day the row counts. FK to [Daily Traffic](./daily-traffic.md) |
| `ip_class` | STRING | IP Class | PK. Cloudflare's class of the client IP, e.g. searchEngine, badHost, tor, monitoringService, unknown. |
| `requests` | INTEGER | Requests | Requests Cloudflare served in the row's period and split, people and bots together. |

# Example Questions

- How many requests a day come from search-engine IPs, and how many from bad hosts or Tor?
- Is monitoring traffic a visible share of requests?

## Joins

- [Daily Traffic](./daily-traffic.md) — `date = date` [N:1] — The day total the IP-class split comes from.
