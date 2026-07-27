---
title: "Products"
description: |
  The product catalog: what the store sells, at what price, at what unit cost, and where each
  item lives in both the category tree and the website. Price and cost sitting in the same row
  is what makes unit margin a property of the product rather than something reconstructed
  downstream.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T16:47:25.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `product_id` | INTEGER | PK. Unique identifier for a specific product in the catalog |
| `product_name` | STRING | The full commercial name of the product |
| `price` | FLOAT | The current selling price of a single unit of the product |
| `cost` | FLOAT | The acquisition cost or production expense per unit of the product |
| `sub_category` | STRING | The specific sub-classification of the product within its broader category. |
| `category_id` | INTEGER | Unique identifier for the high-level category the product belongs to. FK to [Product Category](./product-category.md) |
| `page_path` | STRING | The URL relative path for the product's detail page on the website. |
| `page_id` | INTEGER | Unique identifier for the specific web page associated with the product. FK to [Pages](./pages.md) |

# Example Questions

- Which products drive the most revenue, and which of them are actually profitable after cost?
- How does price positioning differ across `categories` and sub-categories?
- Which products attract heavy `page` traffic but rarely sell?

## Joins

- [Product Category](./product-category.md) — `category_id = category_id`
- [Pages](./pages.md) — `page_id = page_id`
