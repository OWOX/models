---
type: "OWOX Data Mart"
title: "Touchpoints"
description: |
  One row per marketing touch a lead has on the way to becoming a customer, credited under a
  W-shaped multi-touch attribution model that splits credit 30% to the first touch, 30% to lead
  creation, 30% to opportunity creation and 10% across everything in between. This is the mart
  that answers "which channels and campaigns actually deserve credit," rather than crediting
  only the first click or the last one.
tags: ["owox"]
timestamp: 2026-07-23T17:34:33.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `touchpoint_id` | STRING | PK. Unique identifier for each marketing touch. |
| `lead_id` | STRING | Lead that this touch belongs to. FK to [Lead](./lead.md) |
| `campaign_id` | STRING | Campaign associated with this touch. FK to [Campaign](./campaign.md) |
| `occurred_at` | TIMESTAMP | When the touch happened. |
| `channel` | STRING | Channel where the touch occurred. Equals the campaign's `channel`; same controlled vocabulary as [Campaign](./campaign.md)`.channel`. |
| `touch_type` | STRING | Kind of interaction. One of: `ad_click`, `form_fill`, `email_open`, `email_click`, `webinar_attend`, `content_download`, `demo_request`. Consistent with `channel` (e.g. no `email_open` on `paid_search`). |
| `touch_credit` | FLOAT | W-shaped credit for this touch. Sums to exactly 1.0 per lead: 30% first touch, 30% lead creation, 30% opportunity creation, 10% across middle touches. |
| `is_first_touch` | BOOLEAN | True on the lead's earliest touch (exactly one per lead). W-shaped anchor. |
| `is_lead_create` | BOOLEAN | True on the touch that created the lead (exactly one per lead; coincides with `Lead.created_at`). W-shaped anchor. |
| `is_opp_create` | BOOLEAN | True on the touch that created the opportunity (at most one per lead; only for leads with an opportunity; coincides with `Opportunities.created_at`). W-shaped anchor. |

# Example Questions

- Which channels and campaigns earn the most attributed credit across the full buyer journey, not just first- or last-touch?
- How many touches, and of what type, does a typical lead have before becoming an opportunity?
- How does attributed pipeline by campaign compare to what a single-touch (first- or last-touch) view would show?

## Joins

- [Campaign](./campaign.md) — `campaign_id = campaign_id`
- [Lead](./lead.md) — `lead_id = lead_id`
