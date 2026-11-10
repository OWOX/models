---
title: "X Ads"
description: |
  What the OWOX Data Marts X Ads connector loads, and how the pieces fit together. An X advertising account holds campaigns, campaigns hold line items (the X name for ad groups), and line items hold promoted tweets: references that attach a tweet to a line item. The connector loads each level as a current-state table ([Accounts](./accounts.md), [Campaigns](./campaigns.md), [Line Items](./line-items.md), [Promoted Tweets](./promoted-tweets.md)), the tweets and cards used as creatives ([Tweets](./tweets.md), [Cards](./cards.md), [All Cards](./all-cards.md)), a reference table of countries ([Targeting Locations](./targeting-locations.md)), and the daily performance of promoted tweets as two time-series tables: [Ad Performance](./ad-performance.md) and [Ad Performance by Country](./ad-performance-by-country.md).

  Each level carries the ID of its parent, so the chain joins on plain IDs: [Promoted Tweets](./promoted-tweets.md) to [Line Items](./line-items.md) on `line_item_id`, [Line Items](./line-items.md) to [Campaigns](./campaigns.md) on `campaign_id`, and [Campaigns](./campaigns.md) to [Accounts](./accounts.md) on `account_id`, a column the connector adds to each campaign row when it is selected. Both performance tables report on promoted tweets, so their `id` joins to [Promoted Tweets](./promoted-tweets.md), and a promoted tweet reaches its tweet through `tweet_id`, matched to the text column `tweet_id` in [Tweets](./tweets.md) rather than to the numeric `id`, which can arrive rounded. A tweet reaches its card through `card_uri` in [All Cards](./all-cards.md), and [Cards](./cards.md) is the same cards seen through the plain cards list, matched on `id`. [Ad Performance by Country](./ad-performance-by-country.md) holds a location ID in `country`, which matches `targeting_value` in [Targeting Locations](./targeting-locations.md).

  Two cautions apply. Amounts ending in `_micro` are in micros: the X Ads docs write 5.50 USD as 5500000, so divide by 1,000,000. And the performance tables are built only for the promoted tweets the connector has loaded, so line items that were deleted drop out of them.
tags: ["owox", "index", "connector", "x-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/XAds"
    title: "OWOX Data Marts — X Ads connector source"
---

10 tables, 187 fields, 9 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Accounts](./accounts.md) | 12 | Advertising accounts — name, business, country, timezone, and approval status. |
| [Ad Performance](./ad-performance.md) | 20 | Daily ad performance by placement — impressions, clicks, spend, engagements, and social actions. |
| [Ad Performance by Country](./ad-performance-by-country.md) | 21 | Daily ad performance broken down by country — impressions, clicks, spend, engagements, and social actions. |
| [All Cards](./all-cards.md) | 28 | All card types with full creative details — type, title, destination URL, call to action, and media. |
| [Campaigns](./campaigns.md) | 19 | Your campaigns — status, budget optimization, daily and total budget, and currency. |
| [Cards](./cards.md) | 8 | Website and app cards — type, URI, and components. |
| [Line Items](./line-items.md) | 33 | Line items within campaigns — bid strategy, goal, product type, budget, and schedule. |
| [Promoted Tweets](./promoted-tweets.md) | 8 | Tweets promoted as ads — status, approval, and links to their tweets and line items. |
| [Targeting Locations](./targeting-locations.md) | 4 | Reference table of location IDs with names and country codes — join targeting_value with the country field in Ad Performance by Country. |
| [Tweets](./tweets.md) | 34 | Original tweets used as ad creatives — text, type, language, engagement counts, and card URI. |

# Example Questions

- Which campaigns spend the most for the fewest clicks, once spend is divided by clicks?
- How do impressions, clicks and engagements change from campaign to line item to promoted tweet?
- Which countries do promoted tweets reach, and which of them engage?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/x-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![X Ads model diagram](../../res/screens/sources/x-ads.svg)
