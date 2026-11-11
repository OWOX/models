---
title: "Ad Group Ads Stats"
description: |
  Daily performance of each ad: impressions, clicks, cost, conversions and conversion value, with the ad's type, name, status and final URLs. One row per ad per `date`.

  The connector loads no separate table of ads, so what is known about an ad, such as its type and landing page, is on these rows. Join it to Ad Groups on `ad_group_id` for the ad group's settings.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/adGroupAdsStatsFields.js"
    title: "OWOX Data Marts Google Ads connector — Ad Group Ads Stats endpoint (`ad_group_ads_stats`)"
    last_modified: 2026-09-28
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/ad_group_ad"
    title: "Google Ads API reference — Ad Group Ads Stats"
---

## Connector endpoint

- **Endpoint:** Google Ads · `ad_group_ads_stats`
- **Default destination table:** `google_ads_ad_group_ads_stats`
- **Last updated:** 2026-09-28 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([3de731ea8](https://github.com/OWOX/owox-data-marts/commit/3de731ea89fa5701d5f45624a3fa5789e2df3e53))
- **Google Ads API version:** v25
- **Unique keys:** `ad_id`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_id` | STRING | Ad ID | PK. ID of the ad. |
| `ad_status` | STRING | Ad Status | Ad Status (ENABLED, PAUSED, REMOVED) |
| `ad_final_urls` | STRING | Ad Final URLs | Final URLs for the Ad. Stored as a JSON string. |
| `ad_final_urls_parsed` | STRING | Ad Final URLs Parsed | ad_final_urls with each short link resolved to its landing page; other URLs stay unchanged. Requires ad_final_urls and Process Short Links. Stored as a JSON string. |
| `ad_group_id` | STRING | Ad Group ID | ID of the ad group the row belongs to. FK to [Ad Groups](./ad-groups.md) |
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
| `ad_type` | STRING | Ad Type | Ad Type (TEXT_AD, EXPANDED_TEXT_AD, RESPONSIVE_SEARCH_AD, etc.) |
| `ad_name` | STRING | Ad Name | Name of the ad. |
| `ad_group_name` | STRING | Ad Group Name | Name of the ad group. |
| `campaign_name` | STRING | Campaign Name | Name of the campaign. |
| `conversion_rate` | FLOAT | Conversion Rate | Conversions from interactions divided by `interactions` (Google Ads `conversions_from_interactions_rate`); counts only the actions included in `conversions`. |
| `view_through_conversions` | FLOAT | View Through Conversions | Conversions by people who saw an image or rich media ad and later converted on the site without interacting with another ad. |
| `all_conversions` | FLOAT | All Conversions | Conversions from every conversion action, including those not counted in `conversions` (include_in_conversions_metric off). |
| `all_conversions_value` | FLOAT | All Conversions Value | Value of `all_conversions`: every conversion action, including those not counted in `conversions_value`. |
| `average_cost` | FLOAT | Average Cost | Average amount paid per interaction: the total cost divided by `interactions`. |
| `average_cpm` | FLOAT | Average CPM | Average cost per 1,000 impressions (Google Ads `metrics.average_cpm`). |
| `interactions` | FLOAT | Interactions | The main user action for the ad format: clicks for text and shopping ads, views for video ads, and so on. |
| `interaction_rate` | FLOAT | Interaction Rate | Interactions divided by impressions. |

# Example Questions

- Which ads have the lowest click-through rate within their `ad group`?
- Which landing pages (final URLs) bring the cheapest conversions?
- How do ad types compare on cost per conversion?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the ad belongs to.
  - [Ad's Campaign](./campaigns.md) — The campaign whose ad group holds this ad — its settings, not its results.
