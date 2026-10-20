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
timestamp: 2026-10-19T16:30:29.000Z
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

## Calculated fields

### `transactions` · INTEGER · Metric

- **Alias:** Transactions

Baskets paid for — distinct receipts, not lines. Adds up across stores and days, since a basket never spans them; does not add up across categories or promotions, where one basket counts once in each.

```sql
COUNT(DISTINCT basket_id)
```

### `avg_transaction_value` · FLOAT · Metric

- **Alias:** Average Transaction Value

Net sales per basket, in USD (ATV): net sales divided by Transactions. Cut by a category, it is spend on that category per basket that contained it.

```sql
SAFE_DIVIDE(SUM(net_sales), transactions)
```

### `units_per_transaction` · FLOAT · Metric

- **Alias:** Units per Transaction

Selling units per basket (UPT): units sold divided by Transactions. Together with Average Transaction Value it says whether a basket grew by more items or dearer ones.

```sql
SAFE_DIVIDE(SUM(quantity), transactions)
```

### `gross_margin_pct` · FLOAT · Metric

- **Alias:** Gross Margin %

Gross margin as a share of net sales, 0–1 (0.22 means 22%). A ratio of sums, so it is right at every cut; never average line-level margins instead.

```sql
SAFE_DIVIDE(SUM(gross_margin), SUM(net_sales))
```

### `loyalty_sales_share` · FLOAT · Metric

- **Alias:** Loyalty Sales Share

Share of net sales rung on an identified loyalty basket, 0–1. The rest is anonymous trade; per-member figures must be taken over this identified part only.

```sql
SAFE_DIVIDE(SUM(IF(member_id IS NOT NULL, net_sales, 0)), SUM(net_sales))
```

### `promo_sales_share` · FLOAT · Metric

- **Alias:** Promotional Sales Share

Share of net sales sold on a promotion, 0–1 (promo penetration). Lines with a promotion over all net sales; read it beside Gross Margin %, since promoted trade carries far less margin.

```sql
SAFE_DIVIDE(SUM(IF(promotion_id IS NOT NULL, net_sales, 0)), SUM(net_sales))
```

### `shopper_type` · STRING · Column

- **Alias:** Shopper Type

Loyalty member or Anonymous: whether a loyalty card was scanned on the basket. A row-level dimension; pair it with Average Transaction Value, Units per Transaction or Transactions to compare member trips with anonymous ones. A basket is never split, so Transactions add up across the two.

```sql
CASE WHEN member_id IS NOT NULL THEN 'Loyalty member' ELSE 'Anonymous' END
```

### `price_type` · STRING · Column

- **Alias:** Price Type

Promoted or Full price: whether the line sold on a promotion. A row-level dimension; pair it with Gross Margin % to see the margin promotion costs, or with net sales for the promoted split. One basket can hold both kinds of line, so Transactions do not add up across the two.

```sql
CASE WHEN promotion_id IS NOT NULL THEN 'Promoted' ELSE 'Full price' END
```

# Example Questions

- Which `promotions` earned their discount and which merely bought volume we would have taken anyway at full price, once line-level margin rather than revenue is the measure?
- How much trade did we lose to empty shelves — what did the lines that finished a day out of stock sell on the days they were available, and which velocity bands carry that loss?
- Do identified loyalty baskets differ from anonymous ones in size, margin and category mix by enough to justify what the programme costs?

## Joins

- [Inventory (daily)](./inventory-daily.md) — `store_id = store_id`, `product_id = product_id`, `sale_date = snapshot_date` [N:1] — Stock of this SKU at this store on the day of sale.
  - [Inventory SKU](./product.md) — The SKU as the sale-day stock snapshot records it.
  - [Inventory Store](./store.md) — The store the sale-day stock snapshot belongs to.
- [Loyalty Members](./loyalty-members.md) — `member_id = member_id` [N:1] — The member who bought, where a card was scanned.
  - [Member Home Store](./store.md) — The buyer's home store, which need not be where they bought.
- [Product](./product.md) — `product_id = product_id` [N:1] — The SKU sold on this line.
- [Promotion](./promotion.md) — `promotion_id = promotion_id` [N:1] — The promotion applied to this line.
- [Store](./store.md) — `store_id = store_id` [N:1] — The store that rang up this line.
- [Store Traffic](./store-traffic.md) — `store_id = store_id`, `sale_date = traffic_date` [N:1] — Footfall at this store on the day of sale.
  - [Traffic Store](./store.md) — The store behind that day of footfall.
