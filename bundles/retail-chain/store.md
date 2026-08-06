---
title: "Store"
description: |
  Every location the chain trades from, and the handful of facts that decide what to expect of it:
  which format it trades as, how much selling space it has, the region and state it reports into,
  and when it opened. Format is the first thing to hold constant in any store comparison — a
  supercenter, a supermarket and a neighborhood market carry different assortments, draw different
  footfall and turn their space at different rates, so ranking them against one another says more
  about the format than about the store. Selling area is the denominator behind sales per square
  foot, the standard measure of retail productivity, and the opening date is what makes a
  like-for-like read possible at all, since a store needs a full year behind it before this year
  can be set against last. This is the dimension every sales, stock, shrink and footfall number in
  the model rolls up through.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T00:46:46.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `store_id` | STRING | Store ID | PK. Unique identifier for this location. |
| `name` | STRING | Store Name | Store name as it appears in reporting and on the fascia. |
| `region` | STRING | Region | Reporting region the store belongs to — the level the estate is managed at. |
| `state` | STRING | State | US state the store trades in, e.g. `TX`, `OH`, `FL`. The standard external comparison cut. |
| `city` | STRING | City | City the store is located in. |
| `format` | STRING | Store Format | Trading format: `supercenter`, `supermarket` or `neighborhood_market`. Hold this constant when comparing stores — the three formats trade nothing alike. |
| `opened_at` | DATE | Opened Date | Date the store opened. Like-for-like comparison needs at least thirteen months of history behind a store. |
| `selling_area_sqft` | INTEGER | Selling Area (sq ft) | Trading floor area in square feet, excluding back-of-house. The denominator for sales per square foot. |
| `is_active` | BOOLEAN | Is Active | True while the location is still trading. Exclude closed sites before comparing per-store averages. |

# Example Questions

- Which formats earn most per square foot of selling space, and does that ranking hold across regions?
- How do stores opened within the last year compare against the mature estate once their opening period is excluded?
- Which regions carry the most selling space relative to the trade they actually do?
