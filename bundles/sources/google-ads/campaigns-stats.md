---
title: "Campaigns Stats"
description: |
  Daily campaign performance: impressions, clicks, cost, conversions and conversion value, with ratios such as click-through rate and cost per conversion, and for search campaigns the share of impressions won or lost to budget and to ad rank. One row per campaign per `date`.

  Cost (`cost_micros`) is in micros. Impression-share and video fields only carry values for the campaign types they apply to. Join it to Campaigns on `campaign_id` for the campaign's type and bidding strategy.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/GoogleAdsFieldsSchema.js"
    title: "OWOX Data Marts Google Ads connector — Campaigns Stats endpoint (`campaigns_stats`)"
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/campaign"
    title: "Google Ads API reference — campaign"
---

## Connector endpoint

- **Endpoint:** Google Ads · `campaigns_stats`
- **Default destination table:** `google_ads_campaigns_stats`
- **Unique keys:** `campaign_id`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `campaign_id` | STRING | PK. Campaign ID |
| `campaign_name` | STRING | Campaign Name |
| `campaign_status` | STRING | Campaign Status (ENABLED, PAUSED, REMOVED) |
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
| `engagement_rate` | NUMERIC | Engagement Rate |
| `engagements` | NUMERIC | Number of Engagements |
| `interactions` | NUMERIC | Number of Interactions |
| `interaction_rate` | NUMERIC | Interaction Rate |
| `search_impression_share` | NUMERIC | Search Impression Share |
| `search_budget_lost_impression_share` | NUMERIC | Search Budget Lost Impression Share |
| `search_rank_lost_impression_share` | NUMERIC | Search Rank Lost Impression Share |
| `video_views` | NUMERIC | Video Views (for Video campaigns) |
| `video_view_rate` | NUMERIC | Video View Rate |

# Example Questions

- What did each campaign spend and return per day over the last 30 days?
- Which search campaigns lose the most impression share to budget, and which to rank?
- How does conversion value per unit of cost compare across advertising channel types?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = campaign_id` [N:1] — The campaign the daily row reports on.
  - Description: The campaign the daily row reports on.
