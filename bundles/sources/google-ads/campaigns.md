---
title: "Campaigns"
description: |
  One row per campaign: its name, status, advertising channel type and sub type, bidding strategy, budget, target CPA or target ROAS, and start and end dates. It holds settings, not results; a campaign's clicks and cost are in Campaigns Stats, which joins to this table on `campaign_id`.

  The budget and target CPA amounts are in micros, one millionth of the account currency. Use it to label and filter the performance tables by campaign type or bidding strategy.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/GoogleAdsFieldsSchema.js"
    title: "OWOX Data Marts Google Ads connector — Campaigns endpoint (`campaigns`)"
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/campaign"
    title: "Google Ads API reference — campaign"
---

## Connector endpoint

- **Endpoint:** Google Ads · `campaigns`
- **Default destination table:** `google_ads_campaigns`
- **Unique keys:** `campaign_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `campaign_id` | STRING | Campaign ID | PK. Campaign ID |
| `campaign_name` | STRING | Campaign Name | Campaign Name |
| `campaign_status` | STRING | Campaign Status | Campaign Status (ENABLED, PAUSED, REMOVED) |
| `campaign_advertising_channel_type` | STRING | Campaign Advertising Channel Type | Advertising Channel Type (SEARCH, DISPLAY, VIDEO, etc.) |
| `campaign_start_date` | STRING | Campaign Start Date | Campaign Start Date |
| `campaign_end_date` | STRING | Campaign End Date | Campaign End Date |
| `campaign_bidding_strategy_type` | STRING | Campaign Bidding Strategy Type | Bidding Strategy Type (MANUAL_CPC, TARGET_CPA, TARGET_ROAS, etc.) |
| `campaign_budget_amount_micros` | NUMERIC | Campaign Budget Amount Micros | Campaign Budget Amount in Micros |
| `campaign_target_cpa_micros` | NUMERIC | Campaign Target CPA Micros | Target CPA in Micros (if using Target CPA bidding) |
| `campaign_target_roas` | NUMERIC | Campaign Target ROAS | Target ROAS (if using Target ROAS bidding) |
| `campaign_advertising_channel_sub_type` | STRING | Campaign Advertising Channel Sub Type | Advertising Channel Sub Type |

# Example Questions

- Which campaigns are enabled, and which bidding strategy does each use?
- How many campaigns run on each advertising channel type?
- Which campaigns have an end date that has already passed but are still enabled?
