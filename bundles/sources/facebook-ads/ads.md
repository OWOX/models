---
title: "Ads"
description: |
  One row per ad: its name, status and effective status, the campaign and ad set it sits in (as `campaign_id` and `adset_id`), the creative it runs (`creative_id`), its schedule, bid amount and created and updated times. It is the table every ad-level insights table joins to, on `ad_id`.

  The connector loads no campaign or ad set table, so `campaign_id` and `adset_id` here are plain columns. It is the state of each ad as of the last load, so `creative_id` is the creative the ad runs now, not necessarily the one it ran on an earlier day. [Ad](./ad.md) holds the same ads with more fields.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Facebook Ads connector — Ads endpoint (`ad-account/ads`)"
  - id: "vendor-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/ad-account/ads"
    title: "Meta Marketing API reference — ads"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-account/ads`
- **Default destination table:** `facebook_ads_ad_account_ads`
- **Unique keys:** `id`
- **Last updated:** 2026-05-18 — last change to this endpoint's fields in the connector ([8a33aca18](https://github.com/OWOX/owox-data-marts/commit/8a33aca183b6dbff95532a723e27803026ba94d9))
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. The ID of this ad |
| `account_id` | STRING | Account ID | The ID of the ad account that this ad belongs to |
| `ad_active_time` | STRING | Ad Active Time | The time from when the ad was recently active |
| `ad_schedule_end_time` | DATETIME | Ad Schedule End Time | An optional parameter that defines the end time of an individual ad. If no end time is defined, the ad will run on the campaign's schedule |
| `ad_schedule_start_time` | DATETIME | Ad Schedule Start Time | An optional parameter that defines the start time of an individual ad. If no start time is defined, the ad will run on the campaign's schedule |
| `adlabels` | JSON | Ad Labels | Ad labels associated with this ad |
| `adset_id` | STRING | Ad Set ID | ID of the ad set that contains the ad |
| `bid_amount` | INTEGER | Bid Amount | Bid amount for this ad which will be used in auction |
| `campaign_id` | STRING | Campaign ID | ID of the ad campaign that contains this ad |
| `configured_status` | STRING | Configured Status | The configured status of the ad. Use status instead of this field |
| `conversion_domain` | STRING | Conversion Domain | The domain where conversions happen |
| `created_time` | DATETIME | Created Time | Time when the ad was created |
| `creative_id` | STRING | Creative ID | Unique ID for the ad creative |
| `creative_effective_object_story_id` | STRING | Creative Effective Object Story ID | The ID of a page post to use in an ad |
| `creative_name` | STRING | Creative Name | Name of the ad creative |
| `creative_url_tags` | STRING | Creative URL Tags | Query string parameters appended to urls clicked from page post ads |
| `effective_status` | STRING | Effective Status | The effective status of the ad |
| `issues_info` | JSON | Issues Info | Issues for this ad that prevented it from delivering |
| `last_updated_by_app_id` | STRING | Last Updated by App ID | Indicates the app used for the most recent update of the ad |
| `name` | STRING | Name | Name of the ad |
| `preview_shareable_link` | STRING | Preview Shareable Link | A link that enables users to preview ads in different placements |
| `source_ad_id` | STRING | Source Ad ID | The source ad id that this ad is copied from |
| `status` | STRING | Status | The configured status of the ad |
| `updated_time` | DATETIME | Updated Time | Time when this ad was updated |

# Example Questions

- How many ads are active, paused or with issues in each campaign?
- Which ads run the same creative?
- Which ads were updated in the last 30 days?

## Joins

- [Ad Creatives](./ad-creatives.md) — `creative_id = id` [N:1] — The creative the ad runs as of the last load; one creative can serve several ads.
  - Description: The creative the ad runs as of the last load; one creative can serve several ads.
- [Ad Account](./ad-account.md) — `account_id = account_id` [N:1] — The account the ad belongs to.
  - Description: The account the ad belongs to.
