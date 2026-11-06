---
title: "Ad Groups"
description: |
  One row per ad group: its name, status and type, the campaign it sits in, and its CPC, CPM and target CPA bids. An ad group is the level at which ads and keywords are grouped, so this table is the bridge between a campaign and the ads and keywords below it.

  Bids are in micros. Performance is in Ad Groups Stats, which joins here on `ad_group_id`.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/GoogleAdsFieldsSchema.js"
    title: "OWOX Data Marts Google Ads connector — Ad Groups endpoint (`ad_groups`)"
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/ad_group"
    title: "Google Ads API reference — ad_group"
---

## Connector endpoint

- **Endpoint:** Google Ads · `ad_groups`
- **Default destination table:** `google_ads_ad_groups`
- **Unique keys:** `ad_group_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_group_id` | STRING | PK. Ad Group ID |
| `ad_group_name` | STRING | Ad Group Name |
| `ad_group_status` | STRING | Ad Group Status (ENABLED, PAUSED, REMOVED) |
| `ad_group_type` | STRING | Ad Group Type (SEARCH_STANDARD, DISPLAY_STANDARD, etc.) |
| `campaign_id` | STRING | Campaign ID |
| `campaign_name` | STRING | Campaign Name |
| `ad_group_cpc_bid_micros` | NUMERIC | Ad Group CPC Bid in Micros |
| `ad_group_cpm_bid_micros` | NUMERIC | Ad Group CPM Bid in Micros |
| `ad_group_target_cpa_micros` | NUMERIC | Ad Group Target CPA in Micros |

# Example Questions

- How many ad groups does each campaign have, and how many are paused?
- Which ad groups carry the highest CPC bids?
- Which ad group types does each campaign use?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = campaign_id` [N:1] — The campaign the ad group belongs to.
