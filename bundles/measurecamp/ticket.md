---
title: "Ticket"
tags: ["owox", "sql"]
type: "OWOX Data Mart"
---

# Ticket

## Overview

- **ID:** `b7ce06d9-3ce2-41b2-a022-dda2721ebf5c`
- **Status:** PUBLISHED
- **Definition type:** SQL
- **Storage:** a1eb7e48-10e7-4507-9932-0ae4c886214b

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ticket_id` | STRING | PK. |
| `event_id` | STRING | FK to [Event](./event.md) |
| `person_id` | STRING | FK to [Person](./person.md) |
| `sponsor_id` | STRING | FK to [Sponsor](./sponsor.md) |
| `type` | STRING | Values: General Attendee, Sponsor, Organizer, Volunteer |
| `release` | INTEGER |  |
| `sponsor_consent` | BOOLEAN |  |

## Joins

- [Event](./event.md) — `event_id = event_id`
- [Person](./person.md) — `person_id = person_id`
- [Sponsor](./sponsor.md) — `sponsor_id = sponsor_id`
