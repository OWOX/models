---
title: "Geo Stats"
description: |
  Daily campaign performance by country and by how the location was matched: impressions, clicks, cost, conversions and conversion value. One row per campaign, country, location type and `date`.

  `location_type` separates people who were physically in a country from people who searched for it. The country appears only as an ID; join it to Geo Target Constants on `country_criterion_id` for its name.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/GoogleAdsFieldsSchema.js"
    title: "OWOX Data Marts Google Ads connector — Geo Stats endpoint (`geo_stats`)"
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/geographic_view"
    title: "Google Ads API reference — geographic_view"
---

## Connector endpoint

- **Endpoint:** Google Ads · `geo_stats`
- **Default destination table:** `google_ads_geo_stats`
- **Unique keys:** `campaign_id`, `country_criterion_id`, `location_type`, `date`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `country_criterion_id` | STRING | Country Criterion ID | PK. Criterion ID for the country (maps to geo_target_constant_id in geo_target_constants table) |
| `location_type` | STRING | Location Type | PK. Geo targeting type: AREA_OF_INTEREST (user searched for this location) or LOCATION_OF_PRESENCE (user was physically in this location) |
| `date` | STRING | Date | PK. Date for time series data |
| `campaign_id` | STRING | Campaign ID | PK. Campaign ID |
| `campaign_name` | STRING | Campaign Name | Campaign Name |
| `campaign_status` | STRING | Campaign Status | Campaign Status (ENABLED, PAUSED, REMOVED) |
| `impressions` | NUMERIC | Impressions | Number of Impressions |
| `clicks` | NUMERIC | Clicks | Number of Clicks |
| `cost_micros` | NUMERIC | Cost Micros | Cost in Micros |
| `conversions` | NUMERIC | Conversions | Number of Conversions |
| `conversions_value` | NUMERIC | Conversions Value | Total Conversion Value |
| `ctr` | NUMERIC | CTR | Click-Through Rate |
| `average_cpc` | NUMERIC | Average CPC | Average Cost Per Click |
| `all_conversions` | NUMERIC | All Conversions | All Conversions (includes cross-device and view-through) |
| `all_conversions_value` | NUMERIC | All Conversions Value | All Conversions Value |
| `view_through_conversions` | NUMERIC | View Through Conversions | View-Through Conversions |
| `cost_per_conversion` | NUMERIC | Cost per Conversion | Cost Per Conversion |
| `conversion_rate` | NUMERIC | Conversion Rate | Conversion Rate |

# Example Questions

- Which countries bring the most conversions, and at what cost per conversion?
- Do people in a country convert differently from people searching for it?
- Which campaigns spend in countries outside the intended markets?

## Joins

- [Campaigns](./campaigns.md) — `campaign_id = campaign_id` [N:1] — The campaign the country row reports on.
  - Description: The campaign the country row reports on.
- [Geo Target Constants](./geo-target-constants.md) — `country_criterion_id = geo_target_constant_id` [N:1] — The country's name and ISO code.
  - Description: The country's name and ISO code.
