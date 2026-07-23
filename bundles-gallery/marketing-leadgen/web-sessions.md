---
type: "OWOX Data Mart"
title: "Web Sessions"
description: |
  One row per web session, the very top of the funnel, before most visitors are ever identified
  as a lead. Each session records the traffic source and medium, the landing page, whether it
  converted into a form submission, and — for the small share of visitors identified through
  identity stitching — the lead that session belongs to. Because the overwhelming majority of
  B2B web traffic never converts or gets identified, most sessions carry no lead at all; the
  ones that do show exactly where anonymous traffic turns into a known contact.
tags: ["owox"]
timestamp: 2026-07-23T17:34:33.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | STRING | PK. Unique identifier for the web session. |
| `lead_id` | STRING | Known lead after identity stitching; null for never-identified visitors (the overwhelming majority). FK to [Lead](./lead.md) |
| `started_at` | TIMESTAMP | When the session began. |
| `campaign_id` | STRING | Campaign that drove the session; null for organic/direct. FK to [Campaign](./campaign.md) |
| `source` | STRING | Traffic source that referred the session; consistent with the driving campaign's `utm_source`. |
| `medium` | STRING | Marketing medium (e.g. organic, cpc, email); consistent with the driving campaign's `utm_medium`. |
| `landing_page` | STRING | First page viewed in the session. |
| `form_submits` | INTEGER | Number of forms submitted during the session. `≥ 1` when `is_conversion` is true. |
| `is_conversion` | BOOLEAN | Whether the session produced a lead or demo request. Session→lead conversion ~1–3% overall, lowest on paid social. |

# Example Questions

- What is the session-to-lead conversion rate by channel and landing page, and which channels are strongest at the top of the funnel?
- Which campaigns drive the most traffic volume, and how does that traffic's conversion quality compare across them?
- How much of paid versus organic/direct traffic actually results in a form submission?

## Joins

- [Campaign](./campaign.md) — `campaign_id = campaign_id`
- [Lead](./lead.md) — `lead_id = lead_id`
