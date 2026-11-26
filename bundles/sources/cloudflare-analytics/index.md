---
title: "Cloudflare Analytics"
description: |
  What the OWOX Data Marts Cloudflare Analytics connector loads for one Cloudflare zone, the parts of the GraphQL Analytics API a Free plan exposes, and how the tables fit together.
  Two kinds of data, and they answer different questions.

  The rollups are exact. [Daily Traffic](./daily-traffic.md) is the zone total per UTC day: requests, page views, unique client IPs, bytes,
  cache and threats. [Hourly Traffic](./hourly-traffic.md) is the same per hour, and five tables split the day:
  [by status](./daily-by-status.md), [by browser](./daily-by-browser.md), [by country](./daily-by-country.md),
  [by IP class](./daily-by-ip-class.md) and [by content type](./daily-by-content-type.md). Each of them joins Daily Traffic on `date`.
  They count people and bots together, across every host of the zone.

  The request-level tables are sampled. [Bot Requests by Page](./bot-requests-by-page.md) holds the requests of bots and AI crawlers to one
  host by hour, page path, user agent, status and Cloudflare's verified-bot category, with no IP addresses. [Security Events](./security-events.md)
  holds what the WAF, the browser integrity check and other rules blocked or challenged, one row per event. Both come from Cloudflare's
  adaptive datasets: where `sample_interval` is above 1, a count is Cloudflare's scaled-up estimate.

  The API reads only a limited window back, set per plan and dataset, so the connector loads every completed UTC day once and updates rows
  by key; the tables become the only copy of older history. Do not reload a loaded day of a sampled table without deleting its rows first: rows of the first load whose keys do not come back stay, and the day is counted twice.

  Definitions follow the connector manifest Cloudflare Analytics v1.0 on the Cloudflare GraphQL Analytics API.
tags: ["owox", "index", "connector", "cloudflare-analytics"]
type: "index"
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Bot Requests by Page](./bot-requests-by-page.md) | 12 | Requests from bots and AI crawlers to one host, seen at Cloudflare's edge: one row per UTC hour, page path, method, user agent, status, content type and verified-bot category, with no IP addresses. |
| [Daily Traffic](./daily-traffic.md) | 9 | The zone's exact daily totals from Cloudflare's daily rollup: requests, page views, unique client IPs, bytes, cached requests and bytes, threats and encrypted requests. |
| [Daily by Browser](./daily-by-browser.md) | 3 | The zone's exact daily page views by browser family, as Cloudflare reads the user agent. |
| [Daily by Content Type](./daily-by-content-type.md) | 4 | The zone's exact daily requests and bytes by response content type: html, md, js, css, images, and empty for redirects. |
| [Daily by Country](./daily-by-country.md) | 5 | The zone's exact daily requests, bytes and threats by client country. |
| [Daily by IP Class](./daily-by-ip-class.md) | 3 | The zone's exact daily requests by Cloudflare's IP class: searchEngine, badHost, tor, allowlist, monitoringService, unknown and others. |
| [Daily by Status](./daily-by-status.md) | 3 | The zone's exact daily requests by HTTP status code, from the daily rollup. |
| [Hourly Traffic](./hourly-traffic.md) | 8 | The zone's exact hourly totals from Cloudflare's hourly rollup: requests, page views, unique client IPs, bytes, cached requests and threats. |
| [Security Events](./security-events.md) | 14 | Requests Cloudflare blocked, challenged or logged under a security rule: WAF managed rules, the browser integrity check, the security level and others. |

# Example Questions

- Which pages do AI crawlers read most, and which crawlers does Cloudflare verify and which only claim a bot name?
- Did 404s or `security events` grow this month, and from which countries and rules?
- What share of the zone's daily requests is served from cache, and how does it change by hour?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/cloudflare-analytics)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Cloudflare Analytics model diagram](../../res/screens/sources/cloudflare-analytics.svg)
