---
type: "OWOX Data Mart"
title: "Listings"
description: "One row per listing/offer — the supply inventory buyers can order from."
tags: ["owox"]
timestamp: 2026-07-24T10:45:14.000Z
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

## Joins

- [Category](./category.md) — `category_id = category_id`
- [Seller](./seller.md) — `seller_id = seller_id`
