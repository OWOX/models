---
title: "Replenishment"
description: |
  Every order placed to refill a store's shelves, from the day it was raised to the day the goods
  arrived — how much was asked for, how much actually turned up, what it cost, how long it took,
  and whether it landed when it was promised. This is where an availability problem is diagnosed
  rather than merely observed: a shelf can be empty because the store never ordered, because the
  supplier short-shipped, or because the delivery was late, and only the order record separates the
  three. Fill rate and on-time delivery are the two halves of on-time-in-full, the standard measure
  of supplier service, and `supplier_name` is what makes them answerable per vendor. Lead time is
  the other half of the story, because a supplier who reliably takes ten days can be planned around,
  while one who takes anywhere between three and fifteen forces every store to carry cover stock it
  should not need.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T00:46:44.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `order_id` | STRING | Order ID | PK. Unique identifier for this replenishment order. |
| `store_id` | STRING | Store ID | Location the goods were ordered for. FK to [Store](./store.md) |
| `product_id` | STRING | Product ID | Line being replenished. FK to [Product](./product.md) |
| `supplier_name` | STRING | Supplier | Vendor the order was placed with. Matches the supplier on the product, so supplier service level is answerable from the two together. |
| `ordered_at` | DATE | Ordered Date | Date the order was raised with the supplier. |
| `expected_at` | DATE | Expected Date | Date the supplier promised delivery. The bar `is_on_time` is measured against. |
| `received_at` | DATE | Received Date | Date the goods actually arrived. NULL while the order is still open, so exclude open orders from lead-time and service-level calculations rather than treating them as received today. |
| `status` | STRING | Order Status | Where the order stands: `open` (outstanding), `partial` (short-shipped), `received` (complete) or `cancelled`. |
| `quantity_ordered` | INTEGER | Quantity Ordered | Selling units requested from the supplier. |
| `quantity_received` | INTEGER | Quantity Received | Selling units actually delivered. Below `quantity_ordered` on a short shipment. |
| `order_cost` | NUMERIC | Order Cost | Value of the order at unit cost, in USD. |
| `lead_time_days` | INTEGER | Lead Time (Days) | Whole days from order to receipt. Its variance matters as much as its level — unpredictable lead time has to be covered with stock. |
| `fill_rate_pct` | FLOAT | Fill Rate % | Quantity received divided by quantity ordered. The "in full" half of on-time-in-full, and the standard measure of how completely a supplier serves an order. |
| `is_on_time` | BOOLEAN | Is On Time | True when the goods arrived by `expected_at`. The "on time" half of on-time-in-full; read it alongside `fill_rate_pct`, since a punctual short shipment is still a failure. |

# Example Questions

- Which suppliers miss on-time-in-full most often, and does their shortfall show up as stockouts on the shelf or get absorbed by cover stock?
- How much of our lead time is genuinely long versus merely unpredictable, and what would consistency alone save us in stock cover?
- Are the lines that repeatedly run out actually being ordered late, or ordered on time and short-shipped?

## Joins

- [Product](./product.md) — `product_id = product_id`
- [Store](./store.md) — `store_id = store_id`
