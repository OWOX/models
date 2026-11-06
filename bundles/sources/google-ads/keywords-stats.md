---
title: "Keywords Stats"
description: |
  Daily keyword performance: impressions, clicks, cost, conversions and conversion value, the keyword's text, match type and status, its quality score, and search impression share and top-of-page rates. One row per keyword per `date`.

  The keyword is identified by `keyword_id` inside its ad group; join it to Criterion on `keyword_id` and `ad_group_id` for bids and targeting settings, and to Ad Groups for the ad group around it.
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

| Column | Type | Description |
|--------|------|-------------|
| `keyword_id` | STRING | PK. Keyword Criterion ID |
| `keyword_text` | STRING | Keyword Text |
| `keyword_match_type` | STRING | Keyword Match Type (EXACT, PHRASE, BROAD) |
| `keyword_status` | STRING | Criterion Status (ENABLED, PAUSED, REMOVED) |
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
| `quality_score` | NUMERIC | Quality Score |
| `conversion_rate` | NUMERIC | Conversion Rate |
| `view_through_conversions` | NUMERIC | View-Through Conversions |
| `all_conversions` | NUMERIC | All Conversions (including cross-device, store visits, etc.) |
| `all_conversions_value` | NUMERIC | All Conversions Value |
| `average_cost` | NUMERIC | Average Cost Per Interaction |
| `average_cpm` | NUMERIC | Average CPM (Cost Per Thousand Impressions) |
| `search_impression_share` | NUMERIC | Search Impression Share |
| `search_rank_lost_impression_share` | NUMERIC | Search Rank Lost Impression Share |
| `top_impression_percentage` | NUMERIC | Top Impression Percentage |
| `absolute_top_impression_percentage` | NUMERIC | Absolute Top Impression Percentage |

# Example Questions

- Which keywords spend the most without a conversion?
- How does quality score relate to cost per click across keywords?
- Which match type returns the most conversions per unit of cost?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the keyword sits in.
- [Criterion](./criterion.md) — `keyword_id = criterion_id`, `ad_group_id = ad_group_id`, `campaign_id = campaign_id` [N:1] — The keyword's targeting row; a criterion ID is only unique together with its ad group.
