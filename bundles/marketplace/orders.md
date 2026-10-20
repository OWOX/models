---
title: "Orders"
description: |
  The match at the heart of the marketplace: one row per order placed, tying a buyer to a
  seller's listing. It carries the full transaction economics — gross merchandise value, the
  category take rate, the platform's cut and the reciprocal seller payout. Revenue is
  recognised only on orders that settle: a cancelled order keeps its booked GMV for funnel
  analysis while its net GMV, platform revenue and seller payout all fall to zero, so gross
  and net are never confused.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T15:40:03.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `order_id` | STRING | Order ID | PK. Unique order identifier. |
| `buyer_id` | STRING | Buyer ID | Buyer on the order. FK to [Buyer](./buyer.md) |
| `seller_id` | STRING | Seller ID | Seller on the order (always the listing's owner). FK to [Seller](./seller.md) |
| `listing_id` | STRING | Listing ID | Listing that was purchased. FK to [Listings](./listings.md) |
| `category_id` | STRING | Category ID | Category of the purchased listing, denormalised for slicing. FK to [Category](./category.md) |
| `ordered_at` | TIMESTAMP | Ordered At | When the order was placed. |
| `quantity` | INTEGER | Quantity | Units ordered (gmv = listing price × quantity). |
| `gmv` | NUMERIC | GMV | Gross merchandise value booked for the order. |
| `take_rate` | FLOAT | Order Commission Rate | Per-order commission rate, as a 0–1 fraction — the category's standard rate (category take_rate_pct / 100), kept even on a cancelled order that earns nothing. For take rate across orders use Take Rate (`net_take_rate`), never an average of this field. |
| `platform_revenue` | NUMERIC | Platform Revenue | Platform's recognised revenue (gmv × take_rate; zero if cancelled). |
| `seller_payout` | NUMERIC | Seller Payout | Seller's take-home (gmv − platform_revenue; zero if cancelled). |
| `net_gmv` | NUMERIC | Net GMV | GMV net of cancellations (equal to gmv unless cancelled, then zero). |
| `status` | STRING | Status | Order status: pending, fulfilled or cancelled. |
| `is_fulfilled` | BOOLEAN | Is Fulfilled | Whether the order was fulfilled. |
| `fulfillment_mins` | FLOAT | Fulfillment Time (min) | Order-to-fulfilment time in minutes — fill speed (null unless fulfilled). |

## Calculated fields

### `net_take_rate` · FLOAT · Metric

- **Alias:** Take Rate

Platform revenue as a share of net GMV, as a 0–1 fraction — commission earned per dollar of GMV net of cancellations, pending orders included. A ratio of sums, so a large order weighs more than a small one; averaging Order Commission Rate (`take_rate`) typically overstates it, because low-commission categories carry the biggest baskets.

```sql
SAFE_DIVIDE(SUM(platform_revenue), SUM(net_gmv))
```

### `cancelled_orders` · INTEGER · Metric

- **Alias:** Cancelled Orders

Orders cancelled before settling, counted at whatever grain the report asks for. The numerator of Cancellation Rate.

```sql
COUNTIF(status = 'cancelled')
```

### `cancellation_rate` · FLOAT · Metric

- **Alias:** Cancellation Rate

Share of orders placed that were cancelled, as a 0–1 fraction — by order count, not by value. Reads Cancelled Orders, so the two always agree.

```sql
SAFE_DIVIDE(cancelled_orders, COUNT(order_id))
```

### `aov` · FLOAT · Metric

- **Alias:** Average Order Value

Net GMV per non-cancelled order. Cancelled orders leave both sides, so a wave of cancellations does not drag the basket size down; pending orders count, because their GMV is still booked.

```sql
SAFE_DIVIDE(SUM(net_gmv), COUNT(order_id) - cancelled_orders)
```

### `active_sellers` · INTEGER · Metric

- **Alias:** Active Sellers

Distinct sellers with at least one non-cancelled order in the selected rows — supply that actually sold. A distinct count: rows do not add up to the total, because one seller sells in several categories and months.

```sql
COUNT(DISTINCT IF(status != 'cancelled', seller_id, NULL))
```

### `order_size_band` · STRING · Column

- **Alias:** Order Size Band

Small, Medium, Large or Premium, from the order's gross GMV. A row-level formula that behaves as a dimension: group and filter by it. Bands are the order-value quartiles at round dollar edges.

```sql
CASE WHEN gmv < 50 THEN 'Small (under $50)' WHEN gmv < 100 THEN 'Medium ($50-99)' WHEN gmv < 250 THEN 'Large ($100-249)' ELSE 'Premium ($250+)' END
```

### `gmv_per_active_seller` · FLOAT · Metric

- **Alias:** GMV per Active Seller

Net GMV per seller who made a sale, in dollars — supply productivity. Reads Active Sellers, so the divisor is a distinct count: recompute it at each grain, never sum or average the rows.

```sql
SAFE_DIVIDE(SUM(net_gmv), active_sellers)
```

# Example Questions

- What is our net GMV and net take after `cancellations`, and how far does it sit below the gross headline?
- Which `categories` and `sellers` produce the most platform revenue, and how does seller payout move as take rate changes?
- How fast are orders fulfilled, and how does fill speed vary by `seller` fulfilment type or `category`?

## Joins

- [Buyer](./buyer.md) — `buyer_id = buyer_id` [N:1] — The buyer who placed this order.
- [Category](./category.md) — `category_id = category_id` [N:1] — The category this order is filed under.
- [Listings](./listings.md) — `listing_id = listing_id` [N:1] — The listing that was ordered.
  - [Listing Category](./category.md) — The category the listing is filed under, which can differ from the order's.
  - [Listing Seller](./seller.md) — The seller who owns the ordered listing.
    - [Listing Seller Category](./category.md) — The primary category of that listing's seller.
- [Seller](./seller.md) — `seller_id = seller_id` [N:1] — The seller who fulfilled this order.
  - [Seller Category](./category.md) — The primary category of the fulfilling seller.
