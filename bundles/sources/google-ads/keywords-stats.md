---
title: "Keywords Stats"
description: |
  Daily keyword performance: impressions, clicks, cost, conversions and conversion value, the keyword's text, match type and status, its quality score, and search impression share and top-of-page rates. One row per keyword per `date`, as the connector keys it (`keyword_id` and `date`).

  A criterion ID is only unique inside its ad group, so read `ad_group_id` together with `keyword_id`: join to Criterion on `keyword_id`, `ad_group_id` and `campaign_id` for bids and targeting settings, and to Ad Groups for the ad group around it.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/keywordsStatsFields.js"
    title: "OWOX Data Marts Google Ads connector — Keywords Stats endpoint (`keywords_stats`)"
    last_modified: 2026-08-06
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/keyword_view"
    title: "Google Ads API reference — Keywords Stats"
---

## Connector endpoint

- **Endpoint:** Google Ads · `keywords_stats`
- **Default destination table:** `google_ads_keywords_stats`
- **Last updated:** 2026-08-06 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([46a39ea85](https://github.com/OWOX/owox-data-marts/commit/46a39ea85f7ef1eb7b88e15980b8777bf9facdd1))
- **Google Ads API version:** v25
- **Unique keys:** `keyword_id`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `keyword_id` | STRING | Keyword ID | PK. Keyword Criterion ID FK to [Criterion](./criterion.md) |
| `keyword_text` | STRING | Keyword Text | The text of the keyword, at most 80 characters and 10 words. |
| `keyword_match_type` | STRING | Keyword Match Type | Keyword Match Type (EXACT, PHRASE, BROAD) |
| `keyword_status` | STRING | Keyword Status | Criterion Status (ENABLED, PAUSED, REMOVED) |
| `ad_group_id` | STRING | Ad Group ID | ID of the ad group the row belongs to. FK to [Ad Groups](./ad-groups.md) |
| `campaign_id` | STRING | Campaign ID | ID of the campaign the row belongs to. FK to [Criterion](./criterion.md) |
| `date` | STRING | Date | PK. Date for time series data |
| `impressions` | FLOAT | Impressions | Times the ad appeared on a search results page or a website on the Google Network. |
| `clicks` | FLOAT | Clicks | Clicks on the ads; `ctr` is clicks divided by impressions. |
| `cost_micros` | FLOAT | Cost Micros | Cost in Micros |
| `conversions` | FLOAT | Conversions | Conversions from the actions counted in the Conversions column (include_in_conversions_metric on), the ones conversion-based bidding optimizes for; `all_conversions` adds the rest. |
| `ctr` | FLOAT | CTR | Click-Through Rate |
| `average_cpc` | FLOAT | Average CPC | Average Cost Per Click |
| `conversions_value` | FLOAT | Conversions Value | Value of `conversions`: only the actions counted in the Conversions column (include_in_conversions_metric on); `all_conversions_value` adds the rest. |
| `cost_per_conversion` | FLOAT | Cost Per Conversion | Cost of ad interactions divided by `conversions`, so it counts only the actions included in the Conversions column. |
| `quality_score` | FLOAT | Quality Score | The keyword's quality score; empty when Google does not have enough information to compute it. |
| `conversion_rate` | FLOAT | Conversion Rate | Conversions from interactions divided by `interactions` (Google Ads `conversions_from_interactions_rate`); counts only the actions included in `conversions`. |
| `view_through_conversions` | FLOAT | View Through Conversions | Conversions by people who saw an image or rich media ad and later converted on the site without interacting with another ad. |
| `all_conversions` | FLOAT | All Conversions | Conversions from every conversion action, including those not counted in `conversions` (include_in_conversions_metric off). |
| `all_conversions_value` | FLOAT | All Conversions Value | Value of `all_conversions`: every conversion action, including those not counted in `conversions_value`. |
| `average_cost` | FLOAT | Average Cost | Average Cost Per Interaction |
| `average_cpm` | FLOAT | Average CPM | Average CPM (Cost Per Thousand Impressions) |
| `search_impression_share` | FLOAT | Search Impression Share | Search impressions received divided by the estimated impressions the ads were eligible for, from 0.1 to 1; anything below 0.1 is reported as 0.0999. |
| `search_rank_lost_impression_share` | FLOAT | Search Rank Lost Impression Share | Estimated share of the Search impressions the ads missed because of poor Ad Rank, from 0 to 0.9; anything above 0.9 is reported as 0.9001. |
| `top_impression_percentage` | FLOAT | Top Impression Percentage | Percentage of the ad impressions shown next to the top organic search results. |
| `absolute_top_impression_percentage` | FLOAT | Absolute Top Impression Percentage | Percentage of the Search ad impressions shown in the absolute top position of the Search results. |

# Example Questions

- Which keywords spend the most without a conversion?
- How does quality score relate to cost per click across keywords?
- Which match type returns the most conversions per unit of cost?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the keyword sits in.
  - [Keyword's Campaign](./campaigns.md) — The campaign of the keyword's ad group — its settings, not its results.
- [Criterion](./criterion.md) — `keyword_id = criterion_id` AND `ad_group_id = ad_group_id` AND `campaign_id = campaign_id` [N:1] — The keyword's targeting row.
  - [Criterion's Ad Group](./ad-groups.md) — The same ad group as Ad Groups, reached through Criterion; use one, not both.
    - [Criterion's Campaign](./campaigns.md) — The same campaign as Keyword's Campaign, reached through Criterion; use one, not both.
