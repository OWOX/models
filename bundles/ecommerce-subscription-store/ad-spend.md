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
timestamp: 2026-08-12T20:01:43.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_spend_id` | STRING | Spend Record ID | PK. Unique identifier of the daily spend record. |
| `date` | DATE | Date | Date the advertising activity occurred on. |
| `source` | STRING | Platform | Advertising platform the spend occurred on. FK to [Traffic Sources](./traffic-sources.md) |
| `medium` | STRING | Medium | Channel type the spend belongs to, such as cost-per-click. FK to [Traffic Sources](./traffic-sources.md) |
| `campaign` | STRING | Campaign | Campaign the spend belongs to. FK to [Traffic Sources](./traffic-sources.md) |
| `ad_group` | STRING | Ad Group | Ad group within the campaign that the spend belongs to. |
| `ad_account` | STRING | Ad Account | Advertising account the money was spent from. |
| `spend` | FLOAT | Spend | Amount spent on advertising on this date. |
| `clicks` | INTEGER | Clicks | Number of clicks the advertising received. |
| `impressions` | INTEGER | Impressions | Number of times the advertising was displayed. |
| `platform_conversions` | FLOAT | Platform-Claimed Conversions | How many purchases the ad platform's own reporting credits to this campaign, set here so it can be read against Orders. It runs ahead of the store's own order count on purpose — 1.25x on Google Ads and Microsoft Ads, 1.40x on Meta Ads, 1.55x on TikTok Ads — because platforms count clicks up to 7 days old plus views up to 1 day old, stitch a purchase across a shopper's devices, and let more than one platform claim the same sale. The gap between this and actual orders is the attribution gap, not an error to reconcile away. |
| `platform_conversion_value` | FLOAT | Platform-Claimed Revenue | Revenue the platform attributes to the conversions it claims above. NULL for TikTok Ads by design — that platform's reporting includes a conversion count but no value, and that gap in what each platform can even tell you is itself worth stating rather than defaulting to zero. |
| `currency` | STRING | Currency | Three-letter code of the currency the spend is reported in. |

# Example Questions

- What does a new subscriber cost by channel, and how does that compare with the recurring revenue they go on to produce?
- Which campaigns and ad groups are scaling spend without a matching lift in `subscriptions`?
- How do cost per click and cost per acquisition compare across platforms week over week?

## Joins

- [Traffic Sources](./traffic-sources.md) — `source = source`, `medium = medium`, `campaign = campaign` — The channel this spend was bought on.
