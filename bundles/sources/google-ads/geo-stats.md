---
title: "Geo Stats"
description: |
  Daily campaign performance by country and by how the location was matched: impressions, clicks, cost, conversions and conversion value. One row per campaign, country, location type and `date`.

  `location_type` separates people who were physically in a country from people who searched for it. The country appears only as an ID; join it to Geo Target Constants on `country_criterion_id` for its name.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/geoTargetFields.js"
    title: "OWOX Data Marts Google Ads connector — Geo Stats endpoint (`geo_stats`)"
    last_modified: 2026-08-06
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/geographic_view"
    title: "Google Ads API reference — Geo Stats"
---

## Connector endpoint

- **Endpoint:** Google Ads · `geo_stats`
- **Default destination table:** `google_ads_geo_stats`
- **Last updated:** 2026-08-06 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([46a39ea85](https://github.com/OWOX/owox-data-marts/commit/46a39ea85f7ef1eb7b88e15980b8777bf9facdd1))
- **Google Ads API version:** v25
- **Unique keys:** `campaign_id`, `country_criterion_id`, `location_type`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `country_criterion_id` | STRING | Country Criterion ID | PK. Criterion ID for the country (maps to geo_target_constant_id in geo_target_constants table) FK to [Geo Target Constants](./geo-target-constants.md) |
| `location_type` | STRING | Location Type | PK. Geo targeting type: AREA_OF_INTEREST (user searched for this location) or LOCATION_OF_PRESENCE (user was physically in this location) |
| `date` | STRING | Date | PK. Date for time series data |
| `campaign_id` | STRING | Campaign ID | PK. ID of the campaign the row belongs to. FK to [Campaigns](./campaigns.md) |
| `campaign_name` | STRING | Campaign Name | Name of the campaign. |
| `campaign_status` | STRING | Campaign Status | Campaign Status (ENABLED, PAUSED, REMOVED) |
| `impressions` | FLOAT | Impressions | Times the ad appeared on a search results page or a website on the Google Network. |
| `clicks` | FLOAT | Clicks | Clicks on the ads; `ctr` is clicks divided by impressions. |
| `cost_micros` | FLOAT | Cost Micros | Cost in Micros |
| `conversions` | FLOAT | Conversions | Conversions from the actions counted in the Conversions column (include_in_conversions_metric on), the ones conversion-based bidding optimizes for; `all_conversions` adds the rest. |
| `conversions_value` | FLOAT | Conversions Value | Value of `conversions`: only the actions counted in the Conversions column (include_in_conversions_metric on); `all_conversions_value` adds the rest. |
| `ctr` | FLOAT | CTR | Click-Through Rate |
| `average_cpc` | FLOAT | Average CPC | Average Cost Per Click |
| `all_conversions` | FLOAT | All Conversions | Conversions from every conversion action, including those not counted in `conversions` (include_in_conversions_metric off). |
| `all_conversions_value` | FLOAT | All Conversions Value | Value of `all_conversions`: every conversion action, including those not counted in `conversions_value`. |
| `view_through_conversions` | FLOAT | View Through Conversions | Conversions by people who saw an image or rich media ad and later converted on the site without interacting with another ad. |
| `cost_per_conversion` | FLOAT | Cost Per Conversion | Cost of ad interactions divided by `conversions`, so it counts only the actions included in the Conversions column. |
| `conversion_rate` | FLOAT | Conversion Rate | Conversions from interactions divided by `interactions` (Google Ads `conversions_from_interactions_rate`); counts only the actions included in `conversions`. |

# Example Questions

- Which countries bring the most conversions, and at what cost per conversion?
- Do people in a country convert differently from people searching for it?
- Which `campaigns` spend in countries outside the intended markets?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = campaign_id` [N:1] — The campaign the country row reports on.
- [Geo Target Constants](./geo-target-constants.md) — `country_criterion_id = geo_target_constant_id` [N:1] — The country's name and ISO code.
