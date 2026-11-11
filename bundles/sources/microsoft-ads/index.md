---
title: "Microsoft Ads"
description: |
  What the OWOX Data Marts Microsoft Ads connector loads, and how the pieces fit together. A Microsoft Advertising account holds campaigns, campaigns hold ad groups (and asset groups), and ad groups hold ads and keywords. The connector loads this structure with the Bulk service into one current-state table, [Campaigns](./campaigns.md), and the daily performance with the Reporting service into two time-series tables: [Ad Performance Report](./ad-performance-report.md), one row per ad, and [User Location Performance Report](./user-location-performance-report.md), one row per campaign, ad group and location.

  [Campaigns](./campaigns.md) is not a list of campaigns only. It is the Bulk download, so campaign, ad group, asset group and keyword rows sit in the same table, told apart by the `Type` column, and `ParentId` points from a row to the row above it: from an ad group to its campaign, from a campaign to its account. Its `Id` is the ID of whatever the row is: a report's `CampaignId` matches the rows whose `Type` is Campaign, its `AdGroupId` the rows whose `Type` is Ad Group, and the location report's `AssetGroupId` the rows whose `Type` is Asset Group. The two reports join to Campaigns on `CampaignId`, which is the line the drawing shows; match `AdGroupId` (and the location report's `AssetGroupId`) to `Id` the same way. Filter on `Type` after you join.

  The two report tables repeat `AccountId`, `CampaignId` and `AdGroupId` and are segmented by many columns at once, such as device, network and match type, so one ad on one day can appear in several rows. Sum the rows before you compare days or ads, and read `Spend` together with `CurrencyCode`, the account currency.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`8ac4b37c3`](https://github.com/OWOX/owox-data-marts/commit/8ac4b37c386647fabc621066a7db9a3daeb839f1), on Microsoft Advertising API v13.
tags: ["owox", "index", "connector", "microsoft-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/8ac4b37c386647fabc621066a7db9a3daeb839f1/packages/connectors/src/Sources/MicrosoftAds"
    title: "OWOX Data Marts — Microsoft Ads connector source"
    last_modified: 2026-09-28
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Ievgen Krasovytskyi](https://github.com/ikrasovytskyi)

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Ad Performance Report](./ad-performance-report.md) | 95 | 2026-09-28 | Daily performance of each ad: impressions, clicks, spend, conversions, revenue, assists and return on ad spend, plus the ad's text, type, status and URLs, and for video ads the view and completion counts. |
| [Campaigns](./campaigns.md) | 54 | 2026-09-28 | The Bulk download of the account structure, as one table. |
| [User Location Performance Report](./user-location-performance-report.md) | 81 | 2026-05-21 | Daily performance by the physical location of the user: impressions, clicks, spend, conversions, revenue and assists, with the country, state, metro area, city, county and postal code where the user was physically located when they clicked, and the `QueryIntent` columns for the location the search was about. |

# Example Questions

- Which `campaigns` are active, and which bid strategy type does each use?
- How do spend and qualified conversions differ between devices and networks?
- Which countries and cities bring the most clicks, and which of them convert?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/microsoft-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Microsoft Ads model diagram](../../res/screens/sources/microsoft-ads.svg)
