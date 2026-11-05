---
title: "Pageviews"
description: |
  Every page view hit of the GA 360 export, one row each, tied to the session it fell in.
  Join to Sessions on `date` and `sessionId` together, and to Pages on `pageHash` for the
  host, path and title: the table holds no page path itself. `hitId` identifies a page view:
  a rerun of the same window gives the same value, a different window does not, and Events
  numbers its hits separately. `time` is a timestamp in milliseconds since 1970-01-01 UTC;
  `date` is the day in the property's time zone.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 04 · [04_pageviews.sql](./references/sql-transformation/04_pageviews.sql)
- **Destination table:** `pageviews`
- **Write mode:** Append
- **Built from:** `_temp_objects` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day of the export table the page view was read from, in the property's time zone. |
| `sessionId` | STRING | Session ID | PK. The session the page view belongs to: the full visitor ID and the visit ID, joined by `_`. Join to Sessions on this and `date` together. FK to [Sessions](./sessions.md) |
| `hitId` | STRING | Hit ID | PK. MD5 of the session ID, the hit's time in the session and its order among the session's page views. Stable for a rerun of the same window, not across different windows. |
| `time` | INTEGER | Page View Time | Timestamp of the page view, in milliseconds since 1970-01-01 UTC: the session start plus the hit's offset. |
| `pageview` | INTEGER | Pageviews | Always 1. Sum it to count page views. |
| `pageHash` | STRING | Page Hash | FARM_FINGERPRINT of the page's host name, path and title. FK to [Pages](./pages.md) |

# Example Questions

- Which `pages` get the most views from mobile visitors?
- Which `pages` do visitors from organic search view most?
- At what hour of the day do page views peak?

## Joins

- [Sessions](./sessions.md) — `date = date` AND `sessionId = sessionId` [N:1] — The session the page view fell in.
  - [Session Device](./devices.md) — The device the page view's session ran on.
  - [Session Geo](./geo.md) — Where the page view's session came from.
  - [Session Traffic Source](./traffic-sources.md) — The source and campaign of the page view's session.
  - [Session User](./users.md) — The browser that viewed the page; one shared user when the export has no client ID.
- [Pages](./pages.md) — `pageHash = pageHash` [N:1] — The host, path and title of the page viewed; the hash repeats across runs.
