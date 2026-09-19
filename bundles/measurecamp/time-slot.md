---
title: "Time Slot"
description: |
  The other axis of the session board: the day cut into named slots. Not every slot is for
  sessions — the morning break, lunch, the afternoon break, the closing and the party are
  slots too, and they are what make the schedule readable as a day rather than a list of
  talks. Only the session-type slots can carry a session card, so the type is the filter
  that turns "slots in the day" into "slots a session could go in", and getting that wrong
  understates how full a board really was.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `time_slot_id` | STRING | Time Slot ID | PK. Unique time slot identifier. |
| `session_board_id` | STRING | Session Board ID | The board this slot is one row of. FK to [Session Board](./session-board.md) |
| `name` | STRING | Time Slot Name | What the slot is called on the board, e.g. `Session 1`. |
| `type` | STRING | Slot Type | `Session`, `Morning Break`, `Lunch`, `Afternoon Break`, `Closing` or `Party`. Only `Session` slots carry sessions — filter on this before counting slots against the sessions placed in them. |
| `start_time` | TIMESTAMP | Start Time | When the slot starts. |
| `end_time` | TIMESTAMP | End Time | When the slot ends. |

# Example Questions

- Which time slots fill up and which ones stay half empty — does the first slot of the day, or the one after lunch, lose out?
- How long is the session part of the day once breaks, lunch and the closing are set aside?
- Do the `sessions` in the last slot skew towards discussions rather than presentations?

## Joins

- [Session Board](./session-board.md) — `session_board_id = session_board_id` [N:1] — The board this slot is one row of.
  - [Session Board Event](./event.md) — The edition this slot belongs to.
    - [Session Board Event City](./city.md) — The city of the edition this slot belongs to.
