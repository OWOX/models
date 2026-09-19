---
title: "City"
description: |
  The cities MeasureCamp runs in. One row per city, so the editions held in the same place
  across different years resolve to a single row and can be compared over time — which a
  free-text city name on the event could never do. A small lookup: it carries no dates and
  no numbers of its own, and is always read through an event.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `city_id` | STRING | City ID | PK. Unique city identifier. |
| `name` | STRING | City Name | The city an edition is held in — London, Toronto, Delhi. One row per city, however many editions it has hosted. |

# Example Questions

- Which cities have hosted the most `events`, and which have hosted only once?
- How many cities does the community reach in a year, and which ones came back?
- Which cities have never had a second edition, and what did their session board look like?
