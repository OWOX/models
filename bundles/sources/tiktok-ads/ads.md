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

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_id` | STRING | Ad ID | PK. Ad ID |
| `ad_name` | STRING | Ad Name | Ad Name |
| `advertiser_id` | STRING | Advertiser ID | Advertiser ID |
| `campaign_id` | STRING | Campaign ID | Campaign ID |
| `campaign_name` | STRING | Campaign Name | Campaign Name |
| `adgroup_id` | STRING | Adgroup ID | Ad Group ID |
| `adgroup_name` | STRING | Adgroup Name | Ad Group Name |
| `operation_status` | STRING | Operation Status | Operation Status |
| `secondary_status` | STRING | Secondary Status | Secondary Status |
| `create_time` | DATETIME | Create Time | Creation Time |
| `modify_time` | DATETIME | Modify Time | Last Modified Time |
| `ad_text` | STRING | Ad Text | Ad Text/Caption |
| `ad_texts` | JSON | Ad Texts | Multiple Ad Text Variations |
| `call_to_action` | STRING | Call to Action | Call To Action Text |
| `call_to_action_id` | STRING | Call to Action ID | Call To Action ID |
| `image_ids` | JSON | Image IDs | Image IDs Used in the Ad |
| `video_id` | STRING | Video ID | Video ID Used in the Ad |
| `image_mode` | STRING | Image Mode | Image Display Mode |
| `creative_type` | STRING | Creative Type | Type of Creative (video, image, etc.) |
| `ad_format` | STRING | Ad Format | Format of the Ad |
| `landing_page_url` | STRING | Landing Page URL | Landing Page URL |
| `landing_page_urls` | JSON | Landing Page URLs | Multiple Landing Page URLs |
| `deeplink` | STRING | Deeplink | Deep Link URL |
| `deeplink_type` | STRING | Deeplink Type | Type of Deep Link |
| `tracking_pixel_id` | STRING | Tracking Pixel ID | Pixel ID for Tracking |
| `impression_tracking_url` | STRING | Impression Tracking URL | URL for Impression Tracking |
| `click_tracking_url` | STRING | Click Tracking URL | URL for Click Tracking |
| `video_view_tracking_url` | STRING | Video View Tracking URL | URL for Video View Tracking |
| `is_new_structure` | BOOLEAN | Is New Structure | Flag indicating new ad structure |
| `is_aco` | BOOLEAN | Is Aco | Flag indicating Automated Creative Opt. |
| `optimization_event` | STRING | Optimization Event | Event being optimized for |
| `catalog_id` | STRING | Catalog ID | Product Catalog ID |
| `product_set_id` | STRING | Product Set ID | Product Set ID |
| `sku_ids` | JSON | SKU IDs | SKU IDs for Products |
| `domain` | STRING | Domain | Domain for the Ad |
| `display_name` | STRING | Display Name | Display Name shown in the Ad |
| `profile_image_url` | STRING | Profile Image URL | URL for Profile Image |
| `app_name` | STRING | App Name | Name of the App being promoted |
| `tracking_app_id` | STRING | Tracking App ID | App ID for Tracking |
| `identity_id` | STRING | Identity ID | Identity ID |
| `identity_type` | STRING | Identity Type | Type of Identity |
| `page_id` | STRING | Page ID | TikTok Page ID |
| `tiktok_item_id` | STRING | Tiktok Item ID | TikTok Item ID |
| `disclaimer_type` | STRING | Disclaimer Type | Type of Disclaimer |
| `disclaimer_text` | STRING | Disclaimer Text | Disclaimer Text |
| `utm_params` | JSON | UTM Params | UTM Parameters |

# Example Questions

- How many ads of each creative type does each ad group run?
- Which landing pages are used by the most ads?
- Which ads have a call to action set, and which do not?

## Joins

- [Ad Groups](./ad-groups.md) — `adgroup_id = adgroup_id` [N:1] — The ad group the ad belongs to.
  - Description: The ad group the ad belongs to.
