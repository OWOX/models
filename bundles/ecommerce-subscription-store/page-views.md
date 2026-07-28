---
title: "Page Views"
description: |
  Every page view recorded on the storefront, in sequence within its session — which page, when,
  and where in the session the view sits. This is the finest grain in the model and the raw
  material for funnel analysis: the step-by-step path between arriving and buying, or between
  arriving and leaving.

  Because the subscription management pages are part of the same page catalog, the same funnel
  logic covers both new sign-ups and existing subscribers going in to skip, swap or cancel — the
  behaviour that precedes churn is visible before the churn itself.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-28T16:51:39.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `pageview_id` | STRING | PK. Unique identifier of the page view. |
| `session_id` | STRING | Session the page view belongs to. FK to [Sessions](./sessions.md) |
| `page_id` | STRING | Page that was viewed. FK to [Pages](./pages.md) |
| `date` | DATE | Date the page view occurred. |
| `hit_number` | INTEGER | Position of the page view within its session, starting at one. |
| `hit_timestamp` | TIMESTAMP | Exact moment the page view was recorded, in UTC. |
| `pageview_count` | INTEGER | Always one, so page views can be summed without counting distinct identifiers. |

# Example Questions

- How deep does a `session` go before a `subscription` sign-up, and where does the path break down?
- Which `pages` appear most often as the last view of a `session` that never converts?
- Do subscribers who visit the `subscription` management `pages` churn more often in the following weeks?

## Joins

- [Pages](./pages.md) — `page_id = page_id`
- [Sessions](./sessions.md) — `session_id = session_id`
