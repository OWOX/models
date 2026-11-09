---
title: "Ad Performance by Country"
description: |
  Daily performance of promoted tweets split by country: the same impressions, clicks, URL clicks, engagements, billed charge and social actions as Ad Performance, with `country` added to the key. One row per promoted tweet (`id`), `date`, `placement` and `country`.

  The connector loads it with the X Ads asynchronous stats jobs, one job per set of promoted tweets and placement, segmented by location. `country` holds a location ID, a hex string, not a name or a country code. Join `id` to Promoted Tweets for the promoted tweet. The connector's Targeting Locations table is described as the lookup of names for these IDs, but no join is drawn here because the X Ads docs do not state that the segment value is a targeting value.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/XAds/XAdsAPIReference/XAdsFieldsSchema.js"
    title: "OWOX Data Marts X Ads connector — Ad Performance by Country endpoint (`stats_by_country`)"
  - id: "vendor-reference"
    resource: "https://developer.x.com/en/docs/x-ads-api/analytics/api-reference/asynchronous"
    title: "X Ads API reference — asynchronous"
---

## Connector endpoint

- **Endpoint:** X Ads · `stats_by_country`
- **Default destination table:** `x_ads_stats_by_country`
- **Unique keys:** `id`, `date`, `placement`, `country`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. The unique identifier for the stats record. |
| `date` | STRING | Date | PK. The date for which the statistics were collected. |
| `placement` | STRING | Placement | PK. The placement type (ALL_ON_TWITTER or PUBLISHER_NETWORK). |
| `country` | STRING | Country | PK. Location ID from X Ads (hex string, e.g. 96683cc9126741d1). Join with the targeting_locations node to get the human-readable name and country code. |
| `impressions` | INTEGER | Impressions | Number of impressions. |
| `tweets_send` | INTEGER | Tweets Send | Number of tweets sent. |
| `billed_charge_local_micro` | INTEGER | Billed Charge Local Micro | Billed amount in micros. |
| `qualified_impressions` | INTEGER | Qualified Impressions | Number of qualified impressions. |
| `follows` | INTEGER | Follows | Number of follows. |
| `app_clicks` | INTEGER | App Clicks | Number of app clicks. |
| `retweets` | INTEGER | Retweets | Number of retweets. |
| `unfollows` | INTEGER | Unfollows | Number of unfollows. |
| `likes` | INTEGER | Likes | Number of likes. |
| `engagements` | INTEGER | Engagements | Number of engagements. |
| `clicks` | INTEGER | Clicks | Number of clicks. |
| `card_engagements` | INTEGER | Card Engagements | Number of card engagements. |
| `poll_card_vote` | INTEGER | Poll Card Vote | Number of poll card votes. |
| `replies` | INTEGER | Replies | Number of replies. |
| `url_clicks` | INTEGER | URL Clicks | Number of URL clicks. |
| `billed_engagements` | INTEGER | Billed Engagements | Number of billed engagements. |
| `carousel_swipes` | INTEGER | Carousel Swipes | Number of carousel swipes. |

# Example Questions

- Which countries bring the most clicks, and at what billed charge per click?
- Do promoted tweets get more engagements per impression in some countries than in others?
- Which promoted tweets reach more than one country?

## Joins

- [Promoted Tweets](./promoted-tweets.md) — `id = id` [N:1] — The promoted tweet the country row reports on.
  - Description: The promoted tweet the country row reports on.
