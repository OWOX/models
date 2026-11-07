---
title: "Ad Groups"
description: |
  One row per ad group: its name, the campaign it sits in (`campaign_id` and `campaign_name`), status, budget and budget mode, bid type and bid price, optimization goal and event, placements, and targeting such as gender, age groups, languages, locations and audience IDs. Several of these are lists stored as JSON.

  An ad group is the level that ads sit in, so this table is the bridge between a campaign and its ads. The targeted audience IDs in `audience_ids` are a list inside one column, so they do not join row by row to Custom Audiences.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/TikTokAdsFieldsSchema.js"
    title: "OWOX Data Marts TikTok Ads connector — Ad Groups endpoint (`ad_groups`)"
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs?id=1739314558673922"
    title: "TikTok Business API reference — docs?id=1739314558673922"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `ad_groups`
- **Default destination table:** `tiktok_ads_ad_groups`
- **Unique keys:** `adgroup_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `adgroup_id` | STRING | PK. Ad Group ID |
| `adgroup_name` | STRING | Ad Group Name |
| `advertiser_id` | STRING | Advertiser ID |
| `campaign_id` | STRING | Campaign ID |
| `campaign_name` | STRING | Campaign Name |
| `operation_status` | STRING | Operation Status |
| `budget` | NUMERIC | Ad Group Budget |
| `budget_mode` | STRING | Budget Mode (BUDGET_MODE_DAY or BUDGET_MODE_TOTAL) |
| `bid_type` | STRING | Bidding Type |
| `bid_price` | NUMERIC | Bid Price |
| `optimization_goal` | STRING | Optimization Goal |
| `optimization_event` | STRING | Optimization Event |
| `app_id` | STRING | ID of the app being promoted |
| `app_type` | STRING | Type of app |
| `audience_type` | STRING | Type of audience |
| `audience_ids` | JSON | List of audience IDs |
| `excluded_audience_ids` | JSON | List of excluded audience IDs |
| `gender` | STRING | Target gender |
| `age_groups` | JSON | Target age groups |
| `languages` | JSON | Target languages |
| `location_ids` | JSON | Target location IDs |
| `interest_category_ids` | JSON | Interest category IDs |
| `placements` | JSON | Ad placements |
| `placement_type` | STRING | Type of placement |
| `schedule_start_time` | DATETIME | Schedule Start Time |
| `schedule_end_time` | DATETIME | Schedule End Time |
| `schedule_type` | STRING | Type of schedule |
| `frequency` | INTEGER | Frequency cap |
| `billing_event` | STRING | Billing Event Type |
| `conversion_id` | STRING | Conversion ID |
| `conversion_bid_price` | NUMERIC | Conversion Bid Price |
| `conversion_window` | INTEGER | Conversion Window |
| `click_attribution_window` | INTEGER | Click Attribution Window |
| `view_attribution_window` | INTEGER | View Attribution Window |
| `is_smart_performance_campaign` | BOOLEAN | Flag indicating if the ad group uses smart performance optimization |
| `is_new_structure` | BOOLEAN | Flag indicating if the ad group utilizes a new structure |
| `auto_targeting_enabled` | BOOLEAN | Flag indicating if auto targeting is enabled |
| `targeting_expansion` | JSON | Targeting expansion settings |
| `device_price_ranges` | JSON | Target device price ranges |
| `device_model_ids` | JSON | Target device model IDs |
| `operating_systems` | JSON | Target operating systems |
| `network_types` | JSON | Target network types |
| `carrier_ids` | JSON | Target carrier IDs |
| `create_time` | DATETIME | Creation Time |
| `modify_time` | DATETIME | Last Modified Time |

# Example Questions

- How many ad groups does each campaign have, and how many are paused?
- Which optimization goals and bid types does each campaign use?
- Which ad groups have a schedule that has already ended?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = campaign_id` [N:1] — The campaign the ad group sits in.
  - Description: The campaign the ad group sits in.
