---
title: "Targeting Locations"
description: |
  A reference table of X targeting locations: the location's hex ID (`targeting_value`), its name, location type and two-letter ISO country code. It carries no performance, only names.

  The connector requests the location type COUNTRIES only, so it holds countries, not regions, cities or postal codes. The schema describes `targeting_value` as the ID to match with the `country` column of Ad Performance by Country.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/XAds/XAdsAPIReference/XAdsFieldsSchema.js"
    title: "OWOX Data Marts X Ads connector — Targeting Locations endpoint (`targeting_locations`)"
  - id: "vendor-reference"
    resource: "https://developer.x.com/en/docs/x-ads-api/campaign-management/api-reference/targeting-criteria"
    title: "X Ads API reference — targeting-criteria"
---

## Connector endpoint

- **Endpoint:** X Ads · `targeting_locations`
- **Default destination table:** `x_ads_targeting_locations`
- **Unique keys:** `targeting_value`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `targeting_value` | STRING | PK. Unique hex ID for this location (e.g. 96683cc9126741d1). Use this to join with the country field in stats_by_country. |
| `name` | STRING | Human-readable location name (e.g. United States, California). |
| `location_type` | STRING | Type of location: COUNTRIES, REGIONS, CITIES, METROS, or POSTAL_CODES. |
| `country_code` | STRING | ISO 2-letter country code (e.g. US, DE, NL). |

# Example Questions

- What are the names and country codes of the locations the connector loads?
- Which country code belongs to each location ID?
- How many locations of each location type are in the table?
