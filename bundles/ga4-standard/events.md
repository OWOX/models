---
title: "Events"
description: |
  Every GA4 event other than a page view, one row each, tied to the session it fell in.
  Page views are in Pageviews. Join to Sessions on `date` and `pseudo_session_id` together,
  because the session number restarts every day. `hitId` identifies an event: a rerun of the
  same window gives the same value, a different window does not, and Pageviews numbers its
  hits separately, so one value can appear in both. `time` is a timestamp in microseconds.
  `eventTrafficSourceHash` points at the source GA4 records on this one event (UTM tags or
  GA4's own attribution); most events carry none.
  The table holds no event parameters beyond the event name.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 03 · [03_events.sql](./references/sql-transformation/03_events.sql)
- **Destination table:** `events`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day of the event's session. |
| `pseudo_session_id` | STRING | Session Key | The session the event belongs to: the GA4 pseudo user ID plus the session's number on that day. Join to Sessions on this and `date` together. FK to [Sessions](./sessions.md) |
| `hitId` | STRING | Hit ID | PK. MD5 of the pseudo user ID, the event timestamp and the event's order for that user. Stable for a rerun of the same window, not across different windows. |
| `time` | INTEGER | Event Time | Timestamp of the event, in microseconds since 1970-01-01 UTC. |
| `events` | INTEGER | Events | Always 1. Sum it to count events. |
| `event_name` | STRING | Event Name | The GA4 event name, such as `add_to_cart`, `scroll` or `purchase`. Never `page_view`. |
| `eventTrafficSourceHash` | STRING | Event Traffic Source Hash | FARM_FINGERPRINT of the source, medium, campaign, term and content GA4 records on this event. An event with none of them has the hash of empty values. FK to [Event Traffic Sources](./event-traffic-sources.md) |

# Example Questions

- Which events fire most often, and how does that change week to week?
- Which campaigns bring the `sessions` with the most add-to-cart events?
- At what hour of the day do sign-ups peak?

## Joins

- [Sessions](./sessions.md) — `date = date` AND `pseudo_session_id = pseudo_sessionId` [N:1] — The session the event fell in.
  - [Session Device](./devices.md) — The device the event's session ran on.
  - [Session Geo](./geo.md) — Where the event's session came from.
  - [Session Traffic Source](./traffic-sources.md) — The source and campaign of the event's session, not the tags on the event itself.
  - [Session User Traffic Source](./user-traffic-sources.md) — How the user who triggered the event was first acquired.
  - [Session User](./users.md) — The browser or app instance that triggered the event.
- [Event Traffic Sources](./event-traffic-sources.md) — `eventTrafficSourceHash = eventTrafficSourceHash` [N:1] — The traffic source recorded on this one event; the hash repeats across runs.
