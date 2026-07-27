---
title: "Seller"
description: |
  The supply side: one row per seller, with the primary category they sell in, their buyer
  rating, how many listings they keep live, and — critically for supply-health work — when
  they last sold and whether they are still active. Supply is heavily concentrated: a small
  share of sellers drives most of the platform's GMV, so lifecycle status (active, dormant
  or churned, driven by sale recency) is where a supply manager looks first when GMV softens.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T15:57:44.000Z
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

# Example Questions

- Are sellers in our highest take-rate `categories` churning faster than sellers in low-rate ones — is take-rate optimisation costing us `supply`?
- What share of `GMV` comes from the top few percent of sellers, and how exposed are we if they go dormant?
- How many onboarded sellers never reach their first sale, and where does that activation gap concentrate?

## Joins

- [Category](./category.md) — `category_id = category_id`
