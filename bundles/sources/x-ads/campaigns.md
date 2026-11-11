---
title: "Campaigns"
description: |
  One row per campaign: its name, entity status and effective status, whether it is servable and why not, budget optimization, daily and total budget, duration in days, frequency cap, currency, funding instrument, purchase order number, and created and updated times. It holds settings, not results.

  Budget amounts are in micros: the X Ads docs write 5.50 USD as 5500000, in the currency of the funding instrument. The `account_id` column is not part of the campaign the API returns; the connector fills it with the account being loaded, and only when the field is selected.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/XAds/XAdsAPIReference/campaignFields.js"
    title: "OWOX Data Marts X Ads connector — Campaigns endpoint (`campaigns`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/campaign-management"
    title: "X Ads API reference — Campaigns"
---

## Connector endpoint

- **Endpoint:** X Ads · `campaigns`
- **Default destination table:** `x_ads_campaigns`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `name` | STRING | Name | The name of the campaign |
| `budget_optimization` | STRING | Budget Optimization | Budget optimization strategy (e.g. LINE_ITEM) |
| `reasons_not_servable` | STRING | Reasons Not Servable | Reasons why the campaign is not servable. Stored as a JSON string. |
| `servable` | BOOLEAN | Servable | Whether the campaign is servable |
| `purchase_order_number` | STRING | Purchase Order Number | The purchase order number set on the campaign; X's example responses show it as null. |
| `effective_status` | STRING | Effective Status | Effective status of the campaign (e.g. PAUSED) |
| `daily_budget_amount_local_micro` | INTEGER | Daily Budget Amount Local Micro | Daily budget amount in micros (nullable) |
| `funding_instrument_id` | STRING | Funding Instrument ID | ID of the funding instrument |
| `duration_in_days` | INTEGER | Duration In Days | Duration of the campaign in days (nullable) |
| `standard_delivery` | BOOLEAN | Standard Delivery | Whether standard delivery is enabled (nullable) |
| `total_budget_amount_local_micro` | INTEGER | Total Budget Amount Local Micro | Total budget amount in micros (nullable) |
| `id` | STRING | ID | PK. The unique identifier for the campaign |
| `entity_status` | STRING | Entity Status | Entity status of the campaign |
| `frequency_cap` | INTEGER | Frequency Cap | Frequency cap (nullable) |
| `currency` | STRING | Currency | Currency code (e.g. USD) |
| `created_at` | DATETIME | Created At | Timestamp when the campaign was created |
| `updated_at` | DATETIME | Updated At | Timestamp when the campaign was last updated |
| `deleted` | BOOLEAN | Deleted | Whether the campaign is deleted |
| `account_id` | STRING | Account ID | ID of the account FK to [Accounts](./accounts.md) |

# Example Questions

- Which campaigns are active, and which are not servable and for what reason?
- Which campaigns have a daily budget and which have only a total budget?
- How many campaigns does each `account` run on each budget optimization setting?

## Joins

- [Accounts](./accounts.md) — `account_id = id` [N:1] — The account the campaign belongs to.
