---
title: "Bot Requests by Page"
description: |
  Requests from bots and AI crawlers to one host, seen at Cloudflare's edge: one row per UTC hour, page path, method, user agent, status,
  content type and verified-bot category, with no IP addresses. `row_key` joins those values and is the key.
  Which requests: user agents that name a bot (bot, crawl, spider, -User, Google, meta-external, Bytespider and similar) plus every request
  Cloudflare itself verified as a bot; browser-looking bots that hide their name are not here. `verified_bot_category` is Cloudflare's own
  verification, and an empty value means unverified: spoofed, unknown or not on Cloudflare's list. For page fetches, keep status 200 and
  content type html or md; redirects, 404s and assets are here too. The dataset is sampled: where `sample_interval` is above 1,
  `requests` is an estimate, close in totals and noisy for single rare pages.
tags: ["owox", "connector", "cloudflare-analytics"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.cloudflare.com/analytics/graphql-api/"
    title: "Cloudflare GraphQL Analytics API reference — Bot Requests by Page"
---

## Connector endpoint

- **Endpoint:** Cloudflare Analytics · `bot_requests`
- **Default destination table:** `cloudflare_bot_requests`
- **Manifest version:** 1.0
- **Unique keys:** `row_key`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | UTC day the row counts. FK to [Daily by Status](./daily-by-status.md) |
| `host` | STRING | Host | Host the bot requests were sent to: the connector's Host parameter, one host per load. |
| `hour` | DATETIME | Hour | Start of the UTC hour. FK to [Hourly Traffic](./hourly-traffic.md) |
| `path` | STRING | Path | Request path without the query string. |
| `method` | STRING | Method | HTTP method of the request, e.g. GET or HEAD. |
| `status` | INTEGER | Status | HTTP status Cloudflare returned. FK to [Daily by Status](./daily-by-status.md) |
| `row_key` | STRING | Row Key | PK. Hour\|host\|method\|path\|status\|content type\|verified category\|user agent. Unique per row. A re-run of a loaded day overwrites only the keys that come back, so delete the day's rows before reloading it. |
| `requests` | INTEGER | Requests | Requests. An estimate when sample_interval > 1. |
| `user_agent` | STRING | User Agent | User agent string the bot sent; the bot's claimed name, which only verified_bot_category confirms. |
| `content_type` | STRING | Content Type | html, md, empty (redirects), js, css, gif… |
| `sample_interval` | FLOAT | Sample Interval | Cloudflare adaptive sampling: 1 = every request counted; above 1, requests is scaled up from a sample. Delete a loaded day's rows before reloading it: rows of the first load whose keys do not come back stay, and the day is counted twice. |
| `verified_bot_category` | STRING | Verified Bot Category | Cloudflare's verified-bot category, e.g. AI Crawler, AI Search, AI Assistant, Search Engine Crawler. Empty when Cloudflare did not verify the bot: spoofed, unknown, or not on Cloudflare's list. |

# Example Questions

- Which pages did verified AI crawlers fetch most last week, and which crawler read each one?
- How many requests come from user agents that claim a known bot name but that Cloudflare did not verify?
- Which missing pages do crawlers keep requesting?

## Joins

- [Hourly Traffic](./hourly-traffic.md) — `hour = hour` [N:1] — The whole zone's traffic in the hour the bot request fell in.
  - [Hour Day Totals](./daily-traffic.md) — The whole zone's exact totals for the day of the bot request, people and bots together.
- [Daily by Status](./daily-by-status.md) — `date = date` AND `status = status` [N:1] — All of the zone's responses with the same status that day, bots and people.
  - [Status Day Totals](./daily-traffic.md) — The same zone day totals as Hour Day Totals, reached through Daily by Status; use one, not both.
