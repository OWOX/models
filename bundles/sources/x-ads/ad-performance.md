---
title: "Ad Performance"
description: |
  Daily performance of promoted tweets: impressions, clicks, URL clicks, engagements, billed engagements, billed charge (`billed_charge_local_micro`, spend in micros), and social actions such as likes, reposts, replies and follows. One row per promoted tweet (`id`) per `date` and `placement`; the connector requests ALL_ON_TWITTER and PUBLISHER_NETWORK.

  The connector requests the engagement and billing metric groups, and stores a metric the API does not return as 0, so a 0 can mean not reported. The `id` is a promoted tweet ID, not a tweet ID: join it to Promoted Tweets on `id`, then to Line Items for the line item.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/XAds/XAdsAPIReference/statsFields.js"
    title: "OWOX Data Marts X Ads connector — Ad Performance endpoint (`stats`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/stats"
    title: "X Ads API reference — Ad Performance"
---

## Connector endpoint

- **Endpoint:** X Ads · `stats`
- **Default destination table:** `x_ads_stats`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Unique keys:** `id`, `date`, `placement`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. The unique identifier for the stats record. FK to [Promoted Tweets](./promoted-tweets.md) |
| `date` | STRING | Date | PK. The date for which the statistics were collected. |
| `placement` | STRING | Placement | PK. The placement type (ALL_ON_TWITTER or PUBLISHER_NETWORK). |
| `impressions` | INTEGER | Impressions | Times the promoted tweet was shown; X's engagement, click and follow rates divide by it. |
| `tweets_send` | INTEGER | Tweets Send | Number of tweets sent. |
| `billed_charge_local_micro` | INTEGER | Billed Charge Local Micro | Billed amount in micros. |
| `qualified_impressions` | INTEGER | Qualified Impressions | Qualified impressions of the promoted tweet; X's qualified impression rate is this divided by `impressions`. |
| `follows` | INTEGER | Follows | Follows that came from the promoted tweet; X's cost per follow is `billed_charge_local_micro` divided by this. |
| `app_clicks` | INTEGER | App Clicks | App install or app open attempts from the promoted tweet. |
| `retweets` | INTEGER | Retweets | Reposts (retweets) of the promoted tweet. |
| `unfollows` | INTEGER | Unfollows | Unfollows; the current X Ads metrics table no longer lists it, and X's example responses return it as null. |
| `likes` | INTEGER | Likes | Likes on the promoted tweet. |
| `engagements` | INTEGER | Engagements | Engagements with the promoted tweet as X sums them (clicks, replies, reposts, follows and more); X's engagement rate is this divided by `impressions`. |
| `clicks` | INTEGER | Clicks | Clicks on the promoted tweet, including likes (favorites) and other engagements, per X; `url_clicks` counts only link clicks. |
| `card_engagements` | INTEGER | Card Engagements | Engagements with the card attached to the promoted tweet. |
| `poll_card_vote` | INTEGER | Poll Card Vote | Number of poll card votes. |
| `replies` | INTEGER | Replies | Replies to the promoted tweet. |
| `url_clicks` | INTEGER | URL Clicks | Clicks on the link or Website Card in the ad, including earned clicks. |
| `billed_engagements` | INTEGER | Billed Engagements | Engagements X billed, from its BILLING metric group, as opposed to all `engagements`. |
| `carousel_swipes` | INTEGER | Carousel Swipes | Swipes on carousel images or videos. |

# Example Questions

- What did each `promoted tweet` spend and return per day over the last 30 days?
- How do impressions, clicks and URL clicks compare between placements?
- Which `promoted tweets` have the lowest engagements per impression?

## Joins

- [Promoted Tweets](./promoted-tweets.md) — `id = id` [N:1] — The promoted tweet the daily row reports on.
  - [Promoted Tweet's Line Item](./line-items.md) — The line item — bid, budget and targeting — the promoted tweet behind this row runs in.
    - [Line Item's Campaign](./campaigns.md) — The campaign of the promoted tweet's line item — its settings, not its results.
      - [Campaign's Account](./accounts.md) — The advertising account of this row's campaign; matched only when Campaigns was loaded with its `account_id` field.
  - [Tweet Behind This Row](./tweets.md) — The tweet behind this row, with its text; only promoted-only tweets are loaded, so an organic tweet finds no match.
    - [Tweet's Card](./all-cards.md) — The card attached to the promoted tweet — title and destination URL; empty when the tweet carries none.
