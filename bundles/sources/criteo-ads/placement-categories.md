---
title: "Placement Categories"
description: |
  Daily performance by the content category of the publisher page where the ad was served: displays, clicks, and sales under a 30-day post-click and a 1-day post-view window. One row per advertiser, `categoryId` and `day`.

  The category is the IAB content category of the page, named in `categoryName`. It is not the product category of the Statistics table. The connector reads it from the same Criteo placements report as Placements, with category dimensions, so it has neither adset nor cost columns.
tags: ["owox", "connector", "criteo-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/5f70df30299b26819765a8c69131738403f0add0/packages/connectors/src/Sources/CriteoAds/CriteoAdsAPIReference/CriteoAdsFieldsSchema.js"
    title: "OWOX Data Marts Criteo Ads connector — Placement Categories endpoint (`placement_categories`)"
  - id: "vendor-reference"
    resource: "https://developers.criteo.com/marketing-solutions/docs/placement-category"
    title: "Criteo Marketing Solutions API reference — placement-category"
---

## Connector endpoint

- **Endpoint:** Criteo Ads · `placement_categories`
- **Default destination table:** `criteo_ads_placement_categories`
- **Unique keys:** `advertiserId`, `day`, `categoryId`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `advertiserId` | STRING | PK. The unique identifier for the advertiser. |
| `categoryId` | STRING | PK. The unique identifier for the content category. |
| `categoryName` | STRING | The IAB content category of the publisher page where the ad was served. |
| `day` | DATE | PK. The day of the placement category data (YYYY-MM-DD format). |
| `displays` | INTEGER | The number of ad impressions served in this category. |
| `clicks` | INTEGER | The number of clicks in this category. |
| `salesPc30d` | INTEGER | The number of transactions or conversions (30-day post-click). |
| `salesPv1d` | INTEGER | The number of transactions or conversions (1-day post-view). |

# Example Questions

- Which content categories get the most displays and clicks?
- Which categories have the most post-click 30-day sales per display?
- How did clicks in a category change from day to day?
