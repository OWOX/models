---
title: "Ad Groups"
description: |
  One row per ad group: its name, the campaign and ad account it sits in, configured and effective status, bid strategy, bid type and bid value, goal type and value, optimization goal, start and end time, schedule, targeting, and whether it belongs to a campaign-budget-optimization campaign. This is where targeting and bidding are set, so it is the level between a campaign and its ads.

  `bid_value` is the amount to pay in microcurrency per bidding event, so divide by 1 million to read it in currency units. [Ads](./ads.md) point to it with `ad_group_id`.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/ad-group.js"
    title: "OWOX Data Marts Reddit Ads connector — Ad Groups endpoint (`ad-group`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20Ad%20Groups"
    title: "Reddit Ads API reference — Ad Groups"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `ad-group`
- **Default destination table:** `reddit_ads_ad_group`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Reddit Ads API version:** v3
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_account_id` | STRING | Ad Account ID | The ID of the ad account that the ad group belongs to. |
| `app_id` | STRING | App ID | The App ID of the app in the mobile app store (iOS App Store, Google Play Store). |
| `bid_strategy` | STRING | Bid Strategy | The bid strategy for the ad group. |
| `bid_type` | STRING | Bid Type | The bidding strategy for the ad group. |
| `bid_value` | INTEGER | Bid Value | The amount to pay in microcurrency per bidding event. |
| `campaign_id` | STRING | Campaign ID | The ID of the campaign the ad group belongs to. FK to [Campaigns](./campaigns.md) |
| `campaign_objective_type` | STRING | Campaign Objective Type | The objective type of a campaign. |
| `configured_status` | STRING | Configured Status | The status of the ad group configured by the account owner. |
| `created_at` | STRING | Created At | The time that this entity was created, represented in ISO 8601. |
| `effective_status` | STRING | Effective Status | The effective status of the ad group in the system. |
| `end_time` | STRING | End Time | ISO 8601 timestamp when the ad group will stop delivering. |
| `goal_type` | STRING | Goal Type | The type of goal for the ad group. |
| `goal_value` | INTEGER | Goal Value | The value used to determine if the goal has been met. Measured in microcurrency for monetary goal types. |
| `id` | STRING | ID | PK. The ID of the ad group. |
| `modified_at` | STRING | Modified At | The last time that this entity was modified, represented in ISO 8601. |
| `name` | STRING | Name | The name of the ad group. |
| `optimization_strategy_type` | STRING | Optimization Strategy Type | Deprecated - The type of optimization strategy. |
| `optimization_goal` | STRING | Optimization Goal | The event you want to measure. Required for conversion and app install campaign objectives. |
| `product_set_id` | STRING | Product Set ID | The product set to associate with this ad group. |
| `schedule` | STRING | Schedule | A list of times to run the ad group. |
| `shopping_targeting` | STRING | Shopping Targeting | A container for shopping ad tracking-related fields. |
| `shopping_type` | STRING | Shopping Type | The type of ads an ad group should contain for shopping ads. |
| `skadnetwork_metadata` | STRING | Skadnetwork Metadata | Metadata about the SKAdNetwork source ID associated with the ad group. |
| `start_time` | STRING | Start Time | ISO 8601 timestamp when the ad group will begin to deliver. |
| `targeting` | STRING | Targeting | Targeting information for the ad group. |
| `is_campaign_budget_optimization` | BOOLEAN | Is Campaign Budget Optimization | Determines if the ad group belongs to a CBO (campaign-budget-optimization) campaign. |
| `view_through_conversion_type` | STRING | View Through Conversion Type | The type of view-through conversion being measured. |

# Example Questions

- How many ad groups does each `campaign` have, and how many are paused?
- Which ad groups use which bid strategy and bid type?
- Which ad groups start or end in the next 30 days?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = id` [N:1] — The campaign the ad group sits in.
  - [Campaign's Ad Account](./ad-account.md) — The ad account that owns the ad group's campaign.
    - [Campaign's Account Contact](./ad-account-user.md) — The primary contact of the ad group's account, found only when it is the authenticated member.
  - [Campaign's Funding Instrument](./funding-instruments.md) — The payment method the ad group's campaign spends against.
