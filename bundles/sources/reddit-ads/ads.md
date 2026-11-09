---
title: "Ads"
description: |
  One row per ad: its name, type, configured and effective status, the ad group, campaign and ad account it belongs to, the click URL, the post it promotes, a preview URL and its expiry, the rejection reason if it was rejected, event trackers and, for shopping ads, products and the creative. It holds the ad's identity and settings, not its results.

  Every daily performance table in this model carries an `ad_id` and joins to this table on it, so this is the join point between settings and results. The row also carries `campaign_id` and `ad_account_id`, but reach those through [Ad Groups](./ad-groups.md) so each level is read once.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Reddit Ads connector — Ads endpoint (`ads`)"
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20Ads"
    title: "Reddit Ads API reference — List%20Ads"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `ads`
- **Default destination table:** `reddit_ads_ads`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `type` | STRING | Type | The type of ad. |
| `ad_account_id` | STRING | Ad Account ID | The ID of the ad account that owns this ad. |
| `ad_group_id` | STRING | Ad Group ID | The ID of the ad group that this ad belongs to. |
| `campaign_id` | STRING | Campaign ID | The ID of the campaign that this ad belongs to. |
| `campaign_objective_type` | STRING | Campaign Objective Type | The objective type of a campaign. |
| `click_url` | STRING | Click URL | The website URL to direct users who click on the ad. |
| `configured_status` | STRING | Configured Status | The status that you have configured for this ad. |
| `created_at` | STRING | Created at | The time that this entity was created, represented in ISO 8601. |
| `effective_status` | STRING | Effective Status | The effective status for the ad. |
| `event_trackers` | STRING | Event Trackers | URLs to be called on certain events. Only URLs from Reddit’s list of approved measurement providers are allowed. |
| `id` | STRING | ID | PK. The ID of the ad. |
| `modified_at` | STRING | Modified at | The last time that this entity was modified, represented in ISO 8601. |
| `name` | STRING | Name | The ad name to be labeled in the dashboard and reports. |
| `preview_expiry` | STRING | Preview Expiry | An expiration time for the preview URL of this ad. This may be set to null to disable the preview URL. |
| `preview_url` | STRING | Preview URL | A URL that may be used to preview the ad. This is only available when preview_expiry is set. |
| `rejection_reason` | STRING | Rejection Reason | The reason why the ad was rejected. |
| `skadnetwork_metadata` | STRING | Skadnetwork Metadata | Metadata about the SKAdNetwork source ID associated with the ad. |
| `post_id` | STRING | Post ID | The ID of the post that this ad belongs to. |
| `post_url` | STRING | Post URL | The URL of the post that this ad belongs to. |
| `products` | STRING | Products | A list of products associated with an ad. |
| `profile_id` | STRING | Profile ID | The ID of the ad post’s author. Currently used only for Shopping Ads. |
| `profile_username` | STRING | Profile Username | The username of the ad post’s author. Currently used only for Shopping Ads. |
| `shopping_creative` | STRING | Shopping Creative | A collection of attributes used to generate creatives for a particular ad. |

# Example Questions

- Which ads were rejected, and for what reason?
- Which click URLs do the active ads send people to?
- How many ads of each type does each ad group have?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = id` [N:1] — The ad group the ad belongs to.
  - Description: The ad group the ad belongs to.
