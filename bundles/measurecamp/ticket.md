---
title: "Ticket"
description: |
  Registration: one row per ticket issued for an edition, and the only way in — the rule is
  that without a ticket you do not get through the door. A ticket names the person it
  belongs to and the capacity they come in as, since sponsors, organisers and volunteers are
  all ticket holders too rather than a separate list. Tickets are released in batches, which
  is what makes a release number worth keeping. And because not everyone who registers
  arrives, the count of tickets is always larger than the count of attendees — treating the
  two as the same number is the classic mistake this split exists to prevent.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ticket_id` | STRING | Ticket ID | PK. Unique ticket identifier. |
| `event_id` | STRING | Event ID | The edition this ticket admits to. FK to [Event](./event.md) |
| `person_id` | STRING | Person ID | The individual the ticket belongs to. The same person across editions is the same row in Person, which is what makes returning visitors visible. FK to [Person](./person.md) |
| `sponsor_id` | STRING | Sponsor ID | The sponsor whose allocation this ticket came out of, for sponsor staff. NULL for every ordinary ticket. FK to [Sponsor](./sponsor.md) |
| `type` | STRING | Ticket Type | The capacity the holder comes in as: `General Attendee`, `Sponsor`, `Organizer` or `Volunteer`. |
| `release` | INTEGER | Ticket Release | Which batch the ticket was released in — 1 for the first release, 2 for the second, and so on. |
| `sponsor_consent` | BOOLEAN | Sponsor Consent | True when the holder agreed at registration that their details may be shared with the edition's sponsors. |

# Example Questions

- How does the no-show rate — `tickets` issued against `attendees` who arrived — differ between editions, and does it change by ticket release?
- What share of holders consent to being shared with `sponsors`, and does that differ between general attendees and sponsor staff?
- How much of an edition's room is taken up by organisers, volunteers and sponsor staff rather than general attendees?

## Joins

- [Event](./event.md) — `event_id = event_id` [N:1] — The edition this ticket admits to.
  - [Event City](./city.md) — The city this ticket admits to.
- [Person](./person.md) — `person_id = person_id` [N:1] — The individual the ticket belongs to.
- [Sponsor](./sponsor.md) — `sponsor_id = sponsor_id` [N:1] — The sponsor whose allocation issued it; absent on ordinary tickets.
  - [Sponsor Event](./event.md) — The edition the issuing sponsor signed up for.
    - [Sponsor Event City](./city.md) — The city of the issuing sponsor's edition.
