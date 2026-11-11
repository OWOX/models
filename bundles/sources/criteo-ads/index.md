---
title: "Criteo Ads"
description: |
  What the OWOX Data Marts Criteo Ads connector loads, and how the pieces fit together. The connector loads four reports, all time series and all requested one day at a time for each advertiser, in UTC and in one report currency set in the connector (USD by default): [Statistics](./statistics.md), the campaign report with the most metrics; [Placements](./placements.md), performance by publisher placement; [Placement Categories](./placement-categories.md), performance by the content category of the page; and [Transactions](./transactions.md), the individual transactions with their attribution flag.

  There are no tables of campaigns, adsets or advertisers, only these reports, and they sit at different levels. Statistics is keyed by campaign, adset, ad and day, Placements by adset, placement, environment and day, Placement Categories by category and day, and Transactions by transaction. Each repeats the advertiser ID, but none of them is a parent of another, so this bundle draws no joins. Compare the tables on the advertiser ID and the day, and aggregate first. The column names are cased differently by endpoint: Statistics uses `AdvertiserId`, `AdsetId` and `Day`, while Placements, Placement Categories and Transactions use `advertiserId`, `adsetId` and `day`, so a query across them needs the right case for each table.

  Metric names in Statistics follow the Criteo pattern of measure, optional `All` for cross-device, attribution model and lookback window: `SalesAllPc30d` is sales including cross-device, post-click, over 30 days, and `Pv24h` is post-view over 24 hours.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`5f70df302`](https://github.com/OWOX/owox-data-marts/commit/5f70df30299b26819765a8c69131738403f0add0), on Criteo Marketing Solutions API 2026-01.
tags: ["owox", "index", "connector", "criteo-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/5f70df30299b26819765a8c69131738403f0add0/packages/connectors/src/Sources/CriteoAds"
    title: "OWOX Data Marts — Criteo Ads connector source"
    last_modified: 2026-06-16
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Ievgen Krasovytskyi](https://github.com/ikrasovytskyi)

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Placement Categories](./placement-categories.md) | 8 | 2026-06-16 | Daily performance by the content category of the publisher page where the ad was served: displays, clicks, and sales under a 30-day post-click and a 1-day post-view window. |
| [Placements](./placements.md) | 21 | 2026-06-16 | Daily performance by publisher placement: clicks, displays and cost, with sales, revenue, cost of sale, ROAS, cost per order and conversion rate under a 30-day post-click and a 1-day post-view window. |
| [Statistics](./statistics.md) | 156 | 2026-06-16 | Daily campaign statistics: displays, clicks, advertiser cost, visits, reach, and sales, revenue, average cart, conversion rate, cost of sale, cost per order and ROAS under each attribution model and lookback window, plus app install and omnichannel metrics. |
| [Transactions](./transactions.md) | 11 | 2026-06-16 | Transaction-level data: one row per transaction, with its date and amount, its currency, the adset name, the type of event that drove it (click or display) and that event's date, whether it was attributed to a Criteo ad, and whether it happened on a different device from the one where the ad was seen. |

# Example Questions

- Which campaigns and adsets spend the most for the fewest attributed sales?
- How do post-click and post-view sales compare, and how do their windows change the answer?
- Which publisher `placements` and content categories bring the most clicks and sales?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/criteo-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->
