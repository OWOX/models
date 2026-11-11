---
title: "Custom Audiences"
description: |
  One row per custom audience of an advertiser: its ID and name, audience type, coverage (`cover_num`, the number of matched users on TikTok), when it was created, whether it is valid and expiring, and when it expires. An audience becomes invalid after it expires.

  The audiences endpoint takes the advertiser ID as a request parameter, and the connector stamps it on each row as `advertiser_id`. Ad groups list the audiences they target in `audience_ids`, an array column, so there is no row-by-row join to this table.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/audiencesFields.js"
    title: "OWOX Data Marts TikTok Ads connector — Custom Audiences endpoint (`audiences`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs?id=1739314536665090"
    title: "TikTok Business API reference — Custom Audiences"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `audiences`
- **Default destination table:** `tiktok_ads_audiences`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **TikTok Business API version:** v1.3
- **Unique keys:** `audience_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `audience_id` | STRING | Audience ID | PK. Unique identifier for the audience |
| `advertiser_id` | STRING | Advertiser ID | ID of the advertiser account the row belongs to. FK to [Advertiser Account](./advertiser-account.md) |
| `name` | STRING | Name | Name of the audience |
| `audience_type` | STRING | Audience Type | Type of audience (e.g., demographic, interest-based) |
| `cover_num` | INTEGER | Cover Num | Number of audience members covered |
| `create_time` | DATETIME | Create Time | Timestamp indicating when the audience was created |
| `is_valid` | BOOLEAN | Is Valid | Flag indicating if the audience data is valid |
| `is_expiring` | BOOLEAN | Is Expiring | Flag indicating if the audience data is expiring soon |
| `expired_time` | DATETIME | Expired Time | Timestamp indicating when the audience data expires |

# Example Questions

- Which custom audiences have expired or are about to expire?
- Which audience types cover the most users?
- How many valid audiences does each `advertiser account` have?

## Joins

- [Advertiser Account](./advertiser-account.md) — `advertiser_id = advertiser_id` [N:1] — The advertiser account the audience was loaded for.
