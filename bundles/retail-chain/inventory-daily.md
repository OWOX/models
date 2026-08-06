---
title: "Inventory (daily)"
description: |
  What was on the shelf, store by store and line by line, at the close of every day: units on hand
  and what they are worth, units still on order, the reorder point the line is managed against,
  whether it ended the day with nothing left, and how many weeks the remaining stock would last at
  current demand. Availability is the constraint on everything a store can sell — an empty shelf
  produces no sale, no margin and no loyalty, and the sale it loses rarely comes back later — so
  this is the mart that explains sales the sales figures themselves cannot. It is also where
  working capital sits: stock is cash on a shelf, and the same daily position that reveals a
  stockout reveals overstock in the lines nobody is buying. Reading the two together is the whole
  of inventory management — too little loses sales, too much ties up money and, in fresh food, is
  thrown away.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T00:46:46.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `snapshot_id` | STRING | Snapshot ID | PK. Unique identifier for this store, SKU and day position. |
| `store_id` | STRING | Store ID | Location the stock is held at. FK to [Store](./store.md) |
| `product_id` | STRING | Product ID | Line the position is recorded for. FK to [Product](./product.md) |
| `snapshot_date` | DATE | Snapshot Date | Day the position was taken at close of trade. With `store_id` and `product_id` this is the grain of the mart. |
| `on_hand_units` | INTEGER | On-Hand Units | Selling units left on this line at the close of the day. |
| `on_hand_value` | NUMERIC | On-Hand Value | Value of the units on hand at unit cost, in USD. The working capital standing on the shelf. |
| `on_order_units` | INTEGER | On-Order Units | Units already ordered and not yet received. A line can be empty and still covered if a delivery is inbound. |
| `reorder_point` | INTEGER | Reorder Point | Stock level at which the line should be reordered. On-hand persistently below it means the point is mis-set or the line is under-ordered. |
| `is_stockout` | BOOLEAN | Is Stockout | True when the line had no stock left at the close of the day. A line can still have sold during a day that ends in stockout — the snapshot is taken at day end, not across it. |
| `weeks_of_supply` | FLOAT | Weeks of Supply | How many weeks the stock on hand would last at current demand. Low means lost sales are close; high means cash tied up, and on perishables, write-offs ahead. |

# Example Questions

- What did empty shelves cost us over the period, and do stockouts concentrate in the fast-selling lines where they hurt most?
- Which `stores` hold weeks of supply far above what their demand justifies, and how much cash is sitting in that overstock?
- Does a line's reorder point actually protect it, or do the same SKUs run out repeatedly despite being ordered on time?

## Joins

- [Product](./product.md) — `product_id = product_id`
- [Store](./store.md) — `store_id = store_id`
