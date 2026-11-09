---
title: "Criteo Ads"
description: |
  What the OWOX Data Marts Criteo Ads connector loads, and how the pieces fit together. The connector loads four reports, all time series and all requested one day at a time for each advertiser, in UTC and in one report currency set in the connector (USD by default): [Statistics](./statistics.md), the campaign report with the most metrics; [Placements](./placements.md), performance by publisher placement; [Placement Categories](./placement-categories.md), performance by the content category of the page; and [Transactions](./transactions.md), the individual transactions with their attribution flag.

  There are no tables of campaigns, adsets or advertisers, only these reports, and they sit at different levels. Statistics is keyed by campaign, adset, ad and day, Placements by adset, placement, environment and day, Placement Categories by category and day, and Transactions by transaction. Each repeats the advertiser ID, but none of them is a parent of another, so this bundle draws no joins. Compare the tables on the advertiser ID and the day, and aggregate first. The column names are cased differently by endpoint: Statistics uses `AdvertiserId`, `AdsetId` and `Day`, while Placements, Placement Categories and Transactions use `advertiserId`, `adsetId` and `day`, so a query across them needs the right case for each table.

  Metric names in Statistics follow the Criteo pattern of measure, optional `All` for cross-device, attribution model and lookback window: `SalesAllPc30d` is sales including cross-device, post-click, over 30 days, and `Pv24h` is post-view over 24 hours.
tags: ["owox", "index", "connector", "criteo-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/5f70df30299b26819765a8c69131738403f0add0/packages/connectors/src/Sources/CriteoAds"
    title: "OWOX Data Marts — Criteo Ads connector source"
---

4 tables, 196 fields, 0 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Placement Categories](./placement-categories.md) | 8 | Performance metrics broken down by content category. |
| [Placements](./placements.md) | 21 | Performance metrics broken down by publisher placement. |
| [Statistics](./statistics.md) | 156 | Statistics and metrics for Criteo advertising campaigns. |
| [Transactions](./transactions.md) | 11 | Transaction-level data with individual order details attributed to Criteo ads. |

# Example Questions

- Which campaigns and adsets spend the most for the fewest attributed sales?
- How do post-click and post-view sales compare, and how do their windows change the answer?
- Which publisher placements and content categories bring the most clicks and sales?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/criteo-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![Criteo Ads model diagram](../../res/screens/sources/criteo-ads.svg)
