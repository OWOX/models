---
title: "Placements"
description: |
  Daily performance by publisher placement: clicks, displays and cost, with sales, revenue, cost of sale, ROAS, cost per order and conversion rate under a 30-day post-click and a 1-day post-view window. One row per advertiser, adset, `environment` (Web, Android or iOS), `placement` and `day`.

  The connector requests it from the Criteo placements report, and the `day` column is filled in from the date it requested. The table has no currency column and no campaign or ad ID: amounts come in the report currency set in the connector, and the adset is the lowest level.
tags: ["owox", "connector", "criteo-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/5f70df30299b26819765a8c69131738403f0add0/packages/connectors/src/Sources/CriteoAds/CriteoAdsAPIReference/CriteoAdsFieldsSchema.js"
    title: "OWOX Data Marts Criteo Ads connector — Placements endpoint (`placements`)"
  - id: "vendor-reference"
    resource: "https://developers.criteo.com/marketing-solutions/docs/placement"
    title: "Criteo Marketing Solutions API reference — placement"
---

## Connector endpoint

- **Endpoint:** Criteo Ads · `placements`
- **Default destination table:** `criteo_ads_placements`
- **Unique keys:** `advertiserId`, `adsetId`, `day`, `environment`, `placement`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `advertiserId` | STRING | PK. The unique identifier for the advertiser. |
| `adsetId` | STRING | PK. The unique identifier for the adset. |
| `adsetName` | STRING | The name of the adset. |
| `environment` | STRING | PK. The environment where the ad was served (Web, Android, iOS). |
| `placement` | STRING | PK. The publisher placement where the ad was served. |
| `day` | DATE | PK. The day of the placement data (YYYY-MM-DD format). |
| `clicks` | INTEGER | The number of clicks on this placement. |
| `displays` | INTEGER | The number of ad impressions served on this placement. |
| `cost` | NUMERIC | Total money spent on this placement. |
| `salesPc30d` | INTEGER | The number of transactions or conversions (30-day post-click). |
| `salesPv1d` | INTEGER | The number of transactions or conversions (1-day post-view). |
| `revenuePc30d` | NUMERIC | The revenue generated (30-day post-click). |
| `revenuePv1d` | NUMERIC | The revenue generated (1-day post-view). |
| `cosPc30d` | NUMERIC | The cost of sale (30-day post-click). |
| `cosPv1d` | NUMERIC | The cost of sale (1-day post-view). |
| `roasPc30d` | NUMERIC | The return on ad spend (30-day post-click). |
| `roasPv1d` | NUMERIC | The return on ad spend (1-day post-view). |
| `cpoPc30d` | NUMERIC | The cost per order (30-day post-click). |
| `cpoPv1d` | NUMERIC | The cost per order (1-day post-view). |
| `cvrPc30d` | NUMERIC | The conversion rate (30-day post-click). |
| `cvrPv1d` | NUMERIC | The conversion rate (1-day post-view). |

# Example Questions

- Which placements spend the most, and what 30-day post-click revenue do they return?
- How do cost and ROAS differ between Web, Android and iOS?
- Which adsets have placements with high displays but no clicks?
