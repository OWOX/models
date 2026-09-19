---
title: "Session"
description: |
  The talks themselves — at MeasureCamp, a session card an attendee writes and places on the
  board to claim a room and a time slot. There is no programme committee and no call for
  papers: the schedule is made on the morning of the event by the people who turned up,
  which is why a session points at the attendee who leads it rather than at a separate
  speaker. A card can exist before it has a place on the grid, so a session with no room and
  no time slot is one that was offered but never made it onto the board. The descriptive
  columns — type, level, language and the nature of the audience — are what answer the
  second post-event question after "was the board full": was there enough variety on it.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `session_id` | STRING | Session ID | PK. Unique session identifier. |
| `session_board_id` | STRING | Session Board ID | The board this session card was placed on. FK to [Session Board](./session-board.md) |
| `room_id` | STRING | Room ID | The room the session runs in. NULL while the card has not been placed on the board yet. FK to [Room](./room.md) |
| `time_slot_id` | STRING | Time Slot ID | The slot the session runs in. NULL while the card has not been placed on the board yet — a session with no slot never actually happened. FK to [Time Slot](./time-slot.md) |
| `speaker_attendee_id` | STRING | Speaker | The attendee who leads the session. Attendees both give sessions and sit in other people's, so this is a role on the day, not a separate kind of person. FK to [Attendee](./attendee.md) |
| `name` | STRING | Session Name | The title written on the session card. |
| `description` | STRING | Session Description | What the session is about, as pitched on the card. |
| `type` | STRING | Session Type | `Presentation` (someone presents) or `Discussion` (the room talks). |
| `level` | STRING | Level | `Beginner`, `Intermediate` or `Advanced`. A board with nothing for beginners is a recognised failure mode, so the spread matters more than the count. |
| `language` | STRING | Language | The language the session is held in. |
| `audience` | STRING | Audience | The nature of the audience the session is pitched at: `Analytical`, `Business` or `Technical`. |

# Example Questions

- Was there a good variety on the board — how did `sessions` split across level, type and audience, and did any edition end up all-technical or all-beginner?
- How many session cards never made it onto the board at all, and did those differ in level or audience from the ones that did?
- Do the attendees who lead `sessions` come back to later editions more often than those who only listen?

## Joins

- [Session Board](./session-board.md) — `session_board_id = session_board_id` [N:1] — The board this session card was placed on.
  - [Session Board Event](./event.md) — The edition this session was held at.
    - [Session Board Event City](./city.md) — The city this session was held in.
- [Room](./room.md) — `room_id = room_id` [N:1] — The room it runs in; absent while the card is not yet on the board.
  - [Room Session Board](./session-board.md) — The board reached through the room — the same board as the session's own.
    - [Room Session Board Event](./event.md) — The edition reached through the session's room.
      - [Room Session Board Event City](./city.md) — The city reached through the session's room.
  - [Room Sponsor](./sponsor.md) — The sponsor the session's room is named after.
    - [Room Sponsor Event](./event.md) — The edition that room's sponsor signed up for.
      - [Room Sponsor Event City](./city.md) — The city of that room sponsor's edition.
- [Time Slot](./time-slot.md) — `time_slot_id = time_slot_id` [N:1] — The slot it runs in; absent while the card is not yet on the board.
  - [Time Slot Session Board](./session-board.md) — The board reached through the slot — the same board as the session's own.
    - [Time Slot Session Board Event](./event.md) — The edition reached through the session's slot.
      - [Time Slot Session Board Event City](./city.md) — The city reached through the session's slot.
- [Attendee](./attendee.md) — `speaker_attendee_id = attendee_id` [N:1] — The attendee leading it — one attendee may lead several.
  - [Attendee Ticket](./ticket.md) — The speaker's own registration.
    - [Attendee Ticket Event](./event.md) — The edition the speaker registered for.
      - [Attendee Ticket Event City](./city.md) — The city the speaker registered for.
    - [Attendee Ticket Person](./person.md) — Who the speaker is, and what they do.
    - [Attendee Ticket Sponsor](./sponsor.md) — The sponsor that issued the speaker's ticket.
      - [Attendee Ticket Sponsor Event](./event.md) — The edition that speaker's sponsorship was bought for.
        - [Attendee Ticket Sponsor Event City](./city.md) — The city of that sponsored edition.
