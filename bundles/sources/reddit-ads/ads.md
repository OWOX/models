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

| Column | Type | Description |
|--------|------|-------------|
| `type` | STRING | The type of ad. |
| `ad_account_id` | STRING | The ID of the ad account that owns this ad. |
| `ad_group_id` | STRING | The ID of the ad group that this ad belongs to. |
| `campaign_id` | STRING | The ID of the campaign that this ad belongs to. |
| `campaign_objective_type` | STRING | The objective type of a campaign. |
| `click_url` | STRING | The website URL to direct users who click on the ad. |
| `configured_status` | STRING | The status that you have configured for this ad. |
| `created_at` | STRING | The time that this entity was created, represented in ISO 8601. |
| `effective_status` | STRING | The effective status for the ad. |
| `event_trackers` | STRING | URLs to be called on certain events. Only URLs from Reddit’s list of approved measurement providers are allowed. |
| `id` | STRING | PK. The ID of the ad. |
| `modified_at` | STRING | The last time that this entity was modified, represented in ISO 8601. |
| `name` | STRING | The ad name to be labeled in the dashboard and reports. |
| `preview_expiry` | STRING | An expiration time for the preview URL of this ad. This may be set to null to disable the preview URL. |
| `preview_url` | STRING | A URL that may be used to preview the ad. This is only available when preview_expiry is set. |
| `rejection_reason` | STRING | The reason why the ad was rejected. |
| `skadnetwork_metadata` | STRING | Metadata about the SKAdNetwork source ID associated with the ad. |
| `post_id` | STRING | The ID of the post that this ad belongs to. |
| `post_url` | STRING | The URL of the post that this ad belongs to. |
| `products` | STRING | A list of products associated with an ad. |
| `profile_id` | STRING | The ID of the ad post’s author. Currently used only for Shopping Ads. |
| `profile_username` | STRING | The username of the ad post’s author. Currently used only for Shopping Ads. |
| `shopping_creative` | STRING | A collection of attributes used to generate creatives for a particular ad. |

# Example Questions

- Which ads were rejected, and for what reason?
- Which click URLs do the active ads send people to?
- How many ads of each type does each ad group have?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = id` [N:1] — The ad group the ad belongs to.
  - Description: The ad group the ad belongs to.
