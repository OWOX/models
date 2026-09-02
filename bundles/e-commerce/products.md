---
title: "Products"
description: |
  The product catalog: what the store sells, at what price, at what unit cost, and where each
  item lives in both the category tree and the website. Price and cost sitting in the same row
  is what makes unit margin a property of the product rather than something reconstructed
  downstream.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-02T16:26:28.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `product_id` | INTEGER | Product ID | PK. Unique identifier for a specific product in the catalog |
| `product_name` | STRING | Product Name | The full commercial name of the product |
| `price` | FLOAT | Price | The current selling price of a single unit of the product |
| `cost` | FLOAT | Cost | The acquisition cost or production expense per unit of the product |
| `sub_category` | STRING | Sub Category | The specific sub-classification of the product within its broader category. |
| `category_id` | INTEGER | Category ID | Unique identifier for the high-level category the product belongs to. FK to [Product Category](./product-category.md) |
| `page_path` | STRING | Page Path | The URL relative path for the product's detail page on the website. |
| `page_id` | INTEGER | Page ID | Unique identifier for the specific web page associated with the product. FK to [Pages](./pages.md) |

# Example Questions

- Which products drive the most revenue, and which of them are actually profitable after cost?
- How does price positioning differ across `categories` and sub-categories?
- Which products attract heavy `page` traffic but rarely sell?

## Joins

- [Pages](./pages.md) — `page_id = page_id` — This product's page on the storefront.
- [Product Category](./product-category.md) — `category_id = category_id` — The category this product sits in.
