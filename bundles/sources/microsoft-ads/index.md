---
title: "Microsoft Ads"
description: |
  What the OWOX Data Marts Microsoft Ads connector loads, and how the pieces fit together. A Microsoft Advertising account holds campaigns, campaigns hold ad groups (and asset groups), and ad groups hold ads and keywords. The connector loads this structure with the Bulk service into one current-state table, [Campaigns](./campaigns.md), and the daily performance with the Reporting service into two time-series tables: [Ad Performance Report](./ad-performance-report.md), one row per ad, and [User Location Performance Report](./user-location-performance-report.md), one row per campaign, ad group and location.

  [Campaigns](./campaigns.md) is not a list of campaigns only. It is the Bulk download, so campaign, ad group, asset group and keyword rows sit in the same table, told apart by the `Type` column, and `ParentId` points from a row to the row above it: from an ad group to its campaign, from a campaign to its account. Its `Id` is the ID of whatever the row is, so it matches a report's `CampaignId` only on the rows whose `Type` is Campaign. For that reason this bundle draws no joins between the tables; filter on `Type` before you match.

  The two report tables repeat `AccountId`, `CampaignId` and `AdGroupId` and are segmented by many columns at once, such as device, network and match type, so one ad on one day can appear in several rows. Sum the rows before you compare days or ads, and read `Spend` together with `CurrencyCode`, the account currency.
tags: ["owox", "index", "connector", "microsoft-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/9375f07a09a2be2007a8a3a3d620acea174c7c3c/packages/connectors/src/Sources/MicrosoftAds"
    title: "OWOX Data Marts — Microsoft Ads connector source"
---

3 tables, 225 fields, 0 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Ad Performance Report](./ad-performance-report.md) | 92 | Daily ad performance — impressions, clicks, spend, and conversions segmented by device, network, and match type. |
| [Campaigns](./campaigns.md) | 52 | Your campaign and ad group structure — type, status, bid strategy, budget, and keyword settings. |
| [User Location Performance Report](./user-location-performance-report.md) | 81 | Daily performance by user physical location — impressions, clicks, spend, and conversions broken down by country, state, and city. |

# Example Questions

- Which campaigns are active, and which bid strategy type does each use?
- How do spend and qualified conversions differ between devices and networks?
- Which countries and cities bring the most clicks, and which of them convert?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/microsoft-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![Microsoft Ads model diagram](../../res/screens/sources/microsoft-ads.svg)
