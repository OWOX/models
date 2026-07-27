---
title: "Purchases"
description: |
  The order lines behind every order — one row per product bought, with quantity, the price
  actually paid, the cost of goods, and the resulting revenue and profit. Revenue is
  recognised only for completed orders, so gross booked value and settled value never get
  confused. This is the mart that answers what the business actually earned.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T17:00:42.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `purchase_id` | STRING | PK. A unique identifier for each individual item row within an order |
| `order_id` | STRING | The unique identifier of the transaction. Used to join with the Orders Data Mart. FK to [Orders](./orders.md) |
| `product_id` | INTEGER | The unique identifier of the purchased product FK to [Products](./products.md) |
| `quantity` | INTEGER | The number of units of this specific product included in the purchase line |
| `sale_price` | FLOAT | The price per unit at the moment of purchase |
| `currency` | STRING | The currency used for the transaction (e.g., USD) |
| `unit_cost` | FLOAT | The cost incurred by the business to acquire or produce a single unit of the product. |
| `line_revenue` | FLOAT | Gross revenue for this order line = Item Sale Price × Quantity. Sum across lines for total gross revenue (all order statuses). |
| `line_cost` | FLOAT | Cost of goods sold for this order line = Unit Cost × Quantity. Sum for total COGS. |
| `line_net_revenue` | FLOAT | Revenue recognised only for Completed orders (Cancelled / Returned = 0). Sum for net  revenue. |
| `line_net_profit` | FLOAT | Profit for Completed orders = (Item Sale Price − Unit Cost) × Quantity, else 0. Sum for  total net profit. |

# Example Questions

- What is gross versus net revenue after cancellations and returns, and how wide is the gap?
- Which `products` and `categories` generate the most profit, as opposed to the most revenue?
- How many units go into a typical `order`, and how does basket composition vary by market?

## Joins

- [Orders](./orders.md) — `order_id = order_id`
- [Products](./products.md) — `product_id = product_id`
