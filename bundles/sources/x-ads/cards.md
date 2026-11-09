---
title: "Cards"
description: |
  One row per website or app card: its ID, name, card type, card URI, created and updated times, whether it is deleted, and its components (media and buttons) as JSON. A card is the link preview attached to a tweet.

  For the full creative detail of the cards attached to your tweets, such as title and destination URL, use All Cards.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/XAds/XAdsAPIReference/XAdsFieldsSchema.js"
    title: "OWOX Data Marts X Ads connector — Cards endpoint (`cards`)"
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/cards"
    title: "X Ads API reference — cards"
---

## Connector endpoint

- **Endpoint:** X Ads · `cards`
- **Default destination table:** `x_ads_cards`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. The unique identifier for the card. |
| `name` | STRING | Name | The name of the card. |
| `card_type` | STRING | Card Type | Type of the card. |
| `card_uri` | STRING | Card Uri | URI of the card. |
| `created_at` | DATETIME | Created at | When the card was created. |
| `updated_at` | DATETIME | Updated at | When the card was last updated. |
| `deleted` | BOOLEAN | Deleted | Whether the card is deleted. |
| `components` | JSON | Components | Card components including media and buttons. |

# Example Questions

- How many cards of each card type exist?
- Which cards were created in the last 90 days?
- Which cards are marked as deleted?
