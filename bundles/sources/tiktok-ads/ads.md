---
title: "Ads"
description: |
  One row per ad: its name and status, the campaign and ad group it belongs to (`campaign_id`, `adgroup_id` and their names), and the creative: creative type, ad format, ad text, call to action, video and image IDs, landing page URL, deep link and tracking URLs. It holds settings, not results; daily numbers are in Ad Performance, which joins here on `ad_id`.

  The connector's Include Deleted setting is off by default, so deleted ads are not loaded unless it is turned on. Join it to Ad Groups on `adgroup_id` for the ad group's bids and targeting.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/TikTokAdsFieldsSchema.js"
    title: "OWOX Data Marts TikTok Ads connector — Ads endpoint (`ads`)"
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs?id=1735735588640770"
    title: "TikTok Business API reference — docs?id=1735735588640770"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `ads`
- **Default destination table:** `tiktok_ads_ads`
- **Unique keys:** `ad_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_id` | STRING | PK. Ad ID |
| `ad_name` | STRING | Ad Name |
| `advertiser_id` | STRING | Advertiser ID |
| `campaign_id` | STRING | Campaign ID |
| `campaign_name` | STRING | Campaign Name |
| `adgroup_id` | STRING | Ad Group ID |
| `adgroup_name` | STRING | Ad Group Name |
| `operation_status` | STRING | Operation Status |
| `secondary_status` | STRING | Secondary Status |
| `create_time` | DATETIME | Creation Time |
| `modify_time` | DATETIME | Last Modified Time |
| `ad_text` | STRING | Ad Text/Caption |
| `ad_texts` | JSON | Multiple Ad Text Variations |
| `call_to_action` | STRING | Call To Action Text |
| `call_to_action_id` | STRING | Call To Action ID |
| `image_ids` | JSON | Image IDs Used in the Ad |
| `video_id` | STRING | Video ID Used in the Ad |
| `image_mode` | STRING | Image Display Mode |
| `creative_type` | STRING | Type of Creative (video, image, etc.) |
| `ad_format` | STRING | Format of the Ad |
| `landing_page_url` | STRING | Landing Page URL |
| `landing_page_urls` | JSON | Multiple Landing Page URLs |
| `deeplink` | STRING | Deep Link URL |
| `deeplink_type` | STRING | Type of Deep Link |
| `tracking_pixel_id` | STRING | Pixel ID for Tracking |
| `impression_tracking_url` | STRING | URL for Impression Tracking |
| `click_tracking_url` | STRING | URL for Click Tracking |
| `video_view_tracking_url` | STRING | URL for Video View Tracking |
| `is_new_structure` | BOOLEAN | Flag indicating new ad structure |
| `is_aco` | BOOLEAN | Flag indicating Automated Creative Opt. |
| `optimization_event` | STRING | Event being optimized for |
| `catalog_id` | STRING | Product Catalog ID |
| `product_set_id` | STRING | Product Set ID |
| `sku_ids` | JSON | SKU IDs for Products |
| `domain` | STRING | Domain for the Ad |
| `display_name` | STRING | Display Name shown in the Ad |
| `profile_image_url` | STRING | URL for Profile Image |
| `app_name` | STRING | Name of the App being promoted |
| `tracking_app_id` | STRING | App ID for Tracking |
| `identity_id` | STRING | Identity ID |
| `identity_type` | STRING | Type of Identity |
| `page_id` | STRING | TikTok Page ID |
| `tiktok_item_id` | STRING | TikTok Item ID |
| `disclaimer_type` | STRING | Type of Disclaimer |
| `disclaimer_text` | STRING | Disclaimer Text |
| `utm_params` | JSON | UTM Parameters |

# Example Questions

- How many ads of each creative type does each ad group run?
- Which landing pages are used by the most ads?
- Which ads have a call to action set, and which do not?

## Joins

- [Ad Groups](./ad-groups.md) — `adgroup_id = adgroup_id` [N:1] — The ad group the ad belongs to.
  - Description: The ad group the ad belongs to.
