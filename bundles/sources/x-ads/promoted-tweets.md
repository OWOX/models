---
title: "Promoted Tweets"
description: |
  One row per promoted tweet: the link that attaches a tweet to a line item. It holds the line item (`line_item_id`), the tweet (`tweet_id`), entity status, approval status, and created and updated times. It carries no text and no results.

  The connector does not ask for deleted promoted tweets, and the X Ads docs say promoted tweets under a deleted line item are only returned on request, so those are not in the table. The performance tables are built from this table's `id` values: Ad Performance and Ad Performance by Country join here on `id`, and `tweet_id` leads to the tweet text in Tweets.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/XAds/XAdsAPIReference/XAdsFieldsSchema.js"
    title: "OWOX Data Marts X Ads connector — Promoted Tweets endpoint (`promoted_tweets`)"
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/promoted-tweets"
    title: "X Ads API reference — promoted-tweets"
---

## Connector endpoint

- **Endpoint:** X Ads · `promoted_tweets`
- **Default destination table:** `x_ads_promoted_tweets`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `line_item_id` | STRING | ID of the parent line item |
| `id` | STRING | PK. Unique identifier for the promoted tweet |
| `entity_status` | STRING | Status of the promoted tweet (e.g., ACTIVE, PAUSED) |
| `created_at` | DATETIME | Timestamp when the promoted tweet was created |
| `updated_at` | DATETIME | Timestamp when the promoted tweet was last updated |
| `approval_status` | STRING | Approval status of the promoted tweet (e.g., ACCEPTED, REJECTED) |
| `tweet_id` | STRING | ID of the original tweet |
| `deleted` | BOOLEAN | Flag indicating whether the promoted tweet has been deleted |

# Example Questions

- How many promoted tweets does each line item have, and how many are paused?
- Which promoted tweets have an approval status other than accepted?
- Which tweets are promoted in more than one line item?

## Joins

- [Line Items](./line-items.md) — `line_item_id = id` [N:1] — The line item the tweet is promoted in.
  - Description: The line item the tweet is promoted in.
- [Tweets](./tweets.md) — `tweet_id = id` [N:1] — The tweet that is promoted; tweet_id is text and the tweet id is a number, so cast one side.
  - Description: The tweet that is promoted; tweet_id is text and the tweet id is a number, so cast one side.
