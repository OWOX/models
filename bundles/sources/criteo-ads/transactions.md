---
title: "Transactions"
description: |
  Transaction-level data: one row per transaction, with its date and amount, its currency, the adset name, the type of event that drove it (click or display) and that event's date, whether it was attributed to a Criteo ad, and whether it happened on a different device from the one where the ad was seen.

  The table has the advertiser but no adset or campaign ID, only `adsetName`. `transactionDate` and `eventDate` are text in the form MM/DD/YYYY HH:MM:SS, and `attributedTransaction` and `crossDeviceTransaction` are text ("True" or "False", "Yes" or "No"), so convert them before filtering by date or flag.
tags: ["owox", "connector", "criteo-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/5f70df30299b26819765a8c69131738403f0add0/packages/connectors/src/Sources/CriteoAds/CriteoAdsAPIReference/CriteoAdsFieldsSchema.js"
    title: "OWOX Data Marts Criteo Ads connector — Transactions endpoint (`transactions`)"
  - id: "vendor-reference"
    resource: "https://developers.criteo.com/marketing-solutions/docs/transaction-ids"
    title: "Criteo Marketing Solutions API reference — transaction-ids"
---

## Connector endpoint

- **Endpoint:** Criteo Ads · `transactions`
- **Default destination table:** `criteo_ads_transactions`
- **Unique keys:** `advertiserId`, `transactionId`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `transactionId` | STRING | PK. The unique identifier for the transaction. |
| `transactionDate` | STRING | The date and time when the transaction occurred (MM/DD/YYYY HH:MM:SS). |
| `advertiserId` | STRING | PK. The unique identifier for the advertiser. |
| `advertiserName` | STRING | The name of the advertiser. |
| `adsetName` | STRING | The name of the adset that drove the transaction. |
| `eventType` | STRING | The type of event that triggered the attribution (click or display). |
| `eventDate` | STRING | The date and time of the click or view event that drove the transaction (MM/DD/YYYY HH:MM:SS). |
| `attributedTransaction` | STRING | Whether the transaction was attributed to a Criteo ad (returned as "True" / "False"). |
| `currency` | STRING | The currency of the transaction amount. |
| `amount` | NUMERIC | The transaction amount (order value). |
| `crossDeviceTransaction` | STRING | Whether the transaction occurred on a different device from the one where the ad was viewed (returned as "Yes" / "No"). |

# Example Questions

- How many attributed transactions were there per day, and what was their total amount?
- Which adsets drove the largest total transaction amount?
- What share of attributed transactions are cross-device, and are they driven by clicks or by displays?
