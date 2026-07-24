---
type: "OWOX Data Mart"
title: "🥈 Products (E-Commerce)"
description: "This Data Mart provides a comprehensive catalog of e-commerce products, including pricing, cost structures, and website categorization. It is primarily used for analyzing product margins and managing web content mapping."
tags: ["owox"]
timestamp: 2026-07-23T07:00:34.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `product_id` | INTEGER | PK. Unique identifier for a specific product in the catalog |
| `product_name` | STRING | The full commercial name of the product |
| `price` | FLOAT | The current selling price of a single unit of the product |
| `cost` | FLOAT | The acquisition cost or production expense per unit of the product |
| `sub_category` | STRING | The specific sub-classification of the product within its broader category. |
| `category_id` | INTEGER | Unique identifier for the high-level category the product belongs to. FK to [🥈 Product Category (E-Commerce)](./product-category-e-commerce.md) |
| `page_path` | STRING | The URL relative path for the product's detail page on the website. |
| `page_id` | INTEGER | Unique identifier for the specific web page associated with the product. FK to [🥈 Pages (E-Commerce)](./pages-e-commerce.md) |

## Joins

- [Product Category](./product-category-e-commerce.md) — `category_id = category_id`
- [Pages](./pages-e-commerce.md) — `page_id = page_id`
