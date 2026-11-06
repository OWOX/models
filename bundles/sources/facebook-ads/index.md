---
title: "Facebook Ads"
description: |
  What the OWOX Data Marts Facebook Ads connector loads from the Meta Marketing API, and how the pieces fit together. A Meta ad account is a hierarchy: the account holds campaigns, campaigns hold ad sets, ad sets hold ads, and each ad runs one creative. The connector loads the account ([Ad Account](./ad-account.md), [Ad Account User](./ad-account-user.md)), the ads and their creatives as current-state tables ([Ads](./ads.md), [Ad](./ad.md), [Ad Creatives](./ad-creatives.md)), and daily performance as insights tables.

  It loads no table of campaigns or ad sets. Their IDs and names travel as plain columns (`campaign_id`, `campaign_name`, `adset_id`, `adset_name`) on the ads and on the insights rows, so a campaign or an ad set is reached by grouping on those columns rather than by a join.

  Performance comes at three levels. [Ad Insights](./ad-insights.md) holds one row per ad per day, and seven variants split the same ad-day by age and gender, country, region, device platform, publisher platform and position, product ID or link URL asset. [Ad Insights by Ad Set](./ad-insights-by-ad-set.md) and [Ad Insights by Campaign](./ad-insights-by-campaign.md) are requested from Meta at that level, with their own reach. Every ad-level insights table joins to [Ads](./ads.md) on `ad_id`, and Ads joins to [Ad Creatives](./ad-creatives.md) on `creative_id`.

  Two cautions apply. Reach, frequency and the `unique_*` columns count people, so do not sum them across ads, days or breakdown values; take them from the ad set or campaign table. And the ads and creatives tables hold each object as of the last load, so an ad's `creative_id` is the creative it runs now, not necessarily the one that ran on an earlier day.
tags: ["owox", "index", "connector", "facebook-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/FacebookMarketing"
    title: "OWOX Data Marts — Facebook Ads connector source"
---

15 tables, 1172 fields, 10 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Ad](./ad.md) | 32 | Individual ads with their creative, status, and links to their campaign and ad set. |
| [Ad Account](./ad-account.md) | 61 | Your ad account settings, status, currency, and billing details. |
| [Ad Account User](./ad-account-user.md) | 2 | Users with access to an ad account and their assigned roles. |
| [Ad Creatives](./ad-creatives.md) | 63 | The images, videos, text, and other visual elements used in your ads. |
| [Ad Insights](./ad-insights.md) | 100 | Daily performance metrics for each ad — impressions, clicks, spend, and conversions. |
| [Ad Insights by Ad Set](./ad-insights-by-ad-set.md) | 92 | Daily ad set performance with reach deduplicated to match Meta Ads Manager. |
| [Ad Insights by Age and Gender](./ad-insights-by-age-and-gender.md) | 102 | Daily ad performance broken down by audience age range and gender. |
| [Ad Insights by Campaign](./ad-insights-by-campaign.md) | 89 | Daily campaign performance with reach deduplicated to match Meta Ads Manager. |
| [Ad Insights by Country](./ad-insights-by-country.md) | 101 | Daily ad performance broken down by the country where your audience is located. |
| [Ad Insights by Device Platform](./ad-insights-by-device-platform.md) | 101 | Daily ad performance broken down by the device type your audience used. |
| [Ad Insights by Link URL Asset](./ad-insights-by-link-url-asset.md) | 101 | Daily ad performance broken down by the link URL shown in your ads. |
| [Ad Insights by Product ID](./ad-insights-by-product-id.md) | 101 | Daily ad performance broken down by individual product from your catalog. |
| [Ad Insights by Publisher Platform and Position](./ad-insights-by-publisher-platform-and-position.md) | 102 | Daily ad performance broken down by where your ads appeared — platform and placement position. |
| [Ad Insights by Region](./ad-insights-by-region.md) | 101 | Daily ad performance broken down by the region where your audience is located. |
| [Ads](./ads.md) | 24 | Individual ads with their status, creative, and campaign hierarchy. |

# Example Questions

- Which campaigns spend the most for the fewest results, once spend is divided by results?
- Which creatives drive the cheapest conversions, once performance is joined to the creative each ad runs?
- How many people did each campaign reach, and how often did they see the ads?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/facebook-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![Facebook Ads model diagram](../../res/screens/sources/facebook-ads.svg)
