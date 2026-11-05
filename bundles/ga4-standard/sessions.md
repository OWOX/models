---
title: "Sessions"
description: |
  One row per session as this model cuts it, with its landing page, engagement, purchases
  and keys to its source, device, location and user. A new row starts at GA4's
  `session_start`, after 30 idle minutes in the runbook's setup, at midnight, and on every
  event that carries a source, medium or gclid. So rows can outnumber GA4's sessions several
  times; on Google's sample, about six times. Count sessions with the sum of `sessions`,
  which tracks GA4's count closely. A bounce rate built per row is not comparable to GA4's.
  A row is keyed by `date` and `pseudo_sessionId`. Times are in microseconds; `cost`,
  `impressions` and `clicks` are always 0. For deduplicated orders, use Transactions. Events
  without a `user_pseudo_id` are lost.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 02 · [02_sessions.sql](./references/sql-transformation/02_sessions.sql)
- **Destination table:** `sessions`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day of the session, from the export table it was read from. A visit that crosses midnight is two sessions. |
| `pseudo_sessionId` | STRING | Session Key | PK. The GA4 pseudo user ID plus the session's number for that user on that day. The number restarts every day, so pair it with `date`. Events, page views and purchases carry it as `pseudo_session_id`. |
| `sessionId` | STRING | GA4 Session Start ID | The GA4 pseudo user ID plus the timestamp of the `session_start` event that opened the session. Empty for a session the model split off mid-visit, after a pause or on an event that carries a source, medium or gclid. |
| `landingPage` | STRING | Landing Page | Path of the page the session started on, without host or query string. Empty when the session has no `session_start` event. |
| `landingHost` | STRING | Landing Host | Host name of the page the session started on. Empty when the session has no `session_start` event. |
| `touchpoint` | STRING | Platform | The GA4 platform the session's events came from: `WEB`, `IOS` or `ANDROID`. |
| `dataSource` | STRING | Data Source | The GA4 export the session was built from, as `project.dataset.events_`. |
| `visitStartTime` | INTEGER | Session Start Time | Timestamp of the session's first event, in microseconds since 1970-01-01 UTC. |
| `visitNumber` | INTEGER | Session Number | The user's visit count as GA4 reports it (`ga_session_number`): 1 for a first visit. |
| `sessions` | INTEGER | Sessions | 1 when the row opens with GA4's `session_start` event, 0 for a row the model split off mid-visit. Count sessions with its sum, which tracks GA4's session count closely; the row count can be several times higher. |
| `hits` | INTEGER | Hits | Number of events in the session, page views included. |
| `pageviews` | INTEGER | Pageviews | Number of `page_view` events in the session. |
| `events` | INTEGER | Events | Number of events other than `page_view` in the session. |
| `transactions` | INTEGER | Purchases | Distinct purchase IDs in the session. Not deduplicated across sessions, so the total can exceed the row count of Transactions. |
| `transactionRevenue` | FLOAT | Purchase Revenue | Revenue of the session's `purchase` events, in the currency the site reported. Not deduplicated across sessions. |
| `bounces` | INTEGER | Bounces | 1 when the row has no `user_engagement` event, otherwise 0. Set per row, and on Google's sample most rows hold a single event, so a bounce rate built on it is not comparable to GA4's. |
| `timeOnSite` | INTEGER | Time on Site (microseconds) | Time from the session's first event to its last, in microseconds; divide by 1,000,000 for seconds. 0 for a session with one event. |
| `cost` | FLOAT | Cost | Always 0. A slot for ad cost blended in later. |
| `impressions` | INTEGER | Impressions | Always 0. A slot for ad impressions blended in later. |
| `clicks` | INTEGER | Clicks | Always 0. A slot for ad clicks blended in later. |
| `userHash` | STRING | User Hash | FARM_FINGERPRINT of the user's identifiers, today the GA4 pseudo user ID alone. FK to [Users](./users.md) |
| `userTrafficSourceHash` | STRING | User Traffic Source Hash | FARM_FINGERPRINT of the source, medium and campaign the user was first acquired by. Matches `trafficSourceHash` in User Traffic Sources. FK to [User Traffic Sources](./user-traffic-sources.md) |
| `trafficSourceHash` | STRING | Traffic Source Hash | FARM_FINGERPRINT of the session's source, medium, campaign, keyword and ad content. FK to [Traffic Sources](./traffic-sources.md) |
| `deviceHash` | STRING | Device Hash | FARM_FINGERPRINT of the session's device category, operating system and version, browser and version. FK to [Devices](./devices.md) |
| `geoHash` | STRING | Geo Hash | FARM_FINGERPRINT of the session's country, region and city. FK to [Geo](./geo.md) |

# Example Questions

- Which landing pages start the most sessions?
- How does revenue per session differ between first visits and returning ones?
- How do daily sessions compare between the website and the mobile apps?

## Joins

- [Traffic Sources](./traffic-sources.md) — `trafficSourceHash = trafficSourceHash` [N:1] — The session's own source and campaign; the hash repeats across runs.
- [User Traffic Sources](./user-traffic-sources.md) — `userTrafficSourceHash = trafficSourceHash` [N:1] — How the user was first acquired; the hash repeats across runs.
- [Devices](./devices.md) — `deviceHash = deviceHash` [N:1] — The device the session ran on; the hash repeats across runs.
- [Geo](./geo.md) — `geoHash = geoHash` [N:1] — Where the session came from; the hash repeats across runs.
- [Users](./users.md) — `userHash = userHash` [N:1] — The browser or app instance behind the session; the hash repeats across runs.
