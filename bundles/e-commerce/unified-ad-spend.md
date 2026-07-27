---
title: "Unified Ad Spend"
description: |
  Advertising spend, clicks and impressions from every paid platform the business runs —
  Google, Facebook, TikTok, LinkedIn, Microsoft, Reddit and X — brought together on one daily
  grain with a common source, medium and campaign naming. Because it shares that naming with
  the storefront's traffic sources, spend can be set against the sessions and revenue it
  produced instead of being read on its own.

  Unlike every other mart in this model, this one is defined by **SQL inside the data mart
  itself** rather than by a database view — on purpose. Each advertising platform is
  collected by its own connector-based data mart, each with a different schema and naming,
  and this query is how those separate marts are unified: seven `SELECT`s over the tables the
  connectors land in, normalised to one grain and `UNION ALL`ed together. Open Data Setup to
  read it — every block is commented with the connector data mart it draws from and links
  straight to it, which is the shortest demonstration of how connector data becomes
  reportable with plain SQL.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T17:20:48.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The calendar date when the advertising activity occurred. |
| `source` | STRING | The name of the advertising platform or network where the traffic originated. FK to [Traffic Sources](./traffic-sources.md) |
| `medium` | STRING | The marketing channel or payment model used, such as cost-per-click. |
| `campaign` | STRING | The specific marketing campaign name associated with the ad spend. |
| `spend` | FLOAT | The total cost of advertising incurred during the specified period. |
| `clicks` | INTEGER | The total number of times users clicked on the advertisements. |
| `impressions` | INTEGER | The total number of times the advertisements were displayed to users. |

# Example Questions

- What is blended and per-channel acquisition cost, and which channels return the most revenue per unit spent?
- How do click-through and cost-per-click compare across platforms week over week?
- Which campaigns are scaling spend without a matching lift in `orders`?

## Joins

- [Traffic Sources](./traffic-sources.md) — `source = source`
