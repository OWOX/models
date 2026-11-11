---
title: "Ad"
description: |
  The older view of the same ads (Meta's API still calls an ad an "ad group"). It carries the same ads as [Ads](./ads.md), since the connector reads both from the account's ads list, and adds a few fields — review feedback, schedule, bid amount, tracking specs and flattened creative fields. Prefer [Ads](./ads.md) unless you need one of those. Like [Ads](./ads.md), it lists only ads that still exist.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/ad-group-fields.js"
    title: "OWOX Data Marts Facebook Ads connector — Ad endpoint (`ad-group`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/adgroup/"
    title: "Meta Marketing API reference — Ad"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-group`
- **Default destination table:** `facebook_ads_ad_group`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Meta Marketing API version:** v26.0
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. The ad's ID — the same value as in Ads. FK to [Ads](./ads.md) |
| `account_id` | STRING | Account ID | The ad account the ad belongs to. |
| `ad_active_time` | STRING | Ad Active Time | The time from when the ad was recently active |
| `ad_review_feedback` | STRING | Ad Review Feedback | The review feedback for this ad after it is reviewed. Stored as a JSON string. |
| `ad_schedule_end_time` | DATETIME | Ad Schedule End Time | An optional parameter that defines the end time of an individual ad. If no end time is defined, the ad will run on the campaign’s schedule. |
| `ad_schedule_start_time` | DATETIME | Ad Schedule Start Time | An optional parameter that defines the start time of an individual ad. If no start time is defined, the ad will run on the campaign’s schedule. |
| `adlabels` | STRING | Ad Labels | Ad labels associated with this ad. Stored as a JSON string. |
| `adset` | STRING | Ad Set | Ad set that contains this ad. Stored as a JSON string. |
| `adset_id` | STRING | Ad Set ID | ID of the ad set that contains the ad |
| `bid_amount` | INTEGER | Bid Amount | Bid amount for this ad which will be used in auction. This value would be the same as the bid_amount field on the ad set. |
| `campaign` | STRING | Campaign | Ad campaign that contains this ad. Stored as a JSON string. |
| `campaign_id` | STRING | Campaign ID | ID of the ad campaign that contains this ad |
| `configured_status` | STRING | Configured Status | The configured status of the ad. Use status instead of this field. |
| `conversion_domain` | STRING | Conversion Domain | The domain where conversions happen. The field is no longer required for creation or update since June 2023. Note that this field should contain only the first and second level domains, and not the full URL. For example facebook.com. |
| `created_time` | DATETIME | Created Time | Time when the ad was created. |
| `creative_id` | STRING | Creative ID | The creative the ad runs now. |
| `creative_effective_object_story_id` | STRING | Creative Effective Object Story ID | The ID of a page post to use in an ad, regardless of whether its an organic or unpublished page post |
| `creative_name` | STRING | Creative Name | Name of the ad creative as seen in the ad accounts library |
| `creative_object_story_spec` | STRING | Creative Object Story Spec | Object story spec containing page_id and other details |
| `creative_url_tags` | STRING | Creative URL Tags | A set of query string parameters which will replace or be appended to urls clicked from page post ads |
| `creative_asset_groups_spec` | STRING | Creative Asset Groups Spec | This field is used to create ads using the Flexible ad format. You can read more about that here. Stored as a JSON string. |
| `effective_status` | STRING | Effective Status | The effective status of the ad. The status could be effective either because of its own status, or the status of its parent units. WITH_ISSUES is available for version 3.2 or higher. IN_PROCESS is available for version 4.0 or higher |
| `issues_info` | STRING | Issues Info | Issues for this ad that prevented it from delivering. Stored as a JSON string. |
| `last_updated_by_app_id` | STRING | Last Updated By App ID | Indicates the app used for the most recent update of the ad. |
| `name` | STRING | Name | Name of the ad. |
| `preview_shareable_link` | STRING | Preview Shareable Link | A link that enables users to preview ads in different placements |
| `recommendations` | STRING | Recommendations | If there are recommendations for this ad, this field includes them. Otherwise, it is not included in the response. Field not included in redownload mode. Stored as a JSON string. |
| `source_ad` | STRING | Source Ad | The source ad that this ad is copied from. Stored as a JSON string. |
| `source_ad_id` | STRING | Source Ad ID | The source ad id that this ad is copied from |
| `status` | STRING | Status | The configured status of the ad. The field returns the same value as configured_status. Use this field, instead of configured_status. |
| `tracking_specs` | STRING | Tracking Specs | With tracking specs, you log actions taken by people on your ad. This field takes arguments identical to action spec. See Tracking and Conversion Specs. Stored as a JSON string. |
| `updated_time` | DATETIME | Updated Time | Time when this ad was updated. |

# Example Questions

- Which ads were rejected in review, and what feedback did Meta give?
- Which ads run on a schedule, and when do their windows open and close?
- Which ads carry a manual bid, and at what amount?

## Joins

- [Ads](./ads.md) — `id = id` [1:1] — The same ad, read through Meta's ad reference; both tables list the ads of the account.
  - [Ad's Account](./ad-account.md) — The account this ad belongs to.
  - [Ad's Current Creative](./ad-creatives.md) — The creative this ad runs as of the last load of Ads.
    - [Creative's Account](./ad-account.md) — The account whose library holds the creative.
