---
type: "OWOX Data Mart"
title: "Category"
description: "Reference of marketplace categories and the platform take rate charged in each."
tags: ["owox"]
timestamp: 2026-07-24T10:45:16.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `category_id` | STRING | PK. Unique category identifier. |
| `name` | STRING | Display name of the category. |
| `parent_category` | STRING | Parent grouping in the category tree (Goods, Media, Services). |
| `take_rate_pct` | FLOAT | Platform's standard commission for the category, as a percent (e.g. 12.0 = 12%) — the take-rate optimisation lever. |
