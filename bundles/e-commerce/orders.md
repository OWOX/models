---
title: "Orders"
description: |
  One row per order placed on the storefront — the header of the transaction, tying the
  browsing session it came from to the customer who placed it, the date, and the fulfilment
  state. Because a cancelled or returned order still occupies a row, gross order counts and
  settled revenue can be told apart instead of quietly merged.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T08:25:20.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `session_id` | STRING | Session ID | Unique identifier of the session where the order was placed FK to [Sessions](./sessions.md) |
| `customer_id` | INTEGER | Customer ID | Unique identifier of the customer who placed the order FK to [Customers](./customers.md) |
| `order_date` | DATE | Order Date | The date when the transaction was completed |
| `order_id` | STRING | Order ID | PK. Unique identifier of the purchase transaction FK to [Purchases](./purchases.md) |
| `status` | STRING | Status | Current fulfillment state of the order (e.g., Completed) |

## Calculated fields

### `orders_total` · INTEGER · Metric

- **Alias:** Orders

Distinct orders in the selected rows, every status.

```sql
COUNT(DISTINCT order_id)
```

### `completed_orders` · INTEGER · Metric

- **Alias:** Completed Orders

Orders that completed — a conditional count with no helper column.

```sql
COUNTIF(status = 'Completed')
```

### `completion_rate` · FLOAT · Metric

- **Alias:** Completion Rate

Share of orders that completed rather than being cancelled or returned.

```sql
SAFE_DIVIDE(completed_orders, COUNT(DISTINCT order_id))
```

### `distinct_products_in_order` · INTEGER · Metric

- **Alias:** Distinct Products in Order

Distinct products across the selected orders' lines, counted through Purchases into Products.

```sql
COUNT(DISTINCT purchases_e_commerce.products_e_commerce.product_id)
```

# Example Questions

- How many orders reach completion versus cancellation or return, and is that share drifting over time?
- What is average order value by `country`, device or acquisition channel?
- How long after a `session`'s first `pageview` does an order actually land?

## Joins

- [Customers](./customers.md) — `customer_id = customer_id` [N:1] — The customer who placed this order.
  - [Customer Country](./countries.md) — The customer's home market.
  - [Customer Acquisition Source](./traffic-sources.md) — The channel that originally acquired the customer, not the one that drove this order.
- [Purchases](./purchases.md) as `purchases_e_commerce` — `order_id = order_id` [1:N] — The lines this order is made of.
  - [Ordered Product](./products.md) — The products on this order's lines.
    - [Product Page](./pages.md) — The storefront page of each ordered product.
      - [Product Pageviews](./pageviews.md) — Views of those product pages.
    - [Product Category](./product-category.md) — The category of each ordered product.
- [Sessions](./sessions.md) — `session_id = session_id` [N:1] — The session this order was placed in.
  - [Session Country](./countries.md) — The market this order was placed from.
  - [Session Pageviews](./pageviews.md) — The clickstream of the ordering session.
    - [Viewed Pages](./pages.md) — The pages seen in the ordering session.
  - [Session Traffic Source](./traffic-sources.md) — The channel that drove the ordering session.
  - [Session Ad Spend](./unified-ad-spend.md) — Spend on that day and channel — a cohort match, not this order's cost.
    - [Ad Spend Traffic Source](./traffic-sources.md) — The channel behind that spend.
  - [Session Visitor](./visitors.md) — The visitor behind the ordering session.
