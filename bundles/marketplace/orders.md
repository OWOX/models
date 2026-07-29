---
title: "Orders"
description: |
  The match at the heart of the marketplace: one row per order placed, tying a buyer to a
  seller's listing. It carries the full transaction economics — gross merchandise value, the
  category take rate, the platform's cut and the reciprocal seller payout. Revenue is
  recognised only on orders that settle: a cancelled order keeps its booked GMV for funnel
  analysis while its net GMV, platform revenue and seller payout all fall to zero, so gross
  and net are never confused.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-29T14:32:48.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `order_id` | STRING | Order ID | PK. Unique order identifier. |
| `buyer_id` | STRING | Buyer ID | Buyer on the order. FK to [Buyer](./buyer.md) |
| `seller_id` | STRING | Seller ID | Seller on the order (always the listing's owner). FK to [Seller](./seller.md) |
| `listing_id` | STRING | Listing ID | Listing that was purchased. FK to [Listings](./listings.md) |
| `category_id` | STRING | Category ID | Category of the purchased listing, denormalised for slicing. FK to [Category](./category.md) |
| `ordered_at` | TIMESTAMP | Ordered At | When the order was placed. |
| `quantity` | INTEGER | Quantity | Units ordered (gmv = listing price × quantity). |
| `gmv` | NUMERIC | GMV | Gross merchandise value booked for the order. |
| `take_rate` | FLOAT | Take Rate | Platform's cut as a fraction of GMV (= category take_rate_pct / 100). |
| `platform_revenue` | NUMERIC | Platform Revenue | Platform's recognised revenue (gmv × take_rate; zero if cancelled). |
| `seller_payout` | NUMERIC | Seller Payout | Seller's take-home (gmv − platform_revenue; zero if cancelled). |
| `net_gmv` | NUMERIC | Net GMV | GMV net of cancellations (equal to gmv unless cancelled, then zero). |
| `status` | STRING | Status | Order status: pending, fulfilled or cancelled. |
| `is_fulfilled` | BOOLEAN | Is Fulfilled | Whether the order was fulfilled. |
| `fulfillment_mins` | FLOAT | Fulfillment Mins | Order-to-fulfilment time in minutes — fill speed (null unless fulfilled). |

# Example Questions

- What is our net GMV and net take after `cancellations`, and how far does it sit below the gross headline?
- Which `categories` and `sellers` produce the most platform revenue, and how does seller payout move as take rate changes?
- How fast are orders fulfilled, and how does fill speed vary by `seller` fulfilment type or `category`?

## Joins

- [Buyer](./buyer.md) — `buyer_id = buyer_id`
- [Category](./category.md) — `category_id = category_id`
- [Listings](./listings.md) — `listing_id = listing_id`
- [Seller](./seller.md) — `seller_id = seller_id`
