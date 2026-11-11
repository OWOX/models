---
title: "Campaigns"
description: |
  One row per campaign: its name, status, advertising channel type and sub type, bidding strategy, budget, target CPA or target ROAS, and start and end dates. It holds settings, not results; a campaign's clicks and cost are in Campaigns Stats, which joins to this table on `campaign_id`.

  The budget and target CPA amounts are in micros, one millionth of the account currency. Use it to label and filter the performance tables by campaign type or bidding strategy.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/campaignsFields.js"
    title: "OWOX Data Marts Google Ads connector — Campaigns endpoint (`campaigns`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/campaign"
    title: "Google Ads API reference — Campaigns"
---

## Connector endpoint

- **Endpoint:** Google Ads · `campaigns`
- **Default destination table:** `google_ads_campaigns`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([43a54e6f7](https://github.com/OWOX/owox-data-marts/commit/43a54e6f721ebe8bcdeb067c655e8e52306d72af))
- **Google Ads API version:** v25
- **Unique keys:** `campaign_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `campaign_id` | STRING | Campaign ID | PK. The campaign's ID, the key of this table; every other table except Geo Target Constants carries it to point here. |
| `campaign_name` | STRING | Campaign Name | Name of the campaign. |
| `campaign_status` | STRING | Campaign Status | Campaign Status (ENABLED, PAUSED, REMOVED) |
| `campaign_advertising_channel_type` | STRING | Campaign Advertising Channel Type | Advertising Channel Type (SEARCH, DISPLAY, VIDEO, etc.) |
| `campaign_start_date` | STRING | Campaign Start Date | The day the campaign started serving, in the account's time zone. |
| `campaign_end_date` | STRING | Campaign End Date | The last day the campaign serves, in the account's time zone. |
| `campaign_bidding_strategy_type` | STRING | Campaign Bidding Strategy Type | Bidding Strategy Type (MANUAL_CPC, TARGET_CPA, TARGET_ROAS, etc.) |
| `campaign_budget_amount_micros` | FLOAT | Campaign Budget Amount Micros | Campaign Budget Amount in Micros |
| `campaign_target_cpa_micros` | FLOAT | Campaign Target CPA Micros | Target CPA in Micros (if using Target CPA bidding) |
| `campaign_target_roas` | FLOAT | Campaign Target ROAS | Target ROAS (if using Target ROAS bidding) |
| `campaign_advertising_channel_sub_type` | STRING | Campaign Advertising Channel Sub Type | Advertising Channel Sub Type |

# Example Questions

- Which campaigns are enabled, and which bidding strategy does each use?
- How many campaigns run on each advertising channel type?
- Which campaigns have an end date that has already passed but are still enabled?
