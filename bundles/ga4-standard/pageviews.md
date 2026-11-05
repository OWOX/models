---
title: "Pageviews"
description: |
  Every GA4 `page_view` event, one row each, tied to the session it fell in. Other events
  are in Events. The table carries no page path: the landing page is on Sessions. Join to
  Sessions on `date` and `pseudo_session_id` together, because the session number restarts
  every day. `hitId` identifies a page view: a rerun of the same window gives the same
  value, a different window does not, and Events numbers its hits separately, so one value
  can appear in both. `time` is a timestamp in microseconds. `eventTrafficSourceHash`
  points at the source GA4 records on this one page view (UTM tags or GA4's own
  attribution); most carry none.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 04 · [04_pageviews.sql](./references/sql-transformation/04_pageviews.sql)
- **Destination table:** `pageviews`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day of the page view's session. |
| `pseudo_session_id` | STRING | Session Key | The session the page view belongs to: the GA4 pseudo user ID plus the session's number on that day. Join to Sessions on this and `date` together. FK to [Sessions](./sessions.md) |
| `hitId` | STRING | Hit ID | PK. MD5 of the pseudo user ID, the event timestamp and the page view's order for that user. Stable for a rerun of the same window, not across different windows. |
| `time` | INTEGER | Page View Time | Timestamp of the page view, in microseconds since 1970-01-01 UTC. |
| `pageviews` | INTEGER | Pageviews | Always 1. Sum it to count page views. |
| `event_name` | STRING | Event Name | Always `page_view`. |
| `eventTrafficSourceHash` | STRING | Event Traffic Source Hash | FARM_FINGERPRINT of the source, medium, campaign, term and content GA4 records on this page view. A page view with none of them has the hash of empty values. FK to [Event Traffic Sources](./event-traffic-sources.md) |

# Example Questions

- How many page views do `sessions` from each campaign generate?
- How do daily page views on mobile compare with desktop?
- At what hour of the day are page views highest?

## Joins

- [Sessions](./sessions.md) — `date = date` AND `pseudo_session_id = pseudo_sessionId` [N:1] — The session the page view fell in.
  - [Session Device](./devices.md) — The device the page view's session ran on.
  - [Session Geo](./geo.md) — Where the page view's session came from.
  - [Session Traffic Source](./traffic-sources.md) — The source and campaign of the page view's session, not the tags on the page view itself.
  - [Session User Traffic Source](./user-traffic-sources.md) — How the user who viewed the page was first acquired.
  - [Session User](./users.md) — The browser or app instance that viewed the page.
- [Event Traffic Sources](./event-traffic-sources.md) — `eventTrafficSourceHash = eventTrafficSourceHash` [N:1] — The traffic source recorded on this one page view; the hash repeats across runs.
