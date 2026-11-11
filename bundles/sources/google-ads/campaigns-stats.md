---
title: "Campaigns Stats"
description: |
  Daily campaign performance: impressions, clicks, cost, conversions and conversion value, with ratios such as click-through rate and cost per conversion, and for search campaigns the share of impressions won or lost to budget and to ad rank. One row per campaign per `date`.

  Cost (`cost_micros`) is in micros. Impression-share and video fields only carry values for the campaign types they apply to. Join it to Campaigns on `campaign_id` for the campaign's type and bidding strategy.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/campaignsStatsFields.js"
    title: "OWOX Data Marts Google Ads connector — Campaigns Stats endpoint (`campaigns_stats`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/campaign"
    title: "Google Ads API reference — Campaigns Stats"
---

## Connector endpoint

- **Endpoint:** Google Ads · `campaigns_stats`
- **Default destination table:** `google_ads_campaigns_stats`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([43a54e6f7](https://github.com/OWOX/owox-data-marts/commit/43a54e6f721ebe8bcdeb067c655e8e52306d72af))
- **Google Ads API version:** v25
- **Unique keys:** `campaign_id`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `campaign_id` | STRING | Campaign ID | PK. ID of the campaign the row belongs to. FK to [Campaigns](./campaigns.md) |
| `campaign_name` | STRING | Campaign Name | Name of the campaign. |
| `campaign_status` | STRING | Campaign Status | Campaign Status (ENABLED, PAUSED, REMOVED) |
| `date` | STRING | Date | PK. Date for time series data |
| `impressions` | FLOAT | Impressions | Times the ad appeared on a search results page or a website on the Google Network. |
| `clicks` | FLOAT | Clicks | Clicks on the ads; `ctr` is clicks divided by impressions. |
| `cost_micros` | FLOAT | Cost Micros | Cost in Micros |
| `conversions` | FLOAT | Conversions | Conversions from the actions counted in the Conversions column (include_in_conversions_metric on), the ones conversion-based bidding optimizes for; `all_conversions` adds the rest. |
| `ctr` | FLOAT | CTR | Click-Through Rate |
| `average_cpc` | FLOAT | Average CPC | Average Cost Per Click |
| `conversions_value` | FLOAT | Conversions Value | Value of `conversions`: only the actions counted in the Conversions column (include_in_conversions_metric on); `all_conversions_value` adds the rest. |
| `cost_per_conversion` | FLOAT | Cost Per Conversion | Cost of ad interactions divided by `conversions`, so it counts only the actions included in the Conversions column. |
| `conversion_rate` | FLOAT | Conversion Rate | Conversions from interactions divided by `interactions` (Google Ads `conversions_from_interactions_rate`); counts only the actions included in `conversions`. |
| `view_through_conversions` | FLOAT | View Through Conversions | Conversions by people who saw an image or rich media ad and later converted on the site without interacting with another ad. |
| `all_conversions` | FLOAT | All Conversions | Conversions from every conversion action, including those not counted in `conversions` (include_in_conversions_metric off). |
| `all_conversions_value` | FLOAT | All Conversions Value | Value of `all_conversions`: every conversion action, including those not counted in `conversions_value`. |
| `cost_per_all_conversions` | FLOAT | Cost Per All Conversions | Cost of ad interactions divided by `all_conversions`. |
| `average_cost` | FLOAT | Average Cost | Average amount paid per interaction: the total cost divided by `interactions`. |
| `average_cpm` | FLOAT | Average CPM | Average cost per 1,000 impressions (Google Ads `metrics.average_cpm`). |
| `engagement_rate` | FLOAT | Engagement Rate | Engagements divided by impressions; Google counts an engagement when a viewer expands a Lightbox ad. |
| `engagements` | FLOAT | Engagements | Times a viewer expanded a Lightbox ad, the one ad type Google counts engagements for. |
| `interactions` | FLOAT | Interactions | The main user action for the ad format: clicks for text and shopping ads, views for video ads, and so on. |
| `interaction_rate` | FLOAT | Interaction Rate | Interactions divided by impressions. |
| `search_impression_share` | FLOAT | Search Impression Share | Search impressions received divided by the estimated impressions the ads were eligible for, from 0.1 to 1; anything below 0.1 is reported as 0.0999. |
| `search_budget_lost_impression_share` | FLOAT | Search Budget Lost Impression Share | Estimated share of the Search impressions the ads missed because the budget was too low, from 0 to 0.9; anything above 0.9 is reported as 0.9001. |
| `search_rank_lost_impression_share` | FLOAT | Search Rank Lost Impression Share | Estimated share of the Search impressions the ads missed because of poor Ad Rank, from 0 to 0.9; anything above 0.9 is reported as 0.9001. |
| `video_views` | FLOAT | Video Views | Video Views (for Video campaigns) |
| `video_view_rate` | FLOAT | Video View Rate | TrueView views divided by impressions, including thumbnail impressions for TrueView in-display ads (Google Ads `video_trueview_view_rate`). |

# Example Questions

- What did each `campaign` spend and return per day over the last 30 days?
- Which search `campaigns` lose the most impression share to budget, and which to rank?
- How does conversion value per unit of cost compare across advertising channel types?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = campaign_id` [N:1] — The campaign the daily row reports on.
