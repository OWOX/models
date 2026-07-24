---
type: "OWOX Data Mart"
title: "Reviews"
description: "One row per post-transaction review — rating, reviewer side and complaint flag."
tags: ["owox"]
timestamp: 2026-07-24T10:45:11.000Z
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

## Joins

- [Orders](./orders.md) — `order_id = order_id`
