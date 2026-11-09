---
title: "Campaigns"
description: |
  One row per campaign: its name, objective and objective type, campaign type, operation and secondary status, budget and budget mode, bid type, and create and modify times. It holds settings, not results; spend and clicks are in Ad Performance, which reaches a campaign through Ads and Ad Groups.

  The connector's Include Deleted setting is off by default; when it is on, campaigns in every status are requested. Join it to Advertiser Account on `advertiser_id` for the account name.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/TikTokAdsFieldsSchema.js"
    title: "OWOX Data Marts TikTok Ads connector — Campaigns endpoint (`campaigns`)"
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs?id=1739318962329602"
    title: "TikTok Business API reference — docs?id=1739318962329602"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `campaigns`
- **Default destination table:** `tiktok_ads_campaigns`
- **Unique keys:** `campaign_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `advertiser_id` | STRING | Advertiser ID | Advertiser ID |
| `campaign_id` | STRING | Campaign ID | PK. Campaign ID |
| `campaign_name` | STRING | Campaign Name | Campaign Name |
| `app_promotion_type` | STRING | App Promotion Type | Type of app promotion being used in the campaign |
| `operation_status` | STRING | Operation Status | Operation Status |
| `bid_type` | STRING | Bid Type | Type of bid strategy being used in the campaign |
| `roas_bid` | NUMERIC | ROAS Bid | Return on ad spend bid target |
| `is_advanced_dedicated_campaign` | BOOLEAN | Is Advanced Dedicated Campaign | Flag indicating if this is an advanced dedicated campaign |
| `is_search_campaign` | BOOLEAN | Is Search Campaign | Flag indicating if the campaign is for search ads |
| `rf_campaign_type` | STRING | Rf Campaign Type | Reach and frequency campaign type |
| `rta_bid_enabled` | BOOLEAN | Rta Bid Enabled | Flag indicating if RTA bidding is enabled |
| `secondary_status` | STRING | Secondary Status | Additional status information of the campaign |
| `postback_window_mode` | STRING | Postback Window Mode | Mode for the postback window |
| `disable_skan_campaign` | BOOLEAN | Disable Skan Campaign | Flag indicating if SKAdNetwork is disabled for the campaign |
| `budget_optimize_on` | BOOLEAN | Budget Optimize on | The metric or event that the budget optimization is based on |
| `budget_mode` | STRING | Budget Mode | Budget Mode (BUDGET_MODE_DAY or BUDGET_MODE_TOTAL) |
| `objective` | STRING | Objective | Campaign Objective |
| `campaign_product_source` | STRING | Campaign Product Source | Source of products for the campaign |
| `optimization_goal` | STRING | Optimization Goal | Specific goal to be optimized for in the campaign |
| `special_industries` | STRING | Special Industries | Special industries classification for the campaign |
| `deep_bid_type` | STRING | Deep Bid Type | Type of deep bidding strategy |
| `rta_id` | STRING | Rta ID | Real-time advertising ID |
| `rta_product_selection_enabled` | BOOLEAN | Rta Product Selection Enabled | Flag indicating if RTA product selection is enabled |
| `budget` | NUMERIC | Budget | Campaign Budget |
| `is_new_structure` | BOOLEAN | Is New Structure | Flag indicating if the campaign utilizes a new campaign structure |
| `is_smart_performance_campaign` | BOOLEAN | Is Smart Performance Campaign | Flag indicating if the campaign uses smart performance optimization |
| `modify_time` | DATETIME | Modify Time | Last Modified Time |
| `app_id` | STRING | App ID | ID of the app being promoted |
| `objective_type` | STRING | Objective Type | Type of objective selected for the campaign (e.g., brand awareness, app installs) |
| `campaign_type` | STRING | Campaign Type | Type of campaign (e.g., awareness, conversion) |
| `campaign_app_profile_page_state` | STRING | Campaign App Profile Page State | App profile page state for app campaigns |
| `create_time` | DATETIME | Create Time | Creation Time |
| `catalog_enabled` | BOOLEAN | Catalog Enabled | Flag indicating if product catalog is enabled |
| `bid_align_type` | STRING | Bid Align Type | Type of bid alignment |

# Example Questions

- How many campaigns does each objective type have, and how many are currently enabled?
- Which campaigns have a daily budget and which have a total budget?
- Which campaigns were modified in the last 30 days?

## Joins

- [Advertiser Account](./advertiser-account.md) — `advertiser_id = advertiser_id` [N:1] — The advertiser account the campaign belongs to.
  - Description: The advertiser account the campaign belongs to.
