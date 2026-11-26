---
title: "Security Events"
description: |
  Requests Cloudflare blocked, challenged or logged under a security rule: WAF managed rules, the browser integrity check, the security
  level and others. One row per event, keyed by its Ray ID, with the rule, action, host, path, user agent and country; client IPs are not
  loaded. From the adaptive dataset, so `sample_interval` above 1 means one row stands for several events.
tags: ["owox", "connector", "cloudflare-analytics"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.cloudflare.com/analytics/graphql-api/"
    title: "Cloudflare GraphQL Analytics API reference — Security Events"
---

## Connector endpoint

- **Endpoint:** Cloudflare Analytics · `security_events`
- **Default destination table:** `cloudflare_security_events`
- **Manifest version:** 1.0
- **Unique keys:** `ray_name`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | UTC day the row counts. FK to [Daily by Country](./daily-by-country.md) |
| `host` | STRING | Host | Host name the request was sent to. |
| `path` | STRING | Path | Request path without the query string. |
| `action` | STRING | Action | What Cloudflare did with the request, e.g. block, managed_challenge, js_challenge or log. |
| `method` | STRING | Method | HTTP method of the request. |
| `source` | STRING | Source | Which Cloudflare security feature acted, e.g. firewallManaged (WAF managed rules), bic (browser integrity check), securitylevel. |
| `status` | INTEGER | Status | HTTP status Cloudflare returned. |
| `country` | STRING | Country | Client country as Cloudflare reports it: a two-letter code; XX when unknown. FK to [Daily by Country](./daily-by-country.md) |
| `rule_id` | STRING | Rule ID | ID of the rule that fired; read it together with source. |
| `ray_name` | STRING | Ray ID | PK. Cloudflare Ray ID of the request. |
| `event_time` | DATETIME | Event Time | Time of the event (UTC). |
| `user_agent` | STRING | User Agent | User agent string the client sent. |
| `description` | STRING | Description | Cloudflare's description of the rule that fired. |
| `sample_interval` | FLOAT | Sample Interval | Cloudflare adaptive sampling: 1 = every event is a row; above 1, one row stands for that many events. |

# Example Questions

- Which rules block the most requests, and on which paths?
- Which countries do blocked requests come from, against all their traffic that day?
- Are challenges hitting real user agents on normal pages?

## Joins

- [Daily by Country](./daily-by-country.md) — `date = date` AND `country = country` [N:1] — All of the zone's traffic from the same country that day.
  - [Event Day Totals](./daily-traffic.md) — The whole zone's exact totals for the day of the event, all countries together.
