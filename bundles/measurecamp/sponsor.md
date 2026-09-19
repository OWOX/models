---
title: "Sponsor"
description: |
  The organisations funding an edition: one row per sponsorship, per event, so a company
  that backs the same city three years running is three rows. A sponsorship carries a tier
  and a place in the pipeline, from a prospect being talked to, through confirmed, to
  actually paid — which is the difference between a budget an organiser can spend and one
  they only hope for. Sponsors show up elsewhere in the day too: the rooms are usually named
  after them, and their staff come in on tickets of their own. Note the boundary — this is
  the money coming in; the model has no costs side, so "did the event cover its costs"
  cannot be answered here.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `sponsor_id` | STRING | Sponsor ID | PK. Unique sponsorship identifier. |
| `event_id` | STRING | Event ID | The edition this sponsorship was bought for — sponsorship is always per event. FK to [Event](./event.md) |
| `organization_name` | STRING | Organization Name | The sponsoring company, as it appears on the room and the banners. |
| `tier` | STRING | Tier | Sponsorship level: `Gold`, `Silver` or `Bronze`. |
| `status` | STRING | Status | Where the sponsorship stands: `Prospect` (in conversation), `Confirmed` (agreed) or `Paid` (money received). Only `Paid` is money an organiser actually has. |

# Example Questions

- How much of each edition's sponsorship is still only confirmed rather than paid, and how late does that convert?
- Which organisations sponsor repeatedly, and do they move up the tiers as they come back?
- Do editions with more gold `sponsors` put more `rooms` on the board?

## Joins

- [Event](./event.md) — `event_id = event_id` [N:1] — The edition this sponsorship was bought for.
  - [Event City](./city.md) — The city of the sponsored edition.
