---
title: "Listings"
description: |
  One row per listing, the unit of supply a buyer actually orders. Each listing belongs to a
  seller and a category and carries a price and an availability state. The count of live
  listings per seller is exactly that seller's active inventory, which makes this the
  backbone behind every order's price and category — and the first place to look when demand
  arrives and finds nothing to buy.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T15:57:44.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `listing_id` | STRING | PK. Unique listing identifier. |
| `seller_id` | STRING | Seller that owns the listing. FK to [Seller](./seller.md) |
| `created_at` | TIMESTAMP | When the listing was created. |
| `category_id` | STRING | Category the listing belongs to. FK to [Category](./category.md) |
| `price` | NUMERIC | Listed price of the offer. |
| `status` | STRING | Current listing status: active, paused, sold_out or removed. |
| `is_available` | BOOLEAN | Whether the listing is live inventory — supply availability. |

# Example Questions

- Which `categories` are thin on live inventory relative to the `demand` searching for them — where is supply the bottleneck?
- How does listing price distribution differ across `categories`, and does it track the category `take rate`?
- What share of listings ever converts into an `order`, by `category` and `seller`?

## Joins

- [Category](./category.md) — `category_id = category_id`
- [Seller](./seller.md) — `seller_id = seller_id`
