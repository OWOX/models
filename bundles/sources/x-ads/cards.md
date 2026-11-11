---
title: "Cards"
description: |
  One row per website or app card: its ID, name, card type, card URI, created and updated times, whether it is deleted, and its components (media and buttons) as JSON. A card is the link preview attached to a tweet.

  For the full creative detail of the cards attached to your tweets, such as title and destination URL, use [All Cards](./all-cards.md), which each card here joins to on `id`.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/XAds/XAdsAPIReference/cardFields.js"
    title: "OWOX Data Marts X Ads connector — Cards endpoint (`cards`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/cards"
    title: "X Ads API reference — Cards"
---

## Connector endpoint

- **Endpoint:** X Ads · `cards`
- **Default destination table:** `x_ads_cards`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. The unique identifier for the card. FK to [All Cards](./all-cards.md) |
| `name` | STRING | Name | The name of the card. |
| `card_type` | STRING | Card Type | Type of the card. |
| `card_uri` | STRING | Card URI | URI of the card. |
| `created_at` | DATETIME | Created At | When the card was created. |
| `updated_at` | DATETIME | Updated At | When the card was last updated. |
| `deleted` | BOOLEAN | Deleted | Whether the card is deleted. |
| `components` | STRING | Components | Card components including media and buttons. Stored as a JSON string. |

# Example Questions

- How many cards of each card type exist?
- Which cards were created in the last 90 days?
- Which cards are marked as deleted?

## Joins

- [All Cards](./all-cards.md) — `id = id` [1:1] — The same card; All Cards holds only cards on loaded tweets.
