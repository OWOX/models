---
type: "OWOX Data Mart"
title: "Buyer"
description: "The demand side — one row per buyer, with lifetime order count and repeat flag."
tags: ["owox"]
timestamp: 2026-07-24T10:45:16.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `buyer_id` | STRING | PK. Unique buyer identifier. |
| `signup_date` | DATE | When the buyer first registered. |
| `acquisition_channel` | STRING | Marketing source that brought the buyer in. |
| `region` | STRING | Buyer's geographic region. |
| `segment` | STRING | Buyer segment (one-time, occasional, regular, power). |
| `lifetime_orders` | INTEGER | Total orders the buyer has placed to date. |
| `is_repeat` | BOOLEAN | Whether the buyer has placed 2+ orders — demand-side retention. |
