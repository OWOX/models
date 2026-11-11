---
title: "Ad Groups"
description: |
  One row per ad group: its name, the campaign it sits in (`campaign_id` and `campaign_name`), status, budget and budget mode, bid type and bid price, optimization goal and event, placements, and targeting such as gender, age groups, languages, locations and audience IDs. Several of these are lists stored as JSON.

  An ad group is the level that ads sit in, so this table is the bridge between a campaign and its ads. The targeted audience IDs in `audience_ids` are a list inside one column, so they do not join row by row to Custom Audiences.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/adGroupsFields.js"
    title: "OWOX Data Marts TikTok Ads connector — Ad Groups endpoint (`ad_groups`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs?id=1739314558673922"
    title: "TikTok Business API reference — Ad Groups"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `ad_groups`
- **Default destination table:** `tiktok_ads_ad_groups`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **TikTok Business API version:** v1.3
- **Unique keys:** `adgroup_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `adgroup_id` | STRING | Adgroup ID | PK. ID of the ad group. |
| `adgroup_name` | STRING | Adgroup Name | Ad Group Name |
| `advertiser_id` | STRING | Advertiser ID | ID of the advertiser account the row belongs to. |
| `campaign_id` | STRING | Campaign ID | ID of the campaign. FK to [Campaigns](./campaigns.md) |
| `campaign_name` | STRING | Campaign Name | Name of the campaign the row belongs to. |
| `operation_status` | STRING | Operation Status | The on or off status the advertiser set; the delivery status is in `secondary_status`. |
| `budget` | FLOAT | Budget | Ad Group Budget |
| `budget_mode` | STRING | Budget Mode | Budget Mode (BUDGET_MODE_DAY or BUDGET_MODE_TOTAL) |
| `bid_type` | STRING | Bid Type | Bidding Type |
| `bid_price` | FLOAT | Bid Price | The ad group's bid price. |
| `optimization_goal` | STRING | Optimization Goal | What the ad group optimizes delivery for, such as clicks, reach or conversions. |
| `optimization_event` | STRING | Optimization Event | The conversion event the ad group optimizes for. |
| `app_id` | STRING | App ID | ID of the app being promoted |
| `app_type` | STRING | App Type | Type of the app the ad group promotes. |
| `audience_type` | STRING | Audience Type | Type of audience |
| `audience_ids` | STRING | Audience IDs | List of audience IDs. Stored as a JSON string. |
| `excluded_audience_ids` | STRING | Excluded Audience IDs | List of excluded audience IDs. Stored as a JSON string. |
| `gender` | STRING | Gender | Target gender |
| `age_groups` | STRING | Age Groups | Target age groups. Stored as a JSON string. |
| `languages` | STRING | Languages | Target languages. Stored as a JSON string. |
| `location_ids` | STRING | Location IDs | Target location IDs. Stored as a JSON string. |
| `interest_category_ids` | STRING | Interest Category IDs | IDs of the interest categories the ad group targets. Stored as a JSON string. |
| `placements` | STRING | Placements | Ad placements. Stored as a JSON string. |
| `placement_type` | STRING | Placement Type | Type of placement |
| `schedule_start_time` | DATETIME | Schedule Start Time | When the ad group's delivery schedule starts. |
| `schedule_end_time` | DATETIME | Schedule End Time | When the ad group's delivery schedule ends. |
| `schedule_type` | STRING | Schedule Type | Type of schedule |
| `frequency` | INTEGER | Frequency | Frequency cap |
| `billing_event` | STRING | Billing Event | Billing Event Type |
| `conversion_id` | STRING | Conversion ID | ID of the conversion set on the ad group. |
| `conversion_bid_price` | FLOAT | Conversion Bid Price | The bid per conversion set on the ad group. |
| `conversion_window` | INTEGER | Conversion Window | The conversion window set on the ad group. |
| `click_attribution_window` | INTEGER | Click Attribution Window | The ad group's click-through attribution window: how long after a click a conversion is credited to the ad. |
| `view_attribution_window` | INTEGER | View Attribution Window | The ad group's view-through attribution window: how long after an ad view a conversion is credited to the ad. |
| `is_smart_performance_campaign` | BOOLEAN | Is Smart Performance Campaign | Flag indicating if the ad group uses smart performance optimization |
| `is_new_structure` | BOOLEAN | Is New Structure | Flag indicating if the ad group utilizes a new structure |
| `auto_targeting_enabled` | BOOLEAN | Auto Targeting Enabled | Flag indicating if auto targeting is enabled |
| `targeting_expansion` | STRING | Targeting Expansion | Targeting expansion settings. Stored as a JSON string. |
| `device_price_ranges` | STRING | Device Price Ranges | Target device price ranges. Stored as a JSON string. |
| `device_model_ids` | STRING | Device Model IDs | Target device model IDs. Stored as a JSON string. |
| `operating_systems` | STRING | Operating Systems | Target operating systems. Stored as a JSON string. |
| `network_types` | STRING | Network Types | Target network types. Stored as a JSON string. |
| `carrier_ids` | STRING | Carrier IDs | Target carrier IDs. Stored as a JSON string. |
| `create_time` | DATETIME | Create Time | Creation Time |
| `modify_time` | DATETIME | Modify Time | Last Modified Time |

# Example Questions

- How many ad groups does each `campaign` have, and how many are paused?
- Which optimization goals and bid types does each `campaign` use?
- Which ad groups have a schedule that has already ended?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = campaign_id` [N:1] — The campaign the ad group sits in.
  - [Campaign's Advertiser Account](./advertiser-account.md) — The advertiser account the ad group's campaign belongs to.
