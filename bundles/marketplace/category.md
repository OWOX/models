---
title: "Category"
description: |
  The category tree every listing and order is filed under, and — crucially — the standard
  take rate the platform charges on sales in each category. Take rate is the biggest lever a
  category manager holds: raise it and revenue per order rises, but the sellers in that
  category feel the squeeze. Rates follow real marketplace norms — physical goods sit lower
  (8–15%), while services and premium or handmade categories carry a higher cut (15–22%).
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T15:57:43.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `category_id` | STRING | PK. Unique category identifier. |
| `name` | STRING | Display name of the category. |
| `parent_category` | STRING | Parent grouping in the category tree (Goods, Media, Services). |
| `take_rate_pct` | FLOAT | Platform's standard commission for the category, as a percent (e.g. 12.0 = 12%) — the take-rate optimisation lever. |

# Example Questions

- Which categories carry the highest `take rate`, and is that where our GMV actually sits?
- If we lifted the `take rate` two points in a low-rate goods category, how much extra platform revenue would last quarter's orders have produced?
- How does the blended effective `take rate` across all orders compare with the headline rate of our largest categories?
