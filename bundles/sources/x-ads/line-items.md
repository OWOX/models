---
title: "Line Items"
description: |
  One row per line item, the X name for an ad group: its name and the campaign it sits in (`campaign_id`), goal and objective, product type, placements, bid strategy and bid amount, target CPA, daily and total budget, start and end time, payment basis (`pay_by`), currency, frequency cap and entity status. Bid and budget amounts are in micros.

  A line item pulls together the bid, the tweet to promote and the targeting. Its promoted tweets are in Promoted Tweets, which joins here on `line_item_id`.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/XAds/XAdsAPIReference/XAdsFieldsSchema.js"
    title: "OWOX Data Marts X Ads connector — Line Items endpoint (`line_items`)"
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/line-items"
    title: "X Ads API reference — line-items"
---

## Connector endpoint

- **Endpoint:** X Ads · `line_items`
- **Default destination table:** `x_ads_line_items`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `advertiser_user_id` | STRING | ID of the advertiser user |
| `name` | STRING | Name of the line item |
| `placements` | JSON | List of placement targets (e.g. ALL_ON_TWITTER) |
| `start_time` | DATETIME | Line item start time |
| `bid_amount_local_micro` | INTEGER | Bid amount in micro-currency units |
| `advertiser_domain` | STRING | Domain of the advertiser |
| `target_cpa_local_micro` | INTEGER | Target CPA (cost per action) in micro-currency units |
| `primary_web_event_tag` | STRING | Primary web event tag identifier |
| `goal` | STRING | Line item goal/objective (e.g. APP_INSTALLS) |
| `daily_budget_amount_local_micro` | INTEGER | Daily budget in micro-currency units |
| `product_type` | STRING | Product type (e.g. PROMOTED_TWEETS) |
| `end_time` | DATETIME | Line item end time (nullable) |
| `funding_instrument_id` | STRING | ID of the funding instrument |
| `bid_strategy` | STRING | Bidding strategy (e.g. AUTO) |
| `duration_in_days` | INTEGER | Duration in days (nullable) |
| `standard_delivery` | BOOLEAN | Whether standard delivery is enabled |
| `total_budget_amount_local_micro` | INTEGER | Total budget in micro-currency units (nullable) |
| `objective` | STRING | Campaign objective (duplicate of goal in some APIs) |
| `id` | STRING | PK. Unique identifier of the line item |
| `entity_status` | STRING | Status of the line item (e.g. ACTIVE, PAUSED) |
| `automatic_tweet_promotion` | BOOLEAN | Whether automatic tweet promotion is enabled |
| `frequency_cap` | INTEGER | Frequency cap for ad serving |
| `android_app_store_identifier` | STRING | Android app store identifier |
| `categories` | JSON | Array of category labels |
| `currency` | STRING | Currency code (e.g. USD) |
| `pay_by` | STRING | Payment method (e.g. IMPRESSION) |
| `created_at` | DATETIME | Timestamp when the line item was created |
| `ios_app_store_identifier` | STRING | iOS app store identifier |
| `updated_at` | DATETIME | Timestamp when the line item was last updated |
| `campaign_id` | STRING | ID of the parent campaign |
| `creative_source` | STRING | Source of the creative (e.g. MANUAL) |
| `audience_expansion` | STRING | Audience expansion setting (e.g. EXPANDED) |
| `deleted` | BOOLEAN | Whether the line item is marked as deleted |

# Example Questions

- How many line items does each campaign have, and how many are paused?
- Which line items use each bid strategy and goal?
- Which line items have an end time that has already passed but are still active?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = id` [N:1] — The campaign the line item sits in.
  - Description: The campaign the line item sits in.
