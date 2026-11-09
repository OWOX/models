---
title: "Keywords Stats"
description: |
  Daily keyword performance: impressions, clicks, cost, conversions and conversion value, the keyword's text, match type and status, its quality score, and search impression share and top-of-page rates. One row per keyword per `date`, as the connector keys it (`keyword_id` and `date`).

  A criterion ID is only unique inside its ad group, so read `ad_group_id` together with `keyword_id`: join to Criterion on `keyword_id`, `ad_group_id` and `campaign_id` for bids and targeting settings, and to Ad Groups for the ad group around it.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/GoogleAdsFieldsSchema.js"
    title: "OWOX Data Marts Google Ads connector — Keywords Stats endpoint (`keywords_stats`)"
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/keyword_view"
    title: "Google Ads API reference — keyword_view"
---

## Connector endpoint

- **Endpoint:** Google Ads · `keywords_stats`
- **Default destination table:** `google_ads_keywords_stats`
- **Unique keys:** `keyword_id`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `keyword_id` | STRING | Keyword ID | PK. Keyword Criterion ID |
| `keyword_text` | STRING | Keyword Text | Keyword Text |
| `keyword_match_type` | STRING | Keyword Match Type | Keyword Match Type (EXACT, PHRASE, BROAD) |
| `keyword_status` | STRING | Keyword Status | Criterion Status (ENABLED, PAUSED, REMOVED) |
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
| `quality_score` | NUMERIC | Quality Score | Quality Score |
| `conversion_rate` | NUMERIC | Conversion Rate | Conversion Rate |
| `view_through_conversions` | NUMERIC | View Through Conversions | View-Through Conversions |
| `all_conversions` | NUMERIC | All Conversions | All Conversions (including cross-device, store visits, etc.) |
| `all_conversions_value` | NUMERIC | All Conversions Value | All Conversions Value |
| `average_cost` | NUMERIC | Average Cost | Average Cost Per Interaction |
| `average_cpm` | NUMERIC | Average CPM | Average CPM (Cost Per Thousand Impressions) |
| `search_impression_share` | NUMERIC | Search Impression Share | Search Impression Share |
| `search_rank_lost_impression_share` | NUMERIC | Search Rank Lost Impression Share | Search Rank Lost Impression Share |
| `top_impression_percentage` | NUMERIC | Top Impression Percentage | Top Impression Percentage |
| `absolute_top_impression_percentage` | NUMERIC | Absolute Top Impression Percentage | Absolute Top Impression Percentage |

# Example Questions

- Which keywords spend the most without a conversion?
- How does quality score relate to cost per click across keywords?
- Which match type returns the most conversions per unit of cost?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the keyword sits in.
  - Description: The ad group the keyword sits in.
- [Criterion](./criterion.md) — `keyword_id = criterion_id`, `ad_group_id = ad_group_id`, `campaign_id = campaign_id` [N:1] — The keyword's targeting row; a criterion ID is only unique together with its ad group.
  - Description: The keyword's targeting row; a criterion ID is only unique together with its ad group.
