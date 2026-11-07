---
title: "Ad Performance"
description: |
  Daily performance of promoted tweets: impressions, clicks, URL clicks, engagements, billed engagements, billed charge (`billed_charge_local_micro`, spend in micros), and social actions such as likes, reposts, replies and follows. One row per promoted tweet (`id`) per `date` and `placement`; the connector requests ALL_ON_TWITTER and PUBLISHER_NETWORK.

  The connector requests the engagement and billing metric groups, and stores a metric the API does not return as 0, so a 0 can mean not reported. The `id` is a promoted tweet ID, not a tweet ID: join it to Promoted Tweets on `id`, then to Line Items for the line item.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/XAds/XAdsAPIReference/XAdsFieldsSchema.js"
    title: "OWOX Data Marts X Ads connector — Ad Performance endpoint (`stats`)"
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/stats"
    title: "X Ads API reference — stats"
---

## Connector endpoint

- **Endpoint:** X Ads · `stats`
- **Default destination table:** `x_ads_stats`
- **Unique keys:** `id`, `date`, `placement`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. The unique identifier for the stats record. |
| `date` | STRING | PK. The date for which the statistics were collected. |
| `placement` | STRING | PK. The placement type (ALL_ON_TWITTER or PUBLISHER_NETWORK). |
| `impressions` | INTEGER | Number of impressions. |
| `tweets_send` | INTEGER | Number of tweets sent. |
| `billed_charge_local_micro` | INTEGER | Billed amount in micros. |
| `qualified_impressions` | INTEGER | Number of qualified impressions. |
| `follows` | INTEGER | Number of follows. |
| `app_clicks` | INTEGER | Number of app clicks. |
| `retweets` | INTEGER | Number of retweets. |
| `unfollows` | INTEGER | Number of unfollows. |
| `likes` | INTEGER | Number of likes. |
| `engagements` | INTEGER | Number of engagements. |
| `clicks` | INTEGER | Number of clicks. |
| `card_engagements` | INTEGER | Number of card engagements. |
| `poll_card_vote` | INTEGER | Number of poll card votes. |
| `replies` | INTEGER | Number of replies. |
| `url_clicks` | INTEGER | Number of URL clicks. |
| `billed_engagements` | INTEGER | Number of billed engagements. |
| `carousel_swipes` | INTEGER | Number of carousel swipes. |

# Example Questions

- What did each promoted tweet spend and return per day over the last 30 days?
- How do impressions, clicks and URL clicks compare between placements?
- Which promoted tweets have the lowest engagements per impression?

## Joins

- [Promoted Tweets](./promoted-tweets.md) — `id = id` [N:1] — The promoted tweet the daily row reports on.
  - Description: The promoted tweet the daily row reports on.
