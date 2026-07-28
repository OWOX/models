---
title: "Products"
description: |
  The catalog: what the store sells, at what price, at what unit cost, which brand and category
  it belongs to, whether it can be subscribed to, and which page on the site it lives on. Price
  and cost in the same row make unit margin a property of the product, which is the starting
  point for judging whether a product can carry a standing subscription discount at all.

  Two naming columns are kept side by side on purpose: the name as it appears in the storefront,
  and a cleaned unified name that groups variants and inconsistent spellings of the same
  product. Reporting on the unified name is what stops one product from appearing as several.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-28T16:51:51.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `product_id` | STRING | PK. Unique identifier of the product. |
| `product_name` | STRING | Name of the product as shown in the storefront. |
| `unified_product_name` | STRING | Cleaned product name that groups variants and inconsistent spellings of the same product. |
| `product_brand` | STRING | Brand the product is sold under. |
| `product_category` | STRING | Category the product belongs to, such as Supplements, Skincare or Accessories. |
| `sku` | STRING | Stock keeping unit identifying the exact variant. |
| `price` | FLOAT | Current one-time selling price of a single unit. |
| `unit_cost` | FLOAT | Cost to the business of producing or acquiring a single unit. |
| `is_subscription_eligible` | BOOLEAN | Whether the product can be bought on a subscription plan. |
| `page_id` | STRING | Product detail page on the website. FK to [Pages](./pages.md) |

# Example Questions

- Which products carry `subscriptions` well — high repeat delivery volume at a margin that survives the discount?
- Which subscription-eligible products are rarely subscribed to, and are they priced or presented wrongly?
- How does unit margin vary across brands and categories, and where is the catalog thinnest on subscribable products?

## Joins

- [Pages](./pages.md) — `page_id = page_id`
