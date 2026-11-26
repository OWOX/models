---
title: "Daily by Country"
description: |
  The zone's exact daily requests, bytes and threats by client country. One row per UTC day and country, people and bots together;
  the countries of a day sum to its totals in [Daily Traffic](./daily-traffic.md).
tags: ["owox", "connector", "cloudflare-analytics"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.cloudflare.com/analytics/graphql-api/"
    title: "Cloudflare GraphQL Analytics API reference — Daily by Country"
---

## Connector endpoint

- **Endpoint:** Cloudflare Analytics · `daily_by_country`
- **Default destination table:** `cloudflare_daily_by_country`
- **Manifest version:** 1.0
- **Unique keys:** `date`, `country`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. UTC day the row counts. FK to [Daily Traffic](./daily-traffic.md) |
| `bytes` | INTEGER | Bytes | Bytes Cloudflare sent to clients in the row's period and split. |
| `country` | STRING | Country | PK. Client country as Cloudflare reports it: a two-letter code; XX when unknown. |
| `threats` | INTEGER | Threats | Requests Cloudflare counted as threats in the row's period and split. |
| `requests` | INTEGER | Requests | Requests Cloudflare served in the row's period and split, people and bots together. |

# Example Questions

- Which countries send the most requests and the most threats?
- Did traffic from one country jump on a given day?

## Joins

- [Daily Traffic](./daily-traffic.md) — `date = date` [N:1] — The day total the country split comes from.
