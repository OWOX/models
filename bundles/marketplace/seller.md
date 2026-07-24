---
type: "OWOX Data Mart"
title: "Seller"
description: "The supply side — one row per seller, with rating, recency and lifecycle status."
tags: ["owox"]
timestamp: 2026-07-24T10:45:14.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `seller_id` | STRING | PK. Unique seller identifier. |
| `onboarded_at` | DATE | When the seller joined the platform. |
| `category_id` | STRING | Primary category the seller sells in. FK to [Category](./category.md) |
| `region` | STRING | Seller's geographic region. |
| `rating` | FLOAT | Average buyer rating of the seller (null until first review). |
| `active_listings` | INTEGER | Number of currently live listings. |
| `is_activated` | BOOLEAN | Whether the seller has reached its first sale — supply activation. |
| `fulfillment_type` | STRING | How the seller fulfils orders. |
| `last_sale_at` | DATE | Date of the seller's most recent sale (null if never sold). |
| `status` | STRING | Lifecycle state from sale recency: active, dormant or churned. |

## Joins

- [Category](./category.md) — `category_id = category_id`
