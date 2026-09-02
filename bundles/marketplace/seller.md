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

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `seller_id` | STRING | Seller ID | PK. Unique seller identifier. |
| `onboarded_at` | DATE | Onboarded At | When the seller joined the platform. |
| `category_id` | STRING | Category ID | Primary category the seller sells in. FK to [Category](./category.md) |
| `region` | STRING | Region | Seller's geographic region. |
| `rating` | FLOAT | Rating | Average buyer rating of the seller (null until first review). |
| `active_listings` | INTEGER | Active Listings | Number of currently live listings. |
| `is_activated` | BOOLEAN | Is Activated | Whether the seller has reached its first sale — supply activation. |
| `fulfillment_type` | STRING | Fulfillment Type | How the seller fulfils orders. |
| `last_sale_at` | DATE | Last Sale At | Date of the seller's most recent sale (null if never sold). |
| `status` | STRING | Status | Lifecycle state from sale recency: active, dormant or churned. |

# Example Questions

- Are sellers in our highest take-rate `categories` churning faster than sellers in low-rate ones — is take-rate optimisation costing us supply?
- What share of GMV comes from the top few percent of sellers, and how exposed are we if they go dormant?
- How many onboarded sellers never reach their first sale, and where does that activation gap concentrate?

## Joins

- [Category](./category.md) — `category_id = category_id` — The seller's primary category.
