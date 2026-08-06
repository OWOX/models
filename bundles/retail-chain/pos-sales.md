---
title: "POS Sales"
description: |
  Every line rung through a till across the chain: what was sold, where, when, at what price, at
  what discount and at what margin. This is the mart the rest of the model exists to explain — one
  row per receipt line, with the basket it belonged to, the promotion that priced it, the loyalty
  account behind it when the shopper was identified, and the way it was paid for and scanned. Price
  is carried alongside cost so margin is available at line level rather than reconstructed
  afterwards, which is what lets a discount be judged on the profit it left rather than the volume
  it moved. Because a sale line also carries its store, its SKU and its calendar day, it reaches
  straight into the two day-grained marts around it: the footfall the store saw that day and the
  stock position that line finished the day on. That is what turns a sales figure into a diagnosis
  — whether a weak day was fewer visitors, worse conversion, a smaller basket, or a shelf that had
  nothing left on it.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T04:39:43.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `sale_id` | STRING | Sale ID | PK. Unique identifier for this receipt line. |
| `store_id` | STRING | Store ID | Location the line was sold at. FK to [Store Traffic](./store-traffic.md) |
| `product_id` | STRING | Product ID | SKU that was sold. FK to [Product](./product.md) |
| `promotion_id` | STRING | Promotion ID | NULL when the line sold at regular price, so promoted and full-price trade separate on this column alone. FK to [Promotion](./promotion.md) |
| `member_id` | STRING | Member ID | NULL when the basket was not identified, which is how an anonymous shopper appears. FK to [Loyalty Members](./loyalty-members.md) |
| `basket_id` | STRING | Basket ID | Identifier of the basket this line was paid for in. Groups the lines of one transaction, so basket size and mix are a roll-up of this mart. |
| `sold_at` | TIMESTAMP | Sold At | Exact moment the line was rung through the till. Use this for hour-of-day and daypart questions. |
| `sale_date` | DATE | Sale Date | Calendar date of the sale. Carried alongside `sold_at` because day-grained marts — store traffic and the daily stock position — join on a date, not a timestamp. FK to [Store Traffic](./store-traffic.md) |
| `quantity` | INTEGER | Quantity | Selling units sold on this line. |
| `unit_price` | NUMERIC | Unit Price | Shelf price per unit before any discount, in USD. |
| `discount` | NUMERIC | Discount | Value taken off the line by the promotion it was on, in USD. Zero on a line sold at regular price — there is no markdown history in this model, so `promotion_id IS NULL` and a zero discount mean the same thing. |
| `net_sales` | NUMERIC | Net Sales | What the line actually took after discount, in USD. The revenue figure to sum. |
| `line_cost` | NUMERIC | Line Cost | What the units on this line cost the chain, in USD. |
| `gross_margin` | NUMERIC | Gross Margin | `net_sales` less `line_cost`, in USD. The only one of the money columns that says whether the line was worth selling — read promotions and categories on this, with revenue beside it. |
| `checkout_type` | STRING | Checkout Type | Where the line was scanned: `staffed` or `self_checkout`. Summed by store it gives each site's self-checkout share of trade, which is the figure to set beside that store's `Shrinkage` events with `detected_by = 'self_checkout_audit'` — the two marts are read side by side at store level rather than joined. |
| `payment_method` | STRING | Payment Method | How the basket was settled: `card`, `cash`, `mobile_wallet`, `ebt` or `gift_card`. `ebt` marks a benefits-funded basket, which shops a distinctly different assortment. |
| `count_sale_lines` | INTEGER | Sale Line Count | Always `1` on every row; SUM to count receipt lines. |

# Example Questions

- Which `promotions` earned their discount and which merely bought volume we would have taken anyway at full price, once line-level margin rather than revenue is the measure?
- How much trade did we lose to empty shelves — what did the lines that finished a day out of stock sell on the days they were available, and which velocity bands carry that loss?
- Do identified loyalty baskets differ from anonymous ones in size, margin and category mix by enough to justify what the programme costs?

## Joins

- [Inventory (daily)](./inventory-daily.md) — `store_id = store_id`, `product_id = product_id`, `sale_date = snapshot_date`
- [Loyalty Members](./loyalty-members.md) — `member_id = member_id`
- [Product](./product.md) — `product_id = product_id`
- [Promotion](./promotion.md) — `promotion_id = promotion_id`
- [Store](./store.md) — `store_id = store_id`
- [Store Traffic](./store-traffic.md) — `store_id = store_id`, `sale_date = traffic_date`
