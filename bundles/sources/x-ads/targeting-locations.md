---
title: "Targeting Locations"
description: |
  A reference table of X targeting locations: the location's hex ID (`targeting_value`), its name, location type and two-letter ISO country code. It carries no performance, only names.

  The connector requests the location type COUNTRIES only, so it holds countries, not regions, cities or postal codes. [Ad Performance by Country](./ad-performance-by-country.md) joins here on `country`, which holds this table's `targeting_value`.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/XAds/XAdsAPIReference/targetingLocationsFields.js"
    title: "OWOX Data Marts X Ads connector — Targeting Locations endpoint (`targeting_locations`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://developer.x.com/en/docs/x-ads-api/campaign-management/api-reference/targeting-criteria"
    title: "X Ads API reference — Targeting Locations"
---

## Connector endpoint

- **Endpoint:** X Ads · `targeting_locations`
- **Default destination table:** `x_ads_targeting_locations`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Unique keys:** `targeting_value`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `targeting_value` | STRING | Targeting Value | PK. Unique hex ID for this location (e.g. 96683cc9126741d1). Use this to join with the country field in stats_by_country. |
| `name` | STRING | Name | Human-readable location name (e.g. United States, California). |
| `location_type` | STRING | Location Type | Type of location: COUNTRIES, REGIONS, CITIES, METROS, or POSTAL_CODES. |
| `country_code` | STRING | Country Code | ISO 2-letter country code (e.g. US, DE, NL). |

# Example Questions

- What are the names and country codes of the locations the connector loads?
- Which country code belongs to each location ID?
- How many locations of each location type are in the table?
