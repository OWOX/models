---
title: "Pageviews"
description: |
  Every page view recorded on the storefront, in sequence within its session — which page,
  which visitor, and where in the session the view sits. This is the finest grain in the model
  and the raw material for funnel and engagement analysis: the step-by-step path a shopper
  takes between arriving and buying.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T16:47:24.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The calendar date when the pageview occurred. |
| `session_id` | STRING | Unique identifier for a specific user browsing session. |
| `visitor_id` | STRING | Unique identifier for an individual user or browser. |
| `hit_number` | INTEGER | The sequential order of the pageview within a specific session. |
| `page_id` | INTEGER | Unique identifier for the specific page viewed by the visitor. FK to [Pages](./pages.md) |
| `hit_timestamp` | TIMESTAMP | The exact date and time when the pageview was recorded, in UTC. |

# Example Questions

- How deep does a typical `session` go before an `order`, and where does the path break down?
- Which `pages` appear most often as the last view of a `session` that never converts?
- How does browsing depth differ between `visitors` who buy and visitors who leave?

## Joins

- [Pages](./pages.md) — `page_id = page_id`
