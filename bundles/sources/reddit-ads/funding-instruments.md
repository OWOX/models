---
title: "Funding Instruments"
description: |
  One row per funding instrument, the payment method that campaigns spend against: its name, currency, credit limit, the current billable amount, start and end time, whether it can serve, and the reasons it cannot. A campaign points to its funding instrument with `funding_instrument_id`.

  The schema describes `billable_amount` as the current outstanding debt in local micro-currency. When the billable amount exceeds the credit limit, the campaigns linked to the instrument stop running.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Reddit Ads connector — Funding Instruments endpoint (`funding-instruments`)"
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20Funding%20Instruments"
    title: "Reddit Ads API reference — List%20Funding%20Instruments"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `funding-instruments`
- **Default destination table:** `reddit_ads_funding_instruments`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. The ID of the funding instrument. |
| `name` | STRING | The name of the funding instrument, if any. |
| `currency` | STRING | An ISO4217 currency code indicating the currency used in this invoice. |
| `credit_limit` | INTEGER | When the billable_amount exceeds this number, campaigns linked to this funding instrument will not run. |
| `billable_amount` | INTEGER | The current amount of outstanding debt on this funding instrument, in local micro-currency. |
| `start_time` | STRING | When set, campaigns linked to this funding instrument will not deliver unless the current time is beyond this ISO-8601 time. |
| `end_time` | STRING | When set, campaigns linked to this funding instrument will not deliver unless the current time is before this ISO-8601 time. |
| `is_servable` | BOOLEAN | When true, campaigns linked to this funding instrument are allowed to run. |
| `reasons_not_servable` | STRING | Contains a list of reasons why this funding instrument is not servable. When this list is empty, it is servable. |

# Example Questions

- Which funding instruments are not servable, and why?
- Which funding instruments are closest to their credit limit?
- Which funding instruments have a start or end time set?
