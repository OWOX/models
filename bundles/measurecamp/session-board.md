---
title: "Session Board"
description: |
  The grid each edition is built around: one board per event, defined by how many rooms and
  how many session-length time slots the organisers put up. A board is a matrix — rooms on
  one axis, time slots on the other — and attendees fill it on the morning of the event by
  placing session cards on it. The three numbers here are static parameters set when the
  board is laid out, not counts of what happened: they are the capacity of the grid, so
  rooms times session slots is how many sessions the day *could* hold. Comparing that to the
  sessions actually placed is the standard post-event question — how full was the board —
  and the usual answer is that a handful of slots stay empty.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `session_board_id` | STRING | Session Board ID | PK. Unique session board identifier. |
| `event_id` | STRING | Event ID | The edition this board belongs to — exactly one board per event. FK to [Event](./event.md) |
| `number_of_rooms` | INTEGER | Number of Rooms | Rooms the organisers put on the board. A static parameter of the layout, not a count of the rooms that ended up being used — organisers routinely plan one room fewer than they need. |
| `number_of_session_slots` | INTEGER | Number of Session Slots | Time slots reserved for sessions, excluding breaks and lunch. Static. `number_of_rooms * number_of_session_slots` is how many sessions the day can hold — the denominator for any "how full was the board" question. |
| `session_length_minutes` | INTEGER | Session Length (min) | How long one session runs on this board — traditionally 30 minutes, 25 at some editions. Set per board, so it is the same for every session on it. |

# Example Questions

- How full did each board get — what share of the potential slots (`rooms` times session slots) carried an actual `session`?
- Do bigger boards fill as well as small ones, or does adding rooms mostly add empty slots?
- Do editions with 25-minute sessions fit more `sessions` into the day than those with 30-minute ones, and does the board fill up the same?

## Joins

- [Event](./event.md) — `event_id = event_id` [1:1] — The edition this board lays out — one board per event.
  - [Event City](./city.md) — The city this board's edition was held in.
