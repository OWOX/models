---
title: "Google Ads"
description: |
  What the OWOX Data Marts Google Ads connector loads, and how the pieces fit together. A Google Ads account is a hierarchy: campaigns hold ad groups, ad groups hold ads and targeting criteria such as keywords. The connector loads the settings of campaigns, ad groups and criteria as current-state tables, and the daily performance of campaigns, ad groups, ads, keywords and countries as time-series tables.

  Every performance table repeats the IDs of the levels above it, so each joins to its parent on a plain ID: [Campaigns Stats](./campaigns-stats.md) to [Campaigns](./campaigns.md) on `campaign_id`, [Ad Groups Stats](./ad-groups-stats.md) to [Ad Groups](./ad-groups.md) on `ad_group_id`. Keyword performance also reaches its targeting row in [Criterion](./criterion.md), and country performance resolves a country ID to a name through [Geo Target Constants](./geo-target-constants.md).

  One caution applies to every table: fields ending in `_micros` hold millionths of the account currency, so divide by 1,000,000 to read them.
tags: ["owox", "index", "connector", "google-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds"
    title: "OWOX Data Marts — Google Ads connector source"
---

9 tables, 166 fields, 9 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Ad Group Ads Stats](./ad-group-ads-stats.md) | 26 | Daily performance for individual ads — impressions, clicks, cost, and conversions. |
| [Ad Groups](./ad-groups.md) | 9 | Your ad group settings — type, status, and bid configuration within each campaign. |
| [Ad Groups Stats](./ad-groups-stats.md) | 24 | Daily ad group performance — impressions, clicks, cost, and conversions. |
| [Campaigns](./campaigns.md) | 11 | Your campaign settings — channel type, bidding strategy, budget, and scheduling. |
| [Campaigns Stats](./campaigns-stats.md) | 28 | Daily campaign performance — impressions, clicks, cost, and conversions. |
| [Criterion](./criterion.md) | 17 | Ad group targeting criteria — keywords, placements, and negative exclusions with bid settings. |
| [Geo Stats](./geo-stats.md) | 18 | Daily performance by country and targeting type — impressions, clicks, cost, and conversions. |
| [Geo Target Constants](./geo-target-constants.md) | 7 | Reference table of geographic targets — join with geo_stats on country_criterion_id to resolve country names. |
| [Keywords Stats](./keywords-stats.md) | 26 | Daily keyword performance — impressions, clicks, cost, conversions, and quality score. |

# Example Questions

- Which campaigns spend the most for the fewest conversions, once cost is divided by conversions?
- How does cost per conversion change from campaign to ad group to keyword for the same budget?
- Which countries do campaigns spend in, and which of them convert?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/google-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![Google Ads model diagram](../../res/screens/sources/google-ads.svg)
