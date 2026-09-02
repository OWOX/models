---
title: "Search Requests"
description: |
  One row per search a buyer runs — the top of the demand funnel and the cleanest read on
  marketplace liquidity. Each request records the category searched, how many results came
  back, whether the buyer clicked, and whether the search converted into an order, along
  with the time it took to match. Searches that return nothing, or return results but never
  convert, are the "demand with no fill" signal a liquidity analyst hunts for.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-02T16:20:51.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `request_id` | STRING | Request ID | PK. Unique search request identifier. |
| `buyer_id` | STRING | Buyer ID | Buyer who made the search. FK to [Buyer](./buyer.md) |
| `category_id` | STRING | Category ID | Category the search was scoped to. FK to [Category](./category.md) |
| `requested_at` | TIMESTAMP | Requested At | When the search was made. |
| `query` | STRING | Query | Raw search text entered by the buyer. |
| `results_count` | INTEGER | Results Count | Number of results returned. |
| `clicked` | BOOLEAN | Clicked | Whether the buyer clicked a result. |
| `converted` | BOOLEAN | Converted | Whether the search led to an order. |
| `order_id` | STRING | Order ID | Order the search converted into, if any. FK to [Orders](./orders.md) |
| `time_to_match_mins` | FLOAT | Time To Match Mins | Search → transaction latency in minutes (null unless converted). |

# Example Questions

- Which `categories` and regions show strong demand but weak fill — searches that return few results or rarely convert?
- What is the search-to-order conversion rate, and where in the funnel (no results, no click, no conversion) does demand leak?
- For searches that do convert, how long is the time to match and what GMV do they drive?

## Joins

- [Buyer](./buyer.md) — `buyer_id = buyer_id` — The buyer who ran this search.
- [Category](./category.md) — `category_id = category_id` — The category searched in.
- [Orders](./orders.md) — `order_id = order_id` — The order this search led to, where it converted.
