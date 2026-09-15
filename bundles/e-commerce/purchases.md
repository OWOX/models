---
title: "Purchases"
description: |
  The order lines behind every order — one row per product bought, with quantity, the price
  actually paid, the cost of goods, and the resulting revenue and profit. Revenue is
  recognised only for completed orders, so gross booked value and settled value never get
  confused. This is the mart that answers what the business actually earned.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-11T15:00:26.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `purchase_id` | STRING | Purchase ID | PK. A unique identifier for each individual item row within an order |
| `order_id` | STRING | Order ID | The unique identifier of the transaction. Used to join with the Orders Data Mart. FK to [Orders](./orders.md) |
| `product_id` | INTEGER | Product ID | The unique identifier of the purchased product FK to [Products](./products.md) |
| `quantity` | INTEGER | Quantity | The number of units of this specific product included in the purchase line |
| `sale_price` | FLOAT | Item Sale Price | The price per unit at the moment of purchase |
| `currency` | STRING | Currency | The currency used for the transaction (e.g., USD) |
| `unit_cost` | FLOAT | Unit Cost | The cost incurred by the business to acquire or produce a single unit of the product. |
| `line_revenue` | FLOAT | Item Revenue | Gross revenue for this order line = Item Sale Price × Quantity. Sum across lines for total gross revenue (all order statuses). |
| `line_cost` | FLOAT | Item COGS | Cost of goods sold for this order line = Unit Cost × Quantity. Sum for total COGS. |
| `line_net_revenue` | FLOAT | Item Net Revenue | Revenue recognised only for Completed orders (Cancelled / Returned = 0). Sum for net  revenue. |
| `line_net_profit` | FLOAT | Item Net Profit | Profit for Completed orders = (Item Sale Price − Unit Cost) × Quantity, else 0. Sum for  total net profit. |
| `line_net_cost` | FLOAT | Item Net COGS | Cost of goods sold recognised only for Completed orders (Cancelled / Returned = 0). This is the cost figure that pairs with Line Net Revenue: net revenue − net cost = net profit. |
| `net_margin_pct` | FLOAT | Net Margin % | Settled profit over settled revenue, from summed components. |
| `margin_bucket` | STRING | Margin Bucket | Each line's gross margin band — Thin, Standard, Healthy or Premium — from its sale price and unit cost, banded to how this store's margins actually spread (mid-40s to high-60s percent, not the wide range a generic Loss/Thin/Healthy/Premium split assumes). Row-level; group and filter by it. |

# Example Questions

- What is gross versus net revenue after cancellations and returns, and how wide is the gap?
- Which `products` and `categories` generate the most profit, as opposed to the most revenue?
- How many units go into a typical `order`, and how does basket composition vary by market?

## Joins

- [Orders](./orders.md) — `order_id = order_id` [N:1] — The order this line belongs to.
  - [Order Customer](./customers.md) — The customer who placed the order this line belongs to.
    - [Customer Country](./countries.md) — The customer's home market.
    - [Customer Acquisition Source](./traffic-sources.md) — The channel that originally acquired the customer.
  - [Order Session](./sessions.md) — The session the order was placed in.
    - [Session Country](./countries.md) — The market the order was placed from.
    - [Session Pageviews](./pageviews.md) — The clickstream of the ordering session.
      - [Viewed Pages](./pages.md) — The pages seen in the ordering session.
    - [Session Traffic Source](./traffic-sources.md) — The channel that drove the ordering session.
    - [Session Ad Spend](./unified-ad-spend.md) — Spend on that day and channel — a cohort match, not this line's cost.
      - [Ad Spend Traffic Source](./traffic-sources.md) — The channel behind that spend.
    - [Session Visitor](./visitors.md) — The visitor behind the ordering session.
- [Products](./products.md) — `product_id = product_id` [N:1] — The product sold on this line.
  - [Product Page](./pages.md) — The storefront page of the product on this line.
    - [Product Pageviews](./pageviews.md) — Views of that product page.
  - [Product Category](./product-category.md) — The category of the product on this line.
