---
title: "Transactions"
description: |
  Transaction-level data: one row per transaction, with its date and amount, its currency, the adset name, the type of event that drove it (click or display) and that event's date, whether it was attributed to a Criteo ad, and whether it happened on a different device from the one where the ad was seen.

  The table has the advertiser but no adset or campaign ID, only `adsetName`. `transactionDate` and `eventDate` are text in the form MM/DD/YYYY HH:MM:SS, and `attributedTransaction` and `crossDeviceTransaction` are text ("True" or "False", "Yes" or "No"), so convert them before filtering by date or flag.
tags: ["owox", "connector", "criteo-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/5f70df30299b26819765a8c69131738403f0add0/packages/connectors/src/Sources/CriteoAds/CriteoAdsAPIReference/transactionFields.js"
    title: "OWOX Data Marts Criteo Ads connector — Transactions endpoint (`transactions`)"
    last_modified: 2026-06-16
  - id: "vendor-reference"
    resource: "https://developers.criteo.com/marketing-solutions/docs/transaction-ids"
    title: "Criteo Marketing Solutions API reference — Transactions"
---

## Connector endpoint

- **Endpoint:** Criteo Ads · `transactions`
- **Default destination table:** `criteo_ads_transactions`
- **Last updated:** 2026-06-16 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([25b43f6d8](https://github.com/OWOX/owox-data-marts/commit/25b43f6d816a96843bfe44759b2ef83226aa9506))
- **Criteo Marketing Solutions API version:** 2026-01
- **Unique keys:** `advertiserId`, `transactionId`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `transactionId` | STRING | Transaction ID | PK. The unique identifier for the transaction. |
| `transactionDate` | STRING | Transaction Date | The date and time when the transaction occurred (MM/DD/YYYY HH:MM:SS). |
| `advertiserId` | STRING | Advertiser ID | PK. The unique identifier for the advertiser. |
| `advertiserName` | STRING | Advertiser Name | The name of the advertiser. |
| `adsetName` | STRING | Adset Name | The name of the adset that drove the transaction. |
| `eventType` | STRING | Event Type | The type of event that triggered the attribution (click or display). |
| `eventDate` | STRING | Event Date | The date and time of the click or view event that drove the transaction (MM/DD/YYYY HH:MM:SS). |
| `attributedTransaction` | STRING | Attributed Transaction | Whether the transaction was attributed to a Criteo ad (returned as "True" / "False"). |
| `currency` | STRING | Currency | The currency of the transaction amount. |
| `amount` | FLOAT | Amount | The transaction amount (order value). |
| `crossDeviceTransaction` | STRING | Cross Device Transaction | Whether the transaction occurred on a different device from the one where the ad was viewed (returned as "Yes" / "No"). |

# Example Questions

- How many attributed transactions were there per day, and what was their total amount?
- Which adsets drove the largest total transaction amount?
- What share of attributed transactions are cross-device, and are they driven by clicks or by displays?
