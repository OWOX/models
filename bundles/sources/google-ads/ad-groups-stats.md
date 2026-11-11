---
title: "Ad Groups Stats"
description: |
  Daily ad group performance: impressions, clicks, cost, conversions and conversion value, with interaction and engagement ratios. One row per ad group per `date`.

  Use it to see which ad groups carry a campaign's spend. It repeats `campaign_id`, but join through Ad Groups to reach the campaign's name and settings.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/adGroupsStatsFields.js"
    title: "OWOX Data Marts Google Ads connector — Ad Groups Stats endpoint (`ad_groups_stats`)"
    last_modified: 2026-08-06
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/ad_group"
    title: "Google Ads API reference — Ad Groups Stats"
---

## Connector endpoint

- **Endpoint:** Google Ads · `ad_groups_stats`
- **Default destination table:** `google_ads_ad_groups_stats`
- **Last updated:** 2026-08-06 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([46a39ea85](https://github.com/OWOX/owox-data-marts/commit/46a39ea85f7ef1eb7b88e15980b8777bf9facdd1))
- **Google Ads API version:** v25
- **Unique keys:** `ad_group_id`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_group_id` | STRING | Ad Group ID | PK. ID of the ad group the row belongs to. FK to [Ad Groups](./ad-groups.md) |
| `ad_group_name` | STRING | Ad Group Name | Name of the ad group. |
| `ad_group_status` | STRING | Ad Group Status | Ad Group Status (ENABLED, PAUSED, REMOVED) |
| `campaign_id` | STRING | Campaign ID | ID of the campaign the row belongs to. |
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
| `interactions` | FLOAT | Interactions | The main user action for the ad format: clicks for text and shopping ads, views for video ads, and so on. |
| `interaction_rate` | FLOAT | Interaction Rate | Interactions divided by impressions. |
| `engagement_rate` | FLOAT | Engagement Rate | Engagements divided by impressions; Google counts an engagement when a viewer expands a Lightbox ad. |
| `engagements` | FLOAT | Engagements | Times a viewer expanded a Lightbox ad, the one ad type Google counts engagements for. |

# Example Questions

- Which `ad groups` account for most of each `campaign`'s cost?
- Which `ad groups` have a falling click-through rate week over week?
- What is the cost per conversion of each `ad group` last month?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the daily row reports on.
  - [Ad Group's Campaign](./campaigns.md) — The campaign this ad group sits in — its settings, not its results.
