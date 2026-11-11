---
title: "Promoted Tweets"
description: |
  One row per promoted tweet: the link that attaches a tweet to a line item. It holds the line item (`line_item_id`), the tweet (`tweet_id`), entity status, approval status, and created and updated times. It carries no text and no results.

  The connector does not ask for deleted promoted tweets, and the X Ads docs say promoted tweets under a deleted line item are only returned on request, so those are not in the table. The performance tables are built from this table's `id` values: Ad Performance and Ad Performance by Country join here on `id`, and `tweet_id` leads to the tweet text in Tweets: match it to Tweets' `tweet_id` or `id_str`, which are text like it.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/XAds/XAdsAPIReference/promotedTweetFields.js"
    title: "OWOX Data Marts X Ads connector — Promoted Tweets endpoint (`promoted_tweets`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/promoted-tweets"
    title: "X Ads API reference — Promoted Tweets"
---

## Connector endpoint

- **Endpoint:** X Ads · `promoted_tweets`
- **Default destination table:** `x_ads_promoted_tweets`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `line_item_id` | STRING | Line Item ID | ID of the parent line item FK to [Line Items](./line-items.md) |
| `id` | STRING | ID | PK. Unique identifier for the promoted tweet |
| `entity_status` | STRING | Entity Status | Status of the promoted tweet (e.g., ACTIVE, PAUSED) |
| `created_at` | DATETIME | Created At | Timestamp when the promoted tweet was created |
| `updated_at` | DATETIME | Updated At | Timestamp when the promoted tweet was last updated |
| `approval_status` | STRING | Approval Status | Approval status of the promoted tweet (e.g., ACCEPTED, REJECTED) |
| `tweet_id` | STRING | Tweet ID | ID of the original tweet FK to [Tweets](./tweets.md) |
| `deleted` | BOOLEAN | Deleted | Flag indicating whether the promoted tweet has been deleted |

# Example Questions

- How many promoted `tweets` does each `line item` have, and how many are paused?
- Which promoted `tweets` have an approval status other than accepted?
- Which `tweets` are promoted in more than one `line item`?

## Joins

- [Line Items](./line-items.md) — `line_item_id = id` [N:1] — The line item the tweet is promoted in.
  - [Line Item's Campaign](./campaigns.md) — The campaign of the line item this tweet is promoted in — its settings, not its results.
    - [Campaign's Account](./accounts.md) — The advertising account the tweet is promoted under; matched only when Campaigns was loaded with its `account_id` field.
- [Tweets](./tweets.md) — `tweet_id = tweet_id` [N:1] — The tweet being promoted, matched on its text ID.
  - [Tweet's Card](./all-cards.md) — The card attached to the tweet being promoted; empty when the tweet carries none.
