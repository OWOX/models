---
title: "Ad Groups"
description: |
  One row per ad group: its name, the campaign and ad account it sits in, configured and effective status, bid strategy, bid type and bid value, goal type and value, optimization goal, start and end time, schedule, targeting, and whether it belongs to a campaign-budget-optimization campaign. This is where targeting and bidding are set, so it is the level between a campaign and its ads.

  `bid_value` is the amount to pay in microcurrency per bidding event, so divide by 1 million to read it in currency units. [Ads](./ads.md) point to it with `ad_group_id`.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Reddit Ads connector — Ad Groups endpoint (`ad-group`)"
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20Ad%20Groups"
    title: "Reddit Ads API reference — List%20Ad%20Groups"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `ad-group`
- **Default destination table:** `reddit_ads_ad_group`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_account_id` | STRING | The ID of the ad account that the ad group belongs to. |
| `app_id` | STRING | The App ID of the app in the mobile app store (iOS App Store, Google Play Store). |
| `bid_strategy` | STRING | The bid strategy for the ad group. |
| `bid_type` | STRING | The bidding strategy for the ad group. |
| `bid_value` | INTEGER | The amount to pay in microcurrency per bidding event. |
| `campaign_id` | STRING | The ID of the campaign the ad group belongs to. |
| `campaign_objective_type` | STRING | The objective type of a campaign. |
| `configured_status` | STRING | The status of the ad group configured by the account owner. |
| `created_at` | STRING | The time that this entity was created, represented in ISO 8601. |
| `effective_status` | STRING | The effective status of the ad group in the system. |
| `end_time` | STRING | ISO 8601 timestamp when the ad group will stop delivering. |
| `goal_type` | STRING | The type of goal for the ad group. |
| `goal_value` | INTEGER | The value used to determine if the goal has been met. Measured in microcurrency for monetary goal types. |
| `id` | STRING | PK. The ID of the ad group. |
| `modified_at` | STRING | The last time that this entity was modified, represented in ISO 8601. |
| `name` | STRING | The name of the ad group. |
| `optimization_strategy_type` | STRING | Deprecated - The type of optimization strategy. |
| `optimization_goal` | STRING | The event you want to measure. Required for conversion and app install campaign objectives. |
| `product_set_id` | STRING | The product set to associate with this ad group. |
| `schedule` | STRING | A list of times to run the ad group. |
| `shopping_targeting` | STRING | A container for shopping ad tracking-related fields. |
| `shopping_type` | STRING | The type of ads an ad group should contain for shopping ads. |
| `skadnetwork_metadata` | STRING | Metadata about the SKAdNetwork source ID associated with the ad group. |
| `start_time` | STRING | ISO 8601 timestamp when the ad group will begin to deliver. |
| `targeting` | STRING | Targeting information for the ad group. |
| `is_campaign_budget_optimization` | BOOLEAN | Determines if the ad group belongs to a CBO (campaign-budget-optimization) campaign. |
| `view_through_conversion_type` | STRING | The type of view-through conversion being measured. |

# Example Questions

- How many ad groups does each campaign have, and how many are paused?
- Which ad groups use which bid strategy and bid type?
- Which ad groups start or end in the next 30 days?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = id` [N:1] — The campaign the ad group sits in.
  - Description: The campaign the ad group sits in.
