---
title: "Order Items"
description: |
  The order lines behind every order — one row per product bought, with quantity, the price
  actually paid, the cost of goods, and the revenue and profit that result. Because unit cost
  sits next to the price paid, margin is a property of the line rather than something
  reconstructed later, and the true cost of subscription discounting becomes visible at the
  product level.

  Subscription lines are flagged apart from one-time lines, so the same product can be compared
  in both worlds: what it earns when bought once, and what it earns when it is delivered on a
  schedule at a standing discount.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-02T16:21:32.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `order_item_id` | STRING | Order Item ID | PK. Unique identifier of the order line. |
| `order_id` | STRING | Order ID | Order this line belongs to. FK to [Orders](./orders.md) |
| `product_id` | STRING | Product ID | Product bought on this line. FK to [Products](./products.md) |
| `quantity` | INTEGER | Quantity | Number of units of the product on this line. |
| `unit_price` | FLOAT | Unit Price | Price paid per unit at the moment of purchase. |
| `unit_cost` | FLOAT | Unit Cost | Cost to the business of one unit of the product. |
| `line_discount` | FLOAT | Line Discount | Discount applied to this line, including the subscription discount. |
| `line_revenue` | FLOAT | Line Revenue | Gross revenue for the line, being quantity multiplied by the price paid. |
| `line_net_revenue` | FLOAT | Line Net Revenue | Revenue recognised for the line, counted only for completed orders. |
| `line_cost` | FLOAT | Line Cost | Cost of goods on this line whatever became of the order — a cancelled or returned line still carries a cost here — so pairing it with `line_net_revenue` instead of `line_net_cost` mixes a booked population with a settled one and lands margin about 0.8 percentage points low. |
| `line_net_cost` | FLOAT | Line Net Cost | Cost of goods for lines that actually sold — zero on a cancelled or returned order — so it is the column that pairs correctly with `line_net_revenue` and `line_net_profit` over that same settled population. |
| `line_net_profit` | FLOAT | Line Net Profit | Profit for the line on completed orders, being net revenue less cost of goods. |
| `is_subscription_item` | BOOLEAN | Is Subscription Item | Whether the line was delivered on a subscription rather than bought one-time. |

# Example Questions

- Which `products` are profitable on `subscription` once the standing discount and cost of goods are counted, and which only look profitable at full price?
- How does basket composition differ between `subscription` deliveries and `one-time orders`?
- What is gross versus net revenue after cancellations and returns, and how wide is the gap by `product` category?

## Joins

- [Orders](./orders.md) — `order_id = order_id` — The order this line belongs to.
- [Products](./products.md) — `product_id = product_id` — The product sold on this line.
