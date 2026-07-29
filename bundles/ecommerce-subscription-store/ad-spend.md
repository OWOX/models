---
title: "Ad Spend"
description: |
  Advertising spend, clicks and impressions from every paid platform the store runs, on one daily
  grain, down to the ad group and the account the money was spent from. Because it shares source,
  medium and campaign naming with the storefront's traffic sources, spend can be set against the
  sessions, orders and subscriptions it produced instead of being read on its own.

  For a subscription business the interesting comparison is not cost per order but cost per
  subscriber, and the two diverge sharply by channel: a channel with expensive first orders can
  still be the cheapest source of long-lived subscribers.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-28T16:51:49.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_spend_id` | STRING | Ad Spend ID | PK. Unique identifier of the daily spend record. |
| `date` | DATE | Date | Date the advertising activity occurred on. |
| `source` | STRING | Source | Advertising platform the spend occurred on. FK to [Traffic Sources](./traffic-sources.md) |
| `medium` | STRING | Medium | Channel type the spend belongs to, such as cost-per-click. FK to [Traffic Sources](./traffic-sources.md) |
| `campaign` | STRING | Campaign | Campaign the spend belongs to. FK to [Traffic Sources](./traffic-sources.md) |
| `ad_group` | STRING | Ad Group | Ad group within the campaign that the spend belongs to. |
| `ad_account` | STRING | Ad Account | Advertising account the money was spent from. |
| `spend` | FLOAT | Spend | Amount spent on advertising on this date. |
| `clicks` | INTEGER | Clicks | Number of clicks the advertising received. |
| `impressions` | INTEGER | Impressions | Number of times the advertising was displayed. |
| `currency` | STRING | Currency | Three-letter code of the currency the spend is reported in. |

# Example Questions

- What does a new subscriber cost by channel, and how does that compare with the recurring revenue they go on to produce?
- Which campaigns and ad groups are scaling spend without a matching lift in `subscriptions`?
- How do cost per click and cost per acquisition compare across platforms week over week?

## Joins

- [Traffic Sources](./traffic-sources.md) — `source = source`, `medium = medium`, `campaign = campaign`
