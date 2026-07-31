---
title: "Ad Spend"
description: |
  Every dollar the brokerage puts into buying traffic, one row per day, source, medium,
  campaign and targeting country — the exact grain the media buyers work at. Each row carries
  the money twice, once as `cost` and once as `cost_normalized` — both already in this
  reporting's single currency, so either sums safely — next to the impressions and clicks it
  bought, so cost per click, cost per thousand impressions and click-through rate all come out
  of a single table. Targeting country is where the budget was spent, not where the trader who
  answered the ad turns out to live — the two diverge often enough that keeping them apart is
  the whole point of the field.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T07:25:24.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. Composite key together with source, medium, campaign, targeting_country. Calendar date the spend occurred — use for daily/weekly/monthly spend trends. FK to [Attribution](./attribution.md) |
| `source` | STRING | Source | PK. Ad traffic source — which channel ran the ad, e.g. `google`, `facebook`, `tiktok`, `bing`, `native`, `applesearch`. Answers "which channel/platform did we spend on". FK to [Attribution](./attribution.md) |
| `medium` | STRING | Medium | PK. Ad format / traffic medium, e.g. `cpc`, `cpm`, `paid-social`. Answers "what type of ad" (search vs social vs display). FK to [Attribution](./attribution.md) |
| `campaign` | STRING | Campaign | PK. UTM campaign name, e.g. `search_generic_fx`, `acq_video_q3`. Use for campaign-level spend breakdowns. FK to [Attribution](./attribution.md) |
| `targeting_country` | STRING | Targeting Country | PK. Country the ad budget was targeted at — i.e. where the money was spent. This is NOT where the resulting client lives; for that use Clients.country or Attribution.client_country. Use this field to answer "spend by country". FK to [Attribution](./attribution.md) |
| `targeting_region` | STRING | Targeting Region | Business-region roll-up of targeting_country: `SEA`, `ME`, `EU`, `LATAM`, `AFRICA`, `CA`, `UK`, `AU`, `ANZ`, `Other`. Use for "spend by region" instead of listing every country. |
| `ad_platform` | STRING | Ad Platform | Name of the advertising platform that billed this spend: `Google Ads`, `Meta Ads`, `TikTok Ads`, `Bing Ads`, `YouTube Ads`, `Apple Search Ads`, `Native Ads Network`. Answers "which ad platform/network". |
| `cost` | FLOAT | Cost | Ad spend in this dataset's single reporting currency — identical to `cost_normalized` here, so summing it directly is safe. Kept as a separate field for consistency with source systems where ad platforms genuinely bill in local currency and a normalized column is needed. |
| `cost_normalized` | FLOAT | Cost Normalized | Ad spend converted to USD. This is the field to SUM for "total spend", "ad cost", "budget spent", "how much did we spend" questions — safe to aggregate across countries and campaigns. |
| `impressions` | INTEGER | Impressions | Number of times the ad was displayed. SUM for total impressions; divide clicks by impressions for CTR. |
| `clicks` | INTEGER | Clicks | Number of ad clicks. SUM for total clicks; divide cost_normalized by clicks for CPC, or clicks by impressions for CTR. |

# Example Questions

- Which ad platforms deliver the cheapest clicks in the regions we push hardest, and is that cost per click drifting up week over week as we scale the budget?
- How concentrated is our media buy — what share of total spend sits in a handful of campaigns, and does their click-through rate justify the concentration?
- Are we overpaying for reach in particular countries — how does cost per thousand impressions compare across targeting countries running the same ad format?

## Joins

- [Attribution](./attribution.md) — `date = date`, `source = source`, `medium = medium`, `campaign = campaign`, `targeting_country = targeting_country`
