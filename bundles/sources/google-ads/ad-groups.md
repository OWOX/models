---
title: "Ad Groups"
description: |
  One row per ad group: its name, status and type, the campaign it sits in, and its CPC, CPM and target CPA bids. An ad group is the level at which ads and keywords are grouped, so this table is the bridge between a campaign and the ads and keywords below it.

  Bid amounts are in micros. Performance is in Ad Groups Stats, which joins here on `ad_group_id`.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/adGroupsFields.js"
    title: "OWOX Data Marts Google Ads connector — Ad Groups endpoint (`ad_groups`)"
    last_modified: 2026-08-06
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/ad_group"
    title: "Google Ads API reference — Ad Groups"
---

## Connector endpoint

- **Endpoint:** Google Ads · `ad_groups`
- **Default destination table:** `google_ads_ad_groups`
- **Last updated:** 2026-08-06 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([46a39ea85](https://github.com/OWOX/owox-data-marts/commit/46a39ea85f7ef1eb7b88e15980b8777bf9facdd1))
- **Google Ads API version:** v25
- **Unique keys:** `ad_group_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_group_id` | STRING | Ad Group ID | PK. The ad group's ID, the key of this table; Ad Groups Stats, Ad Group Ads Stats, Keywords Stats and Criterion carry it to point here. |
| `ad_group_name` | STRING | Ad Group Name | Name of the ad group. |
| `ad_group_status` | STRING | Ad Group Status | Ad Group Status (ENABLED, PAUSED, REMOVED) |
| `ad_group_type` | STRING | Ad Group Type | Ad Group Type (SEARCH_STANDARD, DISPLAY_STANDARD, etc.) |
| `campaign_id` | STRING | Campaign ID | ID of the campaign the row belongs to. FK to [Campaigns](./campaigns.md) |
| `campaign_name` | STRING | Campaign Name | Name of the campaign. |
| `ad_group_cpc_bid_micros` | FLOAT | Ad Group CPC Bid Micros | Ad Group CPC Bid in Micros |
| `ad_group_cpm_bid_micros` | FLOAT | Ad Group CPM Bid Micros | Ad Group CPM Bid in Micros |
| `ad_group_target_cpa_micros` | FLOAT | Ad Group Target CPA Micros | Ad Group Target CPA in Micros |

# Example Questions

- How many ad groups does each `campaign` have, and how many are paused?
- Which ad groups carry the highest CPC bids?
- Which ad group types does each `campaign` use?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = campaign_id` [N:1] — The campaign the ad group belongs to.
