---
title: "Event"
description: |
  One row per edition of MeasureCamp: a single day, in one city, at one venue. Every edition
  is run by its own local organising committee rather than centrally, so an event is the
  unit that everything else in this model hangs off — the session board laid out for it, the
  tickets sold for it, the sponsors who funded it and the committee that put it on. The
  properties are deliberately few, because an edition is described by what happened around
  it far more than by its own attributes.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `event_id` | STRING | Event ID | PK. Unique event identifier. |
| `city_id` | STRING | City ID | The city this edition was held in. FK to [City](./city.md) |
| `name` | STRING | Event Name | Name of the edition, usually the city and the year. |
| `date` | DATE | Event Date | The single day the edition runs on — MeasureCamp is a one-day unconference. |
| `location` | STRING | Venue | The venue inside the city: the building that hosts the day. |

# Example Questions

- How many editions ran in each `city` per year, and is the calendar spreading to new cities or repeating in the same ones?
- Which editions sold the most `tickets` relative to the room capacity their `session board` offered?
- Which editions attracted the most `sponsors`, and did the extra funding show up as more rooms on the board?

## Joins

- [City](./city.md) — `city_id = city_id` [N:1] — The city this edition was held in.
