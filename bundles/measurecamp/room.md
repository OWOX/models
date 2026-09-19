---
title: "Room"
description: |
  The rooms an edition's session board is built from: one row per room offered on a board,
  with the name it goes by, how many people it seats and how the seating is laid out. Rooms
  are usually named after the sponsor that paid for them, which is why a room points at a
  sponsor as well as at its board — an unsponsored room simply carries no sponsor. Capacity
  and layout are what decide whether a popular session has room for the people who want it:
  a boardroom of twelve and a theatre of a hundred are both one column of the grid, and the
  board itself does not distinguish them.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `room_id` | STRING | Room ID | PK. Unique room identifier. |
| `session_board_id` | STRING | Session Board ID | The board this room is one column of. FK to [Session Board](./session-board.md) |
| `sponsor_id` | STRING | Sponsor ID | The sponsor the room is named after. NULL for rooms that carry no sponsor's name. FK to [Sponsor](./sponsor.md) |
| `name` | STRING | Room Name | What the room is called on the board — often the naming sponsor's brand. |
| `capacity` | INTEGER | Capacity | How many people the room seats as laid out. Read it together with `style`: the same space seats very different numbers as a boardroom and as a theatre. |
| `style` | STRING | Layout Style | Seating layout: `Boardroom` (a table, a dozen or so people, discussion-shaped) or `Theatre` (rows facing a speaker). |

# Example Questions

- How much seating does each board actually offer, and how is it split between boardroom and theatre layouts?
- Do sponsor-named rooms tend to be the big ones, or is the naming spread across the whole board?
- Which rooms carried the most `sessions`, and did the bigger rooms get the presentations while the small ones got the discussions?

## Joins

- [Session Board](./session-board.md) — `session_board_id = session_board_id` [N:1] — The board this room is one column of.
  - [Session Board Event](./event.md) — The edition this room was used at.
    - [Session Board Event City](./city.md) — The city this room was used in.
- [Sponsor](./sponsor.md) — `sponsor_id = sponsor_id` [N:1] — The sponsor the room is named after; absent on unsponsored rooms.
  - [Sponsor Event](./event.md) — The edition the naming sponsor signed up for.
    - [Sponsor Event City](./city.md) — The city of the naming sponsor's edition.
