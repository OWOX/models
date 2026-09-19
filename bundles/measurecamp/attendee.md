---
title: "Attendee"
description: |
  The people who actually turned up: one row per ticket that was used on the day.
  Registering and attending are deliberately separate here — a ticket is a claim on a place,
  an attendee is someone who took it — and the gap between the two is the number every
  organiser wants before the event. The two flags are what an edition would want to know
  about the room: whether this is someone's first MeasureCamp or a return visit, and whether
  they ended up leading a session, which any attendee may do by putting a card on the board.
  Who sat in which session is not tracked, and no join in this model implies it.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `attendee_id` | STRING | Attendee ID | PK. Unique attendee identifier. |
| `ticket_id` | STRING | Ticket ID | The registration this attendee walked in on. Every attendee has one — no ticket, no entry — but not every ticket becomes an attendee. FK to [Ticket](./ticket.md) |
| `is_first_measurecamp` | BOOLEAN | First MeasureCamp | True when this is the attendee's first MeasureCamp, false for a returning one. The new-versus-returning mix is the single best read on whether the community is growing or circulating. |
| `is_speaker` | BOOLEAN | Is Speaker | True when this attendee led at least one session. Leading does not stop someone attending other sessions, so speakers are a subset of attendees, not a separate group. |

# Example Questions

- What share of each edition was there for the first time, and how does that mix differ between cities?
- How many of the people in the room ended up leading a `session`, and is that share higher among first-timers or returners?
- How many `tickets` went unused — how far is the number who showed up from the number who registered?

## Joins

- [Ticket](./ticket.md) — `ticket_id = ticket_id` [1:1] — The registration this attendee walked in on.
  - [Ticket Event](./event.md) — The edition this attendee came to.
    - [Ticket Event City](./city.md) — The city this attendee came to.
  - [Ticket Person](./person.md) — Who the attendee is, and what they do.
  - [Ticket Sponsor](./sponsor.md) — The sponsor that issued their ticket, for sponsor staff.
    - [Ticket Sponsor Event](./event.md) — The edition that sponsorship was bought for.
      - [Ticket Sponsor Event City](./city.md) — The city of that sponsored edition.
