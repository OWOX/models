---
type: "OWOX Data Mart"
title: "Orders"
description: "The match — one row per order, carrying GMV, take rate, platform revenue and seller payout."
tags: ["owox"]
timestamp: 2026-07-24T10:45:13.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `order_id` | STRING | PK. Unique order identifier. |
| `buyer_id` | STRING | Buyer on the order. FK to [Buyer](./buyer.md) |
| `seller_id` | STRING | Seller on the order (always the listing's owner). FK to [Seller](./seller.md) |
| `listing_id` | STRING | Listing that was purchased. FK to [Listings](./listings.md) |
| `category_id` | STRING | Category of the purchased listing, denormalised for slicing. FK to [Category](./category.md) |
| `ordered_at` | TIMESTAMP | When the order was placed. |
| `quantity` | INTEGER | Units ordered (gmv = listing price × quantity). |
| `gmv` | NUMERIC | Gross merchandise value booked for the order. |
| `take_rate` | FLOAT | Platform's cut as a fraction of GMV (= category take_rate_pct / 100). |
| `platform_revenue` | NUMERIC | Platform's recognised revenue (gmv × take_rate; zero if cancelled). |
| `seller_payout` | NUMERIC | Seller's take-home (gmv − platform_revenue; zero if cancelled). |
| `net_gmv` | NUMERIC | GMV net of cancellations (equal to gmv unless cancelled, then zero). |
| `status` | STRING | Order status: pending, fulfilled or cancelled. |
| `is_fulfilled` | BOOLEAN | Whether the order was fulfilled. |
| `fulfillment_mins` | FLOAT | Order-to-fulfilment time in minutes — fill speed (null unless fulfilled). |

## Joins

- [Buyer](./buyer.md) — `buyer_id = buyer_id`
- [Category](./category.md) — `category_id = category_id`
- [Listings](./listings.md) — `listing_id = listing_id`
- [Seller](./seller.md) — `seller_id = seller_id`
