---
title: "Organizer"
description: |
  The local committee that puts an edition on. MeasureCamp is not run centrally: each event
  is organised by volunteers in that city, and this mart is one row per person per role they
  hold on one edition's committee — so someone who runs both the newsletter and the ticket
  releases appears twice, and someone who organises two years running appears in both. The
  roles are the working parts of an event: sponsors, venue, catering, finance, social media,
  newsletter, website, tickets and the afterparty.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `organizer_id` | STRING | Organizer ID | PK. Unique organizer identifier. |
| `event_id` | STRING | Event ID | The edition this committee seat belongs to. FK to [Event](./event.md) |
| `person_id` | STRING | Person ID | The individual holding the seat. FK to [Person](./person.md) |
| `committee_role` | STRING | Committee Role | The job on the committee: `Sponsors`, `Venue`, `Catering`, `Finance`, `Social Media`, `Newsletter`, `Website`, `Tickets`, `Afterparty`. One row per person per role, so counting rows counts roles, not people. |
| `contact_details` | STRING | Contact Details | How to reach the organiser — a phone number or an address. |

# Example Questions

- How large is a committee, and which roles are the ones that go unfilled when it is small?
- Which people organise more than one edition, and do the bigger `events` have the more experienced committees?
- Do editions with someone dedicated to the sponsors role end up with more `sponsors` signed up?

## Joins

- [Event](./event.md) — `event_id = event_id` [N:1] — The edition this committee seat belongs to.
  - [Event City](./city.md) — The city of the edition being organised.
- [Person](./person.md) — `person_id = person_id` [N:1] — The individual holding the seat.
