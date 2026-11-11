---
title: "Geo Target Constants"
description: |
  A reference table of Google's geographic targets: the English name, the fully qualified name, the ISO country code, the target type and status, and the parent target. It carries no performance, only names for the IDs other tables hold.

  The connector loads the targets of type Country only, so it resolves the country IDs in Geo Stats but not regions or cities.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/geoTargetConstantFields.js"
    title: "OWOX Data Marts Google Ads connector — Geo Target Constants endpoint (`geo_target_constants`)"
    last_modified: 2026-08-06
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/geo_target_constant"
    title: "Google Ads API reference — Geo Target Constants"
---

## Connector endpoint

- **Endpoint:** Google Ads · `geo_target_constants`
- **Default destination table:** `google_ads_geo_target_constants`
- **Last updated:** 2026-08-06 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([46a39ea85](https://github.com/OWOX/owox-data-marts/commit/46a39ea85f7ef1eb7b88e15980b8777bf9facdd1))
- **Google Ads API version:** v25
- **Unique keys:** `geo_target_constant_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `geo_target_constant_id` | STRING | Geo Target Constant ID | PK. Criterion ID - join key with country_criterion_id in geo_stats |
| `name` | STRING | Geo Target Name | English name of the geo target (e.g. United States, California, New York) |
| `country_code` | STRING | Country Code | ISO-3166-1 alpha-2 country code (e.g. US, GB, DE) |
| `target_type` | STRING | Geo Target Type | Type of geo target (e.g. Country, Region, City, MetroArea, PostalCode) |
| `status` | STRING | Geo Target Status | Status of the geo target constant (ENABLED or REMOVAL_PLANNED) |
| `canonical_name` | STRING | Canonical Name | Fully qualified name including parent targets (e.g. New York,New York,United States) |
| `parent_geo_target` | STRING | Parent Geo Target | Resource name of the parent geo target constant |

# Example Questions

- What are the names behind the country IDs in the `Geo Stats` table?
- Which countries are flagged as removal planned?
- Which ISO country code belongs to each country ID?
