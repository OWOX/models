---
title: "Organizer"
tags: ["owox", "sql"]
type: "OWOX Data Mart"
---

# Organizer

## Overview

- **ID:** `ab9edb02-22e6-482d-8b56-0c6f01d3c879`
- **Status:** PUBLISHED
- **Definition type:** SQL
- **Storage:** a1eb7e48-10e7-4507-9932-0ae4c886214b

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `organizer_id` | STRING | PK. |
| `event_id` | STRING | FK to [Event](./event.md) |
| `person_id` | STRING | FK to [Person](./person.md) |
| `committee_role` | STRING | Values: Sponsors, Venue, Catering, Finance, Social Media, Newsletter, Website, Tickets, Afterparty |
| `contact_details` | STRING |  |

## Joins

- [Event](./event.md) — `event_id = event_id`
- [Person](./person.md) — `person_id = person_id`
