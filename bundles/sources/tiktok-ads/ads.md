---
title: "Ads"
description: |
  One row per ad: its name and status, the campaign and ad group it belongs to (`campaign_id`, `adgroup_id` and their names), and the creative: creative type, ad format, ad text, call to action, video and image IDs, landing page URL, deep link and tracking URLs. It holds settings, not results; daily numbers are in Ad Performance, which joins here on `ad_id`.

  The connector's Include Deleted setting is off by default, so deleted ads are not loaded unless it is turned on. Join it to Ad Groups on `adgroup_id` for the ad group's bids and targeting.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/adsFields.js"
    title: "OWOX Data Marts TikTok Ads connector — Ads endpoint (`ads`)"
    last_modified: 2026-09-28
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs?id=1735735588640770"
    title: "TikTok Business API reference — Ads"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `ads`
- **Default destination table:** `tiktok_ads_ads`
- **Last updated:** 2026-09-28 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([3de731ea8](https://github.com/OWOX/owox-data-marts/commit/3de731ea89fa5701d5f45624a3fa5789e2df3e53))
- **TikTok Business API version:** v1.3
- **Unique keys:** `ad_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_id` | STRING | Ad ID | PK. ID of the ad. |
| `ad_name` | STRING | Ad Name | Name of the ad. |
| `advertiser_id` | STRING | Advertiser ID | ID of the advertiser account the row belongs to. |
| `campaign_id` | STRING | Campaign ID | ID of the campaign. |
| `campaign_name` | STRING | Campaign Name | Name of the campaign the row belongs to. |
| `adgroup_id` | STRING | Adgroup ID | ID of the ad group. FK to [Ad Groups](./ad-groups.md) |
| `adgroup_name` | STRING | Adgroup Name | Ad Group Name |
| `operation_status` | STRING | Operation Status | The on or off status the advertiser set; the delivery status is in `secondary_status`. |
| `secondary_status` | STRING | Secondary Status | The delivery status TikTok reports, next to the on or off `operation_status`. |
| `create_time` | DATETIME | Create Time | Creation Time |
| `modify_time` | DATETIME | Modify Time | Last Modified Time |
| `ad_text` | STRING | Ad Text | Ad Text/Caption |
| `ad_texts` | STRING | Ad Texts | Multiple Ad Text Variations. Stored as a JSON string. |
| `call_to_action` | STRING | Call To Action | Call To Action Text |
| `call_to_action_id` | STRING | Call To Action ID | ID of the call to action set on the ad. |
| `image_ids` | STRING | Image IDs | Image IDs Used in the Ad. Stored as a JSON string. |
| `video_id` | STRING | Video ID | Video ID Used in the Ad |
| `image_mode` | STRING | Image Mode | Image Display Mode |
| `creative_type` | STRING | Creative Type | Type of Creative (video, image, etc.) |
| `ad_format` | STRING | Ad Format | Format of the Ad |
| `landing_page_url` | STRING | Landing Page URL | Address of the page the ad leads to. |
| `landing_page_url_parsed` | STRING | Landing Page URL Parsed | landing_page_url resolved to its landing page when it is a short link; otherwise the same value. Requires landing_page_url and Process Short Links. |
| `landing_page_urls` | STRING | Landing Page URLs | Multiple Landing Page URLs. Stored as a JSON string. |
| `landing_page_urls_parsed` | STRING | Landing Page URLs Parsed | landing_page_urls with each short link resolved to its landing page; other URLs stay unchanged. Requires landing_page_urls and Process Short Links. Stored as a JSON string. |
| `deeplink` | STRING | Deeplink | Deep Link URL |
| `deeplink_type` | STRING | Deeplink Type | Type of Deep Link |
| `tracking_pixel_id` | STRING | Tracking Pixel ID | Pixel ID for Tracking |
| `impression_tracking_url` | STRING | Impression Tracking URL | URL for Impression Tracking |
| `click_tracking_url` | STRING | Click Tracking URL | URL for Click Tracking |
| `video_view_tracking_url` | STRING | Video View Tracking URL | URL for Video View Tracking |
| `is_new_structure` | BOOLEAN | Is New Structure | Flag indicating new ad structure |
| `is_aco` | BOOLEAN | Is ACO | Flag indicating Automated Creative Opt. |
| `optimization_event` | STRING | Optimization Event | Event being optimized for |
| `catalog_id` | STRING | Catalog ID | Product Catalog ID |
| `product_set_id` | STRING | Product Set ID | ID of the catalog product set the ad shows. |
| `sku_ids` | STRING | SKU IDs | SKU IDs for Products. Stored as a JSON string. |
| `domain` | STRING | Domain | Domain for the Ad |
| `display_name` | STRING | Display Name | Display Name shown in the Ad |
| `profile_image_url` | STRING | Profile Image URL | URL for Profile Image |
| `app_name` | STRING | App Name | Name of the App being promoted |
| `tracking_app_id` | STRING | Tracking App ID | App ID for Tracking |
| `identity_id` | STRING | Identity ID | ID of the identity the ad is published under. |
| `identity_type` | STRING | Identity Type | Type of Identity |
| `page_id` | STRING | Page ID | TikTok Page ID |
| `tiktok_item_id` | STRING | TikTok Item ID | ID of the TikTok post the ad uses. |
| `disclaimer_type` | STRING | Disclaimer Type | Type of Disclaimer |
| `disclaimer_text` | STRING | Disclaimer Text | Disclaimer text shown with the ad. |
| `utm_params` | STRING | UTM Params | UTM Parameters. Stored as a JSON string. |

# Example Questions

- How many ads of each creative type does each `ad group` run?
- Which landing pages are used by the most ads?
- Which ads have a call to action set, and which do not?

## Joins

- [Ad Groups](./ad-groups.md) — `adgroup_id = adgroup_id` [N:1] — The ad group the ad belongs to.
  - [Ad's Campaign](./campaigns.md) — The campaign of the ad's ad group — objective and budget; spend sits in Ad Performance.
    - [Ad's Advertiser Account](./advertiser-account.md) — The advertiser account the ad belongs to, reached through its campaign.
