---
title: "Reddit Ads"
description: |
  What the OWOX Data Marts Reddit Ads connector loads, and how the pieces fit together. A Reddit Ads account is a hierarchy: an [Ad Account](./ad-account.md) holds [Campaigns](./campaigns.md), a campaign holds [Ad Groups](./ad-groups.md), and an ad group holds [Ads](./ads.md). Campaigns draw on a payment method in [Funding Instruments](./funding-instruments.md), and the account also owns [Custom Audiences](./custom-audiences.md) and [Lead Gen Forms](./lead-gen-forms.md). [Ad Account User](./ad-account-user.md) is the authenticated member and stands apart from the hierarchy.

  Those tables hold current settings, one row per entity. The results are in ten daily report tables, all keyed by `ad_id` and `date`: [Ad Performance](./ad-performance.md) has no further breakdown, and each of the others splits the same metrics by one more dimension: [account](./ad-performance-by-account.md), [ad group](./ad-performance-by-ad-group.md), [campaign](./ad-performance-by-campaign.md), [country](./ad-performance-by-country.md), [DMA](./ad-performance-by-dma.md), [interest](./ad-performance-by-interest.md), [community](./ad-performance-by-community.md), [keyword](./ad-performance-by-keyword.md) or [placement](./ad-performance-by-placement.md). Because every report row names its ad, each report joins to Ads on `ad_id`, and reaches the ad group, campaign and account through Ads.

  The breakdown tables are alternatives, not parts of one total: a row in Ad Performance by Country and a row in Ad Performance by Keyword can describe the same spend, so never add the tables together. The API reference describes `spend` in microcurrency; divide it by 1 million to read it in the account currency.
tags: ["owox", "index", "connector", "reddit-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds"
    title: "OWOX Data Marts — Reddit Ads connector source"
---

18 tables, 675 fields, 16 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Ad Account](./ad-account.md) | 17 | Your ad account settings — currency, attribution windows, and account type. |
| [Ad Account User](./ad-account-user.md) | 7 | The authenticated Reddit Ads user — identity and contact details. |
| [Ad Groups](./ad-groups.md) | 27 | Ad groups within your campaigns — bid strategy, goal, targeting, and schedule. |
| [Ad Performance](./ad-performance.md) | 55 | Daily ad performance — impressions, clicks, spend, conversions, and ROAS. |
| [Ad Performance by Account](./ad-performance-by-account.md) | 56 | Daily ad performance broken down by ad account. |
| [Ad Performance by Ad Group](./ad-performance-by-ad-group.md) | 56 | Daily ad performance broken down by ad group. |
| [Ad Performance by Campaign](./ad-performance-by-campaign.md) | 57 | Daily ad performance broken down by campaign. |
| [Ad Performance by Community](./ad-performance-by-community.md) | 56 | Daily ad performance broken down by subreddit (community). |
| [Ad Performance by Country](./ad-performance-by-country.md) | 56 | Daily ad performance broken down by user country. |
| [Ad Performance by DMA](./ad-performance-by-dma.md) | 56 | Daily ad performance broken down by Designated Market Area (DMA). |
| [Ad Performance by Interest](./ad-performance-by-interest.md) | 56 | Daily ad performance broken down by user interest targeting. |
| [Ad Performance by Keyword](./ad-performance-by-keyword.md) | 56 | Daily ad performance broken down by keyword. |
| [Ad Performance by Placement](./ad-performance-by-placement.md) | 56 | Daily ad performance broken down by ad placement. |
| [Ads](./ads.md) | 23 | Individual ads — type, status, and links to their campaigns and posts. |
| [Campaigns](./campaigns.md) | 15 | Your campaigns — objective, status, spend cap, and account association. |
| [Custom Audiences](./custom-audiences.md) | 9 | Custom audiences built from your user lists — type, status, and size estimates. |
| [Funding Instruments](./funding-instruments.md) | 9 | Payment methods linked to your campaigns — credit limits and current outstanding balance. |
| [Lead Gen Forms](./lead-gen-forms.md) | 8 | Lead generation forms shown in your ads — prompt text and creation details. |

# Example Questions

- Which campaigns spend the most for the fewest key conversions, once spend is divided by conversions?
- How does cost per click change from campaign to ad group to ad for the same budget?
- Which countries, communities or keywords bring the most clicks at the lowest cost?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/reddit-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![Reddit Ads model diagram](../../res/screens/sources/reddit-ads.svg)
