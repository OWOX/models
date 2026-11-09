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

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `adgroup_id` | STRING | Adgroup ID | PK. Ad Group ID |
| `adgroup_name` | STRING | Adgroup Name | Ad Group Name |
| `advertiser_id` | STRING | Advertiser ID | Advertiser ID |
| `campaign_id` | STRING | Campaign ID | Campaign ID |
| `campaign_name` | STRING | Campaign Name | Campaign Name |
| `operation_status` | STRING | Operation Status | Operation Status |
| `budget` | NUMERIC | Budget | Ad Group Budget |
| `budget_mode` | STRING | Budget Mode | Budget Mode (BUDGET_MODE_DAY or BUDGET_MODE_TOTAL) |
| `bid_type` | STRING | Bid Type | Bidding Type |
| `bid_price` | NUMERIC | Bid Price | Bid Price |
| `optimization_goal` | STRING | Optimization Goal | Optimization Goal |
| `optimization_event` | STRING | Optimization Event | Optimization Event |
| `app_id` | STRING | App ID | ID of the app being promoted |
| `app_type` | STRING | App Type | Type of app |
| `audience_type` | STRING | Audience Type | Type of audience |
| `audience_ids` | JSON | Audience IDs | List of audience IDs |
| `excluded_audience_ids` | JSON | Excluded Audience IDs | List of excluded audience IDs |
| `gender` | STRING | Gender | Target gender |
| `age_groups` | JSON | Age Groups | Target age groups |
| `languages` | JSON | Languages | Target languages |
| `location_ids` | JSON | Location IDs | Target location IDs |
| `interest_category_ids` | JSON | Interest Category IDs | Interest category IDs |
| `placements` | JSON | Placements | Ad placements |
| `placement_type` | STRING | Placement Type | Type of placement |
| `schedule_start_time` | DATETIME | Schedule Start Time | Schedule Start Time |
| `schedule_end_time` | DATETIME | Schedule End Time | Schedule End Time |
| `schedule_type` | STRING | Schedule Type | Type of schedule |
| `frequency` | INTEGER | Frequency | Frequency cap |
| `billing_event` | STRING | Billing Event | Billing Event Type |
| `conversion_id` | STRING | Conversion ID | Conversion ID |
| `conversion_bid_price` | NUMERIC | Conversion Bid Price | Conversion Bid Price |
| `conversion_window` | INTEGER | Conversion Window | Conversion Window |
| `click_attribution_window` | INTEGER | Click Attribution Window | Click Attribution Window |
| `view_attribution_window` | INTEGER | View Attribution Window | View Attribution Window |
| `is_smart_performance_campaign` | BOOLEAN | Is Smart Performance Campaign | Flag indicating if the ad group uses smart performance optimization |
| `is_new_structure` | BOOLEAN | Is New Structure | Flag indicating if the ad group utilizes a new structure |
| `auto_targeting_enabled` | BOOLEAN | Auto Targeting Enabled | Flag indicating if auto targeting is enabled |
| `targeting_expansion` | JSON | Targeting Expansion | Targeting expansion settings |
| `device_price_ranges` | JSON | Device Price Ranges | Target device price ranges |
| `device_model_ids` | JSON | Device Model IDs | Target device model IDs |
| `operating_systems` | JSON | Operating Systems | Target operating systems |
| `network_types` | JSON | Network Types | Target network types |
| `carrier_ids` | JSON | Carrier IDs | Target carrier IDs |
| `create_time` | DATETIME | Create Time | Creation Time |
| `modify_time` | DATETIME | Modify Time | Last Modified Time |

# Example Questions

- How many ad groups does each campaign have, and how many are paused?
- Which optimization goals and bid types does each campaign use?
- Which ad groups have a schedule that has already ended?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = campaign_id` [N:1] — The campaign the ad group sits in.
  - Description: The campaign the ad group sits in.
