---
title: "Custom Audiences"
description: |
  One row per custom audience of an ad account: its name, type, processing status, the estimated size as a lower and an upper bound, and creation and modification times. The status is VALID only when the upper size estimate is at or above 1,000 users; otherwise the audience is in an error state.

  It joins to [Ad Account](./ad-account.md) on `ad_account_id`. The connector loads no table that links audiences to ad groups, so any link from an ad group to an audience sits inside the `targeting` column of Ad Groups.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/ad-user-custom-audience.js"
    title: "OWOX Data Marts Reddit Ads connector — Custom Audiences endpoint (`user-custom-audience`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20User%20Custom%20Audiences"
    title: "Reddit Ads API reference — Custom Audiences"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `user-custom-audience`
- **Default destination table:** `reddit_ads_user_custom_audience`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Reddit Ads API version:** v3
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `name` | STRING | Name | The name of the custom audience. |
| `id` | STRING | ID | PK. The ID of the custom audience. |
| `status` | STRING | Status | The processing status of the custom audience. A custom audience is only VALID if size_range_upper is at or above 1,000 users, otherwise it will be in the NOT_ENOUGH_MATCHES_ERROR state. |
| `ad_account_id` | STRING | Ad Account ID | The ID of the ad account that owns this custom audience. FK to [Ad Account](./ad-account.md) |
| `created_at` | STRING | Created At | The time that this entity was created, represented in ISO 8601. |
| `modified_at` | STRING | Modified At | The last time that this entity was modified, represented in ISO 8601. |
| `size_range_upper` | INTEGER | Size Range Upper | High estimate of the number of matched users in the audience. |
| `size_range_lower` | INTEGER | Size Range Lower | Low estimate of the number of matched users in the audience. |
| `type` | STRING | Type | The type of the Custom Audience. |

# Example Questions

- Which custom audiences are not valid, and what status do they show?
- Which custom audiences have the largest estimated size?
- How many custom audiences of each type does each `ad account` have?

## Joins

- [Ad Account](./ad-account.md) — `ad_account_id = id` [N:1] — The ad account that owns the audience.
  - [Account Primary Contact](./ad-account-user.md) — The primary contact of the account that owns the audience, found only when it is the authenticated member.
