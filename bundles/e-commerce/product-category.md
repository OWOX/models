---
title: "Product Category"
description: |
  The category tree the catalog is organised by, together with the target margin each category
  is managed against and the person accountable for it. Because the target sits next to the
  category, actual margin from the order lines can be judged against what the category was
  supposed to deliver, not just reported in isolation.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T16:47:25.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `category_id` | INTEGER | Unique numerical identifier for each product category. |
| `category_name` | STRING | The descriptive name of the product category used for reporting and classification. |
| `category_manager` | STRING | Full name of the individual responsible for managing the specific product category. |
| `target_margin` | FLOAT | The desired profit margin percentage set for the category. |
| `category_group` | STRING | High-level classification used to group related categories together, such as hard or soft goods. |

# Example Questions

- Which categories beat their target margin, and which sell well but earn little?
- How is revenue distributed across category groups, and is the mix shifting?
- Which category managers are carrying the categories that drive growth?
