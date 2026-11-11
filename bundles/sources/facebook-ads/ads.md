---
title: "Ads"
description: |
  One row per ad, with its name, status, the campaign and ad set it sits in, the creative it currently runs, and when it was created and last updated. It is the only table that names an ad's creative, so it is the bridge from performance to creative content.

  It is a snapshot of the ads that exist now. Meta leaves deleted and archived ads out of this list by default, so performance rows for an ad removed since will find no match here — join from insights with that in mind. `effective_status` is what Meta is actually doing with the ad (it inherits a paused campaign or ad set), while `status` is only what was set on the ad itself.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/7703667ccad8022f2fc89f8ddc1d27a125c219e0/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/ad-account-ads.js"
    title: "OWOX Data Marts Facebook Ads connector — Ads endpoint (`ad-account/ads`)"
    last_modified: 2026-05-18
  - id: "meta-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/ad-account/ads"
    title: "Meta Marketing API reference — Ads"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-account/ads`
- **Default destination table:** `facebook_ads_ad_account_ads`
- **Last updated:** 2026-05-18 — last change to this endpoint's fields in the connector ([8a33aca18](https://github.com/OWOX/owox-data-marts/commit/8a33aca183b6dbff95532a723e27803026ba94d9))
- **Meta Graph API version:** v26.0
- **Unique keys:** `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. The ad's ID — the value performance tables carry as `ad_id`. |
| `account_id` | STRING | Account ID | The ad account the ad belongs to. FK to [Ad Account](./ad-account.md) |
| `ad_active_time` | STRING | Ad Active Time | The time from when the ad was recently active |
| `ad_schedule_end_time` | DATETIME | Ad Schedule End Time | An optional parameter that defines the end time of an individual ad. If no end time is defined, the ad will run on the campaign's schedule |
| `ad_schedule_start_time` | DATETIME | Ad Schedule Start Time | An optional parameter that defines the start time of an individual ad. If no start time is defined, the ad will run on the campaign's schedule |
| `adlabels` | STRING | Ad Labels | Ad labels associated with this ad. Stored as a JSON string. |
| `adset_id` | STRING | Ad Set ID | The ad set the ad sits in. This connector loads no ad set table; the name travels on the performance rows as `adset_name`. |
| `bid_amount` | INTEGER | Bid Amount | Bid amount for this ad which will be used in auction |
| `campaign_id` | STRING | Campaign ID | The campaign the ad sits in. This connector loads no campaign table; the name travels on the performance rows as `campaign_name`. |
| `configured_status` | STRING | Configured Status | The configured status of the ad. Use status instead of this field |
| `conversion_domain` | STRING | Conversion Domain | The domain where conversions happen |
| `created_time` | DATETIME | Created Time | Time when the ad was created |
| `creative_id` | STRING | Creative ID | The creative the ad runs now. It can change over the ad's life, so it is not necessarily what ran on an earlier day. FK to [Ad Creatives](./ad-creatives.md) |
| `creative_effective_object_story_id` | STRING | Creative Effective Object Story ID | The ID of a page post to use in an ad |
| `creative_name` | STRING | Creative Name | Name of the ad creative |
| `creative_url_tags` | STRING | Creative URL Tags | Query string parameters appended to urls clicked from page post ads |
| `effective_status` | STRING | Effective Status | The effective status of the ad |
| `issues_info` | STRING | Issues Info | Issues for this ad that prevented it from delivering. Stored as a JSON string. |
| `last_updated_by_app_id` | STRING | Last Updated By App ID | Indicates the app used for the most recent update of the ad |
| `name` | STRING | Name | Name of the ad |
| `preview_shareable_link` | STRING | Preview Shareable Link | A link that enables users to preview ads in different placements |
| `source_ad_id` | STRING | Source Ad ID | The ad this one was copied from, when it was created as a duplicate — another row of this table. |
| `status` | STRING | Status | The configured status of the ad |
| `updated_time` | DATETIME | Updated Time | Time when this ad was updated |

# Example Questions

- Which active ads have not been updated in months and may be running stale creative?
- How many ads does each ad set carry, and are some overloaded?
- Which ads are set to active but not delivering, and what does their effective status say?

## Joins

- [Ad Account](./ad-account.md) — `account_id = account_id` [N:1] — The account the ad belongs to.
- [Ad Creatives](./ad-creatives.md) — `creative_id = id` [N:1] — The creative the ad runs now; one creative can serve several ads.
  - [Creative's Account](./ad-account.md) — The account whose library holds the creative.
