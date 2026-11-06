---
title: "Ad"
description: |
  The same ads as [Ads](./ads.md), read through Meta's ad reference (the API calls an ad an "adgroup"), with more fields: the review feedback, `tracking_specs`, the ad this one was copied from (`source_ad_id`), recommendations, and the creative's object story and asset group specs. One row per ad, keyed by `id`.

  Both tables come from the account's ads list, so an ad has the same `id` in each. Start from Ads for names, status and the campaign and ad set IDs, and from this table when you need one of the extra fields.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Facebook Ads connector — Ad endpoint (`ad-group`)"
  - id: "vendor-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/adgroup/"
    title: "Meta Marketing API reference — adgroup"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-group`
- **Default destination table:** `facebook_ads_ad_group`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. The ID of this ad. |
| `account_id` | STRING | The ID of the ad account that this ad belongs to. |
| `ad_active_time` | STRING | The time from when the ad was recently active |
| `ad_review_feedback` | JSON | The review feedback for this ad after it is reviewed. |
| `ad_schedule_end_time` | DATETIME | An optional parameter that defines the end time of an individual ad. If no end time is defined, the ad will run on the campaign’s schedule. |
| `ad_schedule_start_time` | DATETIME | An optional parameter that defines the start time of an individual ad. If no start time is defined, the ad will run on the campaign’s schedule. |
| `adlabels` | JSON | Ad labels associated with this ad |
| `adset` | JSON | Ad set that contains this ad |
| `adset_id` | STRING | ID of the ad set that contains the ad |
| `bid_amount` | INTEGER | Bid amount for this ad which will be used in auction. This value would be the same as the bid_amount field on the ad set. |
| `campaign` | JSON | Ad campaign that contains this ad |
| `campaign_id` | STRING | ID of the ad campaign that contains this ad |
| `configured_status` | STRING | The configured status of the ad. Use status instead of this field. |
| `conversion_domain` | STRING | The domain where conversions happen. The field is no longer required for creation or update since June 2023. Note that this field should contain only the first and second level domains, and not the full URL. For example facebook.com. |
| `created_time` | DATETIME | Time when the ad was created. |
| `creative_id` | STRING | Unique ID for the ad creative |
| `creative_effective_object_story_id` | STRING | The ID of a page post to use in an ad, regardless of whether its an organic or unpublished page post |
| `creative_name` | STRING | Name of the ad creative as seen in the ad accounts library |
| `creative_object_story_spec` | STRING | Object story spec containing page_id and other details |
| `creative_url_tags` | STRING | A set of query string parameters which will replace or be appended to urls clicked from page post ads |
| `creative_asset_groups_spec` | JSON | This field is used to create ads using the Flexible ad format. You can read more about that here |
| `effective_status` | STRING | The effective status of the ad. The status could be effective either because of its own status, or the status of its parent units. WITH_ISSUES is available for version 3.2 or higher. IN_PROCESS is available for version 4.0 or higher |
| `issues_info` | JSON | Issues for this ad that prevented it from delivering |
| `last_updated_by_app_id` | STRING | Indicates the app used for the most recent update of the ad. |
| `name` | STRING | Name of the ad. |
| `preview_shareable_link` | STRING | A link that enables users to preview ads in different placements |
| `recommendations` | JSON | If there are recommendations for this ad, this field includes them. Otherwise, it is not included in the response. Field not included in redownload mode. |
| `source_ad` | JSON | The source ad that this ad is copied from |
| `source_ad_id` | STRING | The source ad id that this ad is copied from |
| `status` | STRING | The configured status of the ad. The field returns the same value as configured_status. Use this field, instead of configured_status. |
| `tracking_specs` | JSON | With tracking specs, you log actions taken by people on your ad. This field takes arguments identical to action spec. See Tracking and Conversion Specs. |
| `updated_time` | DATETIME | Time when this ad was updated. |

# Example Questions

- Which ads were copied from another ad (`source_ad_id` is set)?
- Which ads have review feedback or delivery issues?
- Which ads have an end time scheduled?

## Joins

- [Ads](./ads.md) — `id = id` [1:1] — The same ad: both tables list the account's ads, this one with more fields.
  - Description: The same ad: both tables list the account's ads, this one with more fields.
