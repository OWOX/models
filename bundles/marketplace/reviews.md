---
title: "Reviews"
description: |
  One row per review left after a fulfilled order — the marketplace's trust signal. Only a
  minority of completed orders are ever reviewed, since reviewing is voluntary, and ratings
  follow the familiar J-shape: mostly five stars, a hard bump at one star, little in between.
  The reviewer role separates the buyer's rating of the seller from the seller's rating of
  the buyer, and the complaint flag — concentrated in the low ratings — marks where trust is
  breaking down.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T15:57:45.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `review_id` | STRING | PK. Unique review identifier. |
| `order_id` | STRING | Order the review relates to (always a fulfilled order). FK to [Orders](./orders.md) |
| `reviewer_role` | STRING | Side that left the review: buyer or seller. |
| `rating` | INTEGER | Star rating 1–5 for the order. |
| `created_at` | TIMESTAMP | When the review was submitted. |
| `has_complaint` | BOOLEAN | Whether the review flags a complaint (concentrated in 1–2 star ratings). |

# Example Questions

- What is our review coverage of fulfilled `orders`, and does the rating distribution look healthy or is a `category` dragging the average down?
- Which `sellers` or `categories` attract the most complaints relative to their `order` volume?
- Do low ratings and complaints cluster around the same `sellers` that later go dormant?

## Joins

- [Orders](./orders.md) — `order_id = order_id`
