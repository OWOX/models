---
title: "Geo Target Constants"
description: |
  A reference table of Google's geographic targets: the English name, the fully qualified name, the ISO country code, the target type and status, and the parent target. It carries no performance, only names for the IDs other tables hold.

  The connector loads the targets of type Country only, so it resolves the country IDs in Geo Stats but not regions or cities.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/GoogleAdsFieldsSchema.js"
    title: "OWOX Data Marts Google Ads connector — Geo Target Constants endpoint (`geo_target_constants`)"
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/geo_target_constant"
    title: "Google Ads API reference — geo_target_constant"
---

## Connector endpoint

- **Endpoint:** Google Ads · `geo_target_constants`
- **Default destination table:** `google_ads_geo_target_constants`
- **Unique keys:** `geo_target_constant_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `geo_target_constant_id` | STRING | PK. Criterion ID - join key with country_criterion_id in geo_stats |
| `name` | STRING | English name of the geo target (e.g. United States, California, New York) |
| `country_code` | STRING | ISO-3166-1 alpha-2 country code (e.g. US, GB, DE) |
| `target_type` | STRING | Type of geo target (e.g. Country, Region, City, MetroArea, PostalCode) |
| `status` | STRING | Status of the geo target constant (ENABLED or REMOVAL_PLANNED) |
| `canonical_name` | STRING | Fully qualified name including parent targets (e.g. New York,New York,United States) |
| `parent_geo_target` | STRING | Resource name of the parent geo target constant |

# Example Questions

- What are the names behind the country IDs in the Geo Stats table?
- Which countries are flagged as removal planned?
- Which ISO country code belongs to each country ID?
