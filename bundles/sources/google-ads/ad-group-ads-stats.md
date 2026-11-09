---
title: "Ad Group Ads Stats"
description: |
  Daily performance of each ad: impressions, clicks, cost, conversions and conversion value, with the ad's type, name, status and final URLs. One row per ad per `date`.

  The connector loads no separate table of ads, so what is known about an ad, such as its type and landing page, is on these rows. Join it to Ad Groups on `ad_group_id` for the ad group's settings.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/GoogleAdsFieldsSchema.js"
    title: "OWOX Data Marts Google Ads connector — Ad Group Ads Stats endpoint (`ad_group_ads_stats`)"
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/ad_group_ad"
    title: "Google Ads API reference — ad_group_ad"
---

## Connector endpoint

- **Endpoint:** Google Ads · `ad_group_ads_stats`
- **Default destination table:** `google_ads_ad_group_ads_stats`
- **Unique keys:** `ad_id`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_id` | STRING | Ad ID | PK. Ad ID |
| `ad_status` | STRING | Ad Status | Ad Status (ENABLED, PAUSED, REMOVED) |
| `ad_final_urls` | JSON | Ad Final URLs | Final URLs for the Ad |
| `ad_group_id` | STRING | Ad Group ID | Ad Group ID |
| `campaign_id` | STRING | Campaign ID | Campaign ID |
| `date` | STRING | Date | PK. Date for time series data |
| `impressions` | NUMERIC | Impressions | Number of Impressions |
| `clicks` | NUMERIC | Clicks | Number of Clicks |
| `cost_micros` | NUMERIC | Cost Micros | Cost in Micros |
| `conversions` | NUMERIC | Conversions | Number of Conversions |
| `ctr` | NUMERIC | CTR | Click-Through Rate |
| `average_cpc` | NUMERIC | Average CPC | Average Cost Per Click |
| `conversions_value` | NUMERIC | Conversions Value | Total Conversion Value |
| `cost_per_conversion` | NUMERIC | Cost per Conversion | Cost Per Conversion |
| `ad_type` | STRING | Ad Type | Ad Type (TEXT_AD, EXPANDED_TEXT_AD, RESPONSIVE_SEARCH_AD, etc.) |
| `ad_name` | STRING | Ad Name | Ad Name |
| `ad_group_name` | STRING | Ad Group Name | Ad Group Name |
| `campaign_name` | STRING | Campaign Name | Campaign Name |
| `conversion_rate` | NUMERIC | Conversion Rate | Conversion Rate |
| `view_through_conversions` | NUMERIC | View Through Conversions | View-Through Conversions |
| `all_conversions` | NUMERIC | All Conversions | All Conversions |
| `all_conversions_value` | NUMERIC | All Conversions Value | All Conversions Value |
| `average_cost` | NUMERIC | Average Cost | Average Cost |
| `average_cpm` | NUMERIC | Average CPM | Average CPM |
| `interactions` | NUMERIC | Interactions | Number of Interactions |
| `interaction_rate` | NUMERIC | Interaction Rate | Interaction Rate |

# Example Questions

- Which ads have the lowest click-through rate within their ad group?
- Which landing pages (final URLs) bring the cheapest conversions?
- How do ad types compare on cost per conversion?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the ad belongs to.
  - Description: The ad group the ad belongs to.
