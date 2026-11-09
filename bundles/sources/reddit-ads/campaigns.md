---
title: "Campaigns"
description: |
  One row per campaign: its name, objective, configured and effective status, spend cap, goal type and value, the funding instrument paying for it, special ad categories, the app it promotes (for app install campaigns) and creation and modification times. It holds settings, not results.

  A campaign belongs to one [Ad Account](./ad-account.md) (`ad_account_id`) and to one [Funding Instruments](./funding-instruments.md) row (`funding_instrument_id`). [Ad Groups](./ad-groups.md) point to it with `campaign_id`. The spend cap and goal value are described in the schema as micros, so divide by 1 million to read them in currency units.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Reddit Ads connector — Campaigns endpoint (`campaigns`)"
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20Campaigns"
    title: "Reddit Ads API reference — List%20Campaigns"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `campaigns`
- **Default destination table:** `reddit_ads_campaigns`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_account_id` | STRING | Ad Account ID | The ID of the ad account. |
| `configured_status` | STRING | Configured Status | The status that the user has configured for this entity. Can differ from the effective status depending on the context such as pending billing information. |
| `created_at` | STRING | Created at | The time that this entity was created, represented in ISO 8601. |
| `effective_status` | STRING | Effective Status | The calculated status determining the real status of this entity. |
| `funding_instrument_id` | STRING | Funding Instrument ID | Campaign level funding instrument ID. |
| `goal_type` | STRING | Goal Type | The campaign goal type. This cannot be changed after publishing the campaign. Only works for CBO campaigns. |
| `goal_value` | INTEGER | Goal Value | Campaign level goal value in micros. Only works for CBO campaigns. |
| `id` | STRING | ID | PK. The ID of the campaign. |
| `app_id` | STRING | App ID | The App ID of the app in the mobile app store (iOS App Store, Google Play Store), and is required for use with App Installs objective campaigns. |
| `modified_at` | STRING | Modified at | The last time that this entity was modified, represented in ISO 8601. |
| `name` | STRING | Name | The campaign name. Must be at least 3 characters. |
| `objective` | STRING | Objective | The objective type of a campaign. |
| `special_ad_categories` | STRING | Special Ad Categories | List of special ad categories related to the campaign. |
| `spend_cap` | INTEGER | Spend Cap | Campaign lifetime spend cap in microcurrency. Works for both CBO and non-CBO campaigns. |
| `skadnetwork_metadata` | STRING | Skadnetwork Metadata | Metadata about the SKAdNetwork source ID associated with the campaign. |

# Example Questions

- Which campaigns are active, and what objective does each one have?
- Which campaigns have a lifetime spend cap, and how large is it?
- Which funding instrument pays for each campaign?

## Joins

- [Ad Account](./ad-account.md) — `ad_account_id = id` [N:1] — The ad account that owns the campaign.
  - Description: The ad account that owns the campaign.
- [Funding Instruments](./funding-instruments.md) — `funding_instrument_id = id` [N:1] — The payment method the campaign spends against.
  - Description: The payment method the campaign spends against.
