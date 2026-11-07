---
title: "TikTok Ads"
description: |
  What the OWOX Data Marts TikTok Ads connector loads, and how the pieces fit together. A TikTok advertiser account holds campaigns, campaigns hold ad groups, and ad groups hold ads. The connector loads the settings of each level as current-state tables ([Advertiser Account](./advertiser-account.md), [Campaigns](./campaigns.md), [Ad Groups](./ad-groups.md), [Ads](./ads.md)), the account's saved [Custom Audiences](./custom-audiences.md), and the daily performance of ads as two time-series tables: [Ad Performance](./ad-performance.md) and [Ad Performance by Country](./ad-performance-by-country.md).

  Each table repeats the ID of the level above it, so every level joins to its parent on a plain ID: [Ad Groups](./ad-groups.md) to [Campaigns](./campaigns.md) on `campaign_id`, [Ads](./ads.md) to [Ad Groups](./ad-groups.md) on `adgroup_id`, and both performance tables to [Ads](./ads.md) on `ad_id`. Campaigns and Custom Audiences join to the advertiser on `advertiser_id`. The performance tables also carry `campaign_id` and `adgroup_id`, but read them through Ads rather than as a second route to the campaign.

  One caution applies to the performance tables: the connector's Data Level setting decides what one row is. The default is the ad level, one row per ad per day. At the advertiser, campaign or ad group level the rows are totals for that level and `ad_id` is not part of the key, so the join to Ads does not apply.
tags: ["owox", "index", "connector", "tiktok-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/TikTokAds"
    title: "OWOX Data Marts — TikTok Ads connector source"
---

7 tables, 217 fields, 6 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Ad Groups](./ad-groups.md) | 45 | Ad groups within your campaigns — bid strategy, optimization goal, placement, and targeting schedule. |
| [Ad Performance](./ad-performance.md) | 39 | Daily ad performance — impressions, clicks, spend, conversions, video views, and engagement. |
| [Ad Performance by Country](./ad-performance-by-country.md) | 40 | Daily ad performance broken down by country — impressions, clicks, spend, conversions, and video views. |
| [Ads](./ads.md) | 46 | Individual ads — creative type, format, call to action, status, and links to their campaigns and ad groups. |
| [Advertiser Account](./advertiser-account.md) | 4 | Advertiser account — name, company, and currency. |
| [Campaigns](./campaigns.md) | 34 | Your campaigns — objective, type, status, budget, and schedule. |
| [Custom Audiences](./custom-audiences.md) | 9 | Custom audiences — type, size, validity status, and expiration. |

# Example Questions

- Which campaigns spend the most for the fewest conversions, once spend is divided by conversions?
- How do spend and click-through rate change from campaign to ad group to ad for the same objective?
- Which countries do ads spend in, and which of them convert?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/tiktok-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![TikTok Ads model diagram](../../res/screens/sources/tiktok-ads.svg)
