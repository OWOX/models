---
title: "Sessions"
description: |
  One row per session of the GA 360 export, with its landing page, engagement, purchases
  and the keys to its location, device, traffic source and user. A row is identified by
  `date` together with `sessionId`; page views, events and purchases join on both.
  `visitStartTime` is in seconds since 1970, and `timeOnSite` is in whole seconds with the
  fraction cut off, so a one-hit session shows 0. Purchases are deduplicated the same way
  as in Transactions. `transactionRevenue` is in millionths, as Google's export stores it:
  divide by 1,000,000. `cost`, `impressions` and `clicks` are always 0, slots for ad cost
  blended in later.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 03 · [03_sessions.sql](./references/sql-transformation/03_sessions.sql)
- **Destination table:** `sessions`
- **Write mode:** Append
- **Built from:** the GA 360 export (`ga_sessions_*`), and `_temp_transactions` (staging) for purchases, including the `{{tdw}}` days before the window

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day of the export table the session was read from, in the property's time zone. |
| `sessionId` | STRING | Session ID | PK. The full visitor ID and the visit ID, joined by `_`. Pair it with `date`: page views, events and purchases join on both. |
| `landingPage` | STRING | Landing Page | Path of the session's first hit marked as an entrance, or of its first hit when none is, cut at the first `?`, `#` or `;`. |
| `landingHost` | STRING | Landing Host | Host name of the same hit as `landingPage`. |
| `visitStartTime` | INTEGER | Session Start Time | When the session started, in seconds since 1970-01-01 UTC, as the export records it. |
| `visitNumber` | INTEGER | Session Number | The visitor's session count as Google Analytics reports it: 1 for a first visit. |
| `touchpoint` | STRING | Touchpoint | Always `WEB`. |
| `dataSource` | STRING | Data Source | The export the session was read from, as `project.dataset.ga_sessions_*`. |
| `hits` | INTEGER | Hits | All hits in the session as the export counts them (`totals.hits`), hit types other than page views and events included. |
| `pageviews` | INTEGER | Pageviews | Number of page view hits in the session. |
| `events` | INTEGER | Events | Number of event hits in the session. |
| `bounces` | INTEGER | Bounces | 1 when the session has at most one hit that is a page view or an interactive event, otherwise 0. |
| `timeOnSite` | INTEGER | Time on Site (seconds) | Time from the session's first hit to its last, in whole seconds with the fraction cut off. 0 for a session with one hit. |
| `userHash` | STRING | User Hash | FARM_FINGERPRINT of the session's client ID; the other user identifiers are empty. When the export has no client ID, every session has the same hash. FK to [Users](./users.md) |
| `geoHash` | STRING | Geo Hash | FARM_FINGERPRINT of the session's country, region and city. FK to [Geo](./geo.md) |
| `deviceHash` | STRING | Device Hash | FARM_FINGERPRINT of the session's device category, browser and version, operating system and version. FK to [Devices](./devices.md) |
| `trafficSourceHash` | STRING | Traffic Source Hash | FARM_FINGERPRINT of the session's source, medium, campaign, keyword and ad content. FK to [Traffic Sources](./traffic-sources.md) |
| `transactions` | INTEGER | Purchases | Purchases in the session, deduplicated by transaction ID the same way as in Transactions. 0 when none. |
| `transactionRevenue` | FLOAT | Purchase Revenue (millionths) | Revenue of those purchases, multiplied by 1,000,000 as Google's export stores it; divide by 1,000,000 for the amount. 0 when none. |
| `impressions` | INTEGER | Impressions | Always 0. A slot for ad impressions blended in later. |
| `clicks` | INTEGER | Clicks | Always 0. A slot for ad clicks blended in later. |
| `cost` | FLOAT | Cost | Always 0. A slot for ad cost blended in later. |

# Example Questions

- Which sources and campaigns bring the sessions with the lowest bounce rate?
- Which landing pages bring the most purchase revenue on mobile?
- How does revenue per session differ between first visits and returning ones?

## Joins

- [Geo](./geo.md) — `geoHash = geoHash` [N:1] — Where the session came from; the hash repeats across runs.
- [Devices](./devices.md) — `deviceHash = deviceHash` [N:1] — The device the session ran on; the hash repeats across runs.
- [Traffic Sources](./traffic-sources.md) — `trafficSourceHash = trafficSourceHash` [N:1] — The session's source and campaign; the hash repeats across runs.
- [Users](./users.md) — `userHash = userHash` [N:1] — The browser behind the session, by client ID; one shared hash when the export has none.
