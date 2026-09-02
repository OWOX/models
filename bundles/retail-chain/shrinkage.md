---
title: "Shrinkage"
description: |
  Stock the chain paid for and never sold: one row per write-off event, recording what was lost,
  where, how much of it, why, and how it came to light. Shrink is one of the largest controllable
  costs in retail and it comes off the bottom line directly — a dollar of shrink has to be replaced
  by several dollars of extra sales to break even on it. The reason separates problems that need
  entirely different responses: theft is a security and layout question, expiry is an ordering and
  rotation question, damage is a handling question, and administrative error means the loss may not
  be a physical loss at all but a bookkeeping one. How the loss was *found* matters just as much,
  because it divides known shrink, where the cause is documented at the moment it happens, from
  unknown shrink, which only surfaces when a count fails to match the book and by then the cause is
  gone. Each loss is valued twice — at what it cost the chain and at what it would have sold for —
  because those two numbers answer different questions.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T04:43:02.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `shrink_id` | STRING | Shrink ID | PK. Unique identifier for this write-off event. |
| `store_id` | STRING | Store ID | Location the loss was recorded at. FK to [Store](./store.md) |
| `product_id` | STRING | Product ID | Line that was written off. FK to [Product](./product.md) |
| `recorded_at` | DATE | Recorded Date | Date the write-off was booked. For a loss found by cycle count this is when it was discovered, not necessarily when it occurred. |
| `reason` | STRING | Shrink Reason | Why the stock was lost: `theft`, `damage`, `expiry` or `admin_error`. Each points at a different owner — security, handling, ordering and rotation, or the back office. |
| `detected_by` | STRING | Detected By | How the loss came to light: `cycle_count` (a stock count found the book and the shelf disagreed, so the cause is inferred — unknown shrink), `self_checkout_audit` (an audit of an unattended checkout), `security` (loss prevention caught it in the act), `receiving_check` (a discrepancy found at the door before the stock reached the floor). |
| `units_lost` | INTEGER | Units Lost | Selling units written off in this event. |
| `shrink_cost` | NUMERIC | Shrink Cost | The loss valued at unit cost, in USD — the money the chain is out of pocket. Use this basis for any margin or profit question. |
| `retail_value` | NUMERIC | Retail Value | The same loss valued at shelf price, in USD — the trade that will never be rung through the till. Use this basis when quoting shrink as a percentage of sales. |
| `count_shrink_events` | INTEGER | Shrink Event Count | Always `1` on every row; SUM to count write-off events. |

# Example Questions

- How much of our shrink is unknown rather than documented, and which `stores` carry a share of it far above their trade?
- Which `stores` and categories carry a share of shrink far above their share of trade, and how much of that loss surfaces only at a cycle count rather than being caught with its cause attached?
- Which categories lose most to expiry rather than theft, and does that point at ordering, rotation or shelf life?

## Joins

- [Product](./product.md) — `product_id = product_id` — The SKU written off.
- [Store](./store.md) — `store_id = store_id` — The store that wrote the stock off.
