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

| Column | Type | Description |
|--------|------|-------------|
| `ad_id` | STRING | PK. Ad ID |
| `ad_status` | STRING | Ad Status (ENABLED, PAUSED, REMOVED) |
| `ad_final_urls` | JSON | Final URLs for the Ad |
| `ad_group_id` | STRING | Ad Group ID |
| `campaign_id` | STRING | Campaign ID |
| `date` | STRING | PK. Date for time series data |
| `impressions` | NUMERIC | Number of Impressions |
| `clicks` | NUMERIC | Number of Clicks |
| `cost_micros` | NUMERIC | Cost in Micros |
| `conversions` | NUMERIC | Number of Conversions |
| `ctr` | NUMERIC | Click-Through Rate |
| `average_cpc` | NUMERIC | Average Cost Per Click |
| `conversions_value` | NUMERIC | Total Conversion Value |
| `cost_per_conversion` | NUMERIC | Cost Per Conversion |
| `ad_type` | STRING | Ad Type (TEXT_AD, EXPANDED_TEXT_AD, RESPONSIVE_SEARCH_AD, etc.) |
| `ad_name` | STRING | Ad Name |
| `ad_group_name` | STRING | Ad Group Name |
| `campaign_name` | STRING | Campaign Name |
| `conversion_rate` | NUMERIC | Conversion Rate |
| `view_through_conversions` | NUMERIC | View-Through Conversions |
| `all_conversions` | NUMERIC | All Conversions |
| `all_conversions_value` | NUMERIC | All Conversions Value |
| `average_cost` | NUMERIC | Average Cost |
| `average_cpm` | NUMERIC | Average CPM |
| `interactions` | NUMERIC | Number of Interactions |
| `interaction_rate` | NUMERIC | Interaction Rate |

# Example Questions

- Which ads have the lowest click-through rate within their ad group?
- Which landing pages (final URLs) bring the cheapest conversions?
- How do ad types compare on cost per conversion?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the ad belongs to.
  - Description: The ad group the ad belongs to.
