---
title: "Buyer"
description: |
  The demand side of the marketplace: one row per registered buyer, carrying how they were
  acquired, where they are, and how much they have transacted. Lifetime order count and a
  repeat flag make demand-side retention a first-class field — most buyers place a single
  order and never return, and the share who come back for a second is the health number
  every marketplace watches.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T15:57:43.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `buyer_id` | STRING | Buyer ID | PK. Unique buyer identifier. |
| `signup_date` | DATE | Signup Date | When the buyer first registered. |
| `acquisition_channel` | STRING | Acquisition Channel | Marketing source that brought the buyer in. |
| `region` | STRING | Region | Buyer's geographic region. |
| `segment` | STRING | Segment | Buyer segment (one-time, occasional, regular, power). |
| `lifetime_orders` | INTEGER | Lifetime Orders | Total orders the buyer has placed to date. |
| `is_repeat` | BOOLEAN | Is Repeat | Whether the buyer has placed 2+ orders — demand-side retention. |

# Example Questions

- What share of buyers ever place a second `order`, and how does that repeat rate differ by acquisition channel or region?
- Which channels bring in buyers who go on to `order` repeatedly, versus one-and-done?
- How concentrated is demand — what fraction of all `orders` comes from repeat buyers?
