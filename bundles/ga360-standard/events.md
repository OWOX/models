---
title: "Events"
description: |
  Every event hit of the GA 360 export, one row each, tied to the session it fell in. Join
  to Sessions on `date` and `sessionId` together. Despite its name, `pageHash` holds the
  event hash: it joins Event Info, which carries the event's category, action and label.
  `hitId` identifies an event: a rerun of the same window gives the same value, a different
  window does not, and Pageviews numbers its hits separately. `time` is a timestamp in
  milliseconds since 1970-01-01 UTC; `date` is the day in the property's time zone.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 05 · [05_events.sql](./references/sql-transformation/05_events.sql)
- **Destination table:** `events`
- **Write mode:** Append
- **Built from:** `_temp_objects` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day of the export table the event was read from, in the property's time zone. |
| `sessionId` | STRING | Session ID | PK. The session the event belongs to: the full visitor ID and the visit ID, joined by `_`. Join to Sessions on this and `date` together. FK to [Sessions](./sessions.md) |
| `hitId` | STRING | Hit ID | PK. MD5 of the session ID, the hit's time in the session and its order among the session's events. Stable for a rerun of the same window, not across different windows. |
| `time` | INTEGER | Event Time | Timestamp of the event, in milliseconds since 1970-01-01 UTC: the session start plus the hit's offset. |
| `events` | INTEGER | Events | Always 1. Sum it to count events. |
| `pageHash` | STRING | Event Hash | Despite its name, the event hash: FARM_FINGERPRINT of the event's category, action and label. It joins `eventHash` in Event Info, not Pages. FK to [Event Info](./event-info.md) |

# Example Questions

- Which event categories and actions fire most often, week by week?
- Which campaigns bring the `sessions` with the most events?
- At what hour of the day does a given event action peak?

## Joins

- [Sessions](./sessions.md) — `date = date` AND `sessionId = sessionId` [N:1] — The session the event fell in.
  - [Session Device](./devices.md) — The device the event's session ran on.
  - [Session Geo](./geo.md) — Where the event's session came from.
  - [Session Traffic Source](./traffic-sources.md) — The source and campaign of the event's session.
  - [Session User](./users.md) — The browser that sent the event; one shared user when the export has no client ID.
- [Event Info](./event-info.md) — `pageHash = eventHash` [N:1] — The event's category, action and label; the hash repeats across runs.
