---
type: "OWOX Data Mart"
title: "🥈 Product Category (E-Commerce)"
description: "This Data Mart provides a comprehensive list of product categories, their management hierarchy, and financial performance targets. It is used to analyze category-level organizational structure and monitor target profit margins across different business groups."
tags: ["owox"]
timestamp: 2026-05-26T20:02:01.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `category_id` | INTEGER | Unique numerical identifier for each product category. |
| `category_name` | STRING | The descriptive name of the product category used for reporting and classification. |
| `category_manager` | STRING | Full name of the individual responsible for managing the specific product category. |
| `target_margin` | FLOAT | The desired profit margin percentage set for the category. |
| `category_group` | STRING | High-level classification used to group related categories together, such as hard or soft goods. |
