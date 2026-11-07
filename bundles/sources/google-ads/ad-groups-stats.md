---
title: "Ad Groups Stats"
description: |
  Daily ad group performance: impressions, clicks, cost, conversions and conversion value, with interaction and engagement ratios. One row per ad group per `date`.

  Use it to see which ad groups carry a campaign's spend. It repeats `campaign_id`, but join through Ad Groups to reach the campaign's name and settings.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/GoogleAdsFieldsSchema.js"
    title: "OWOX Data Marts Google Ads connector — Ad Groups Stats endpoint (`ad_groups_stats`)"
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/ad_group"
    title: "Google Ads API reference — ad_group"
---

## Connector endpoint

- **Endpoint:** Google Ads · `ad_groups_stats`
- **Default destination table:** `google_ads_ad_groups_stats`
- **Unique keys:** `ad_group_id`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_group_id` | STRING | PK. Ad Group ID |
| `ad_group_name` | STRING | Ad Group Name |
| `ad_group_status` | STRING | Ad Group Status (ENABLED, PAUSED, REMOVED) |
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
| `conversion_rate` | NUMERIC | Conversion Rate |
| `view_through_conversions` | NUMERIC | View-Through Conversions |
| `all_conversions` | NUMERIC | All Conversions |
| `all_conversions_value` | NUMERIC | All Conversions Value |
| `cost_per_all_conversions` | NUMERIC | Cost Per All Conversions |
| `average_cost` | NUMERIC | Average Cost |
| `average_cpm` | NUMERIC | Average CPM |
| `interactions` | NUMERIC | Number of Interactions |
| `interaction_rate` | NUMERIC | Interaction Rate |
| `engagement_rate` | NUMERIC | Engagement Rate |
| `engagements` | NUMERIC | Number of Engagements |

# Example Questions

- Which ad groups account for most of each campaign's cost?
- Which ad groups have a falling click-through rate week over week?
- What is the cost per conversion of each ad group last month?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the daily row reports on.
  - Description: The ad group the daily row reports on.
