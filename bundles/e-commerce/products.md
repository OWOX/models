---
title: "🥈 Products"
description: "This Data Mart provides a comprehensive catalog of e-commerce products, including pricing, cost structures, and website categorization. It is primarily used for analyzing product margins and managing web content mapping."
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-25T07:00:29.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `product_id` | INTEGER | PK. Unique identifier for a specific product in the catalog |
| `product_name` | STRING | The full commercial name of the product |
| `price` | FLOAT | The current selling price of a single unit of the product |
| `cost` | FLOAT | The acquisition cost or production expense per unit of the product |
| `sub_category` | STRING | The specific sub-classification of the product within its broader category. |
| `category_id` | INTEGER | Unique identifier for the high-level category the product belongs to. |
| `page_path` | STRING | The URL relative path for the product's detail page on the website. |
| `page_id` | INTEGER | Unique identifier for the specific web page associated with the product. |

## Joins

- Product Category
- Pages
