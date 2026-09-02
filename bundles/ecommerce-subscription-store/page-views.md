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
timestamp: 2026-09-02T16:21:32.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `pageview_id` | STRING | Pageview ID | PK. Unique identifier of the page view. |
| `session_id` | STRING | Session ID | Session the page view belongs to. FK to [Sessions](./sessions.md) |
| `page_id` | STRING | Page ID | Page that was viewed. FK to [Pages](./pages.md) |
| `date` | DATE | Date | Date the page view occurred. |
| `hit_number` | INTEGER | Hit Number | Position of the page view within its session, starting at one. |
| `hit_timestamp` | TIMESTAMP | Hit Timestamp | Exact moment the page view was recorded, in UTC. |
| `pageview_count` | INTEGER | Pageview Count | Always one, so page views can be summed without counting distinct identifiers. |

# Example Questions

- How deep does a `session` go before a `subscription sign-up`, and where does the path break down?
- Which `pages` appear most often as the last view of a `session` that never converts?
- Do subscribers who visit the `subscription` management `pages` churn more often in the following weeks?

## Joins

- [Pages](./pages.md) — `page_id = page_id` — The page that was viewed.
- [Sessions](./sessions.md) — `session_id = session_id` — The visit this page view belongs to.
