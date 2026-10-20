---
title: "Returns"
description: |
  What came back, and what happened to it: one row per returned line, with the
  [sale](./pos-sales.md) it came from when there was a receipt, the reason the shopper gave, and
  what the chain did with the goods afterwards. Across a general-merchandise assortment returns are
  a material flow rather than a rounding error, and they cost twice over — the refund handed back
  and the value destroyed when the returned unit cannot go straight back on the shelf. That second
  cost is what `disposition` measures: a line resold at full price loses almost nothing, one marked
  down loses part of its margin, one sent back to the vendor recovers cost from someone else, and
  one disposed of loses everything. The reason a return was made says where the problem actually
  sits — a defect belongs to the supplier, a wrong item to the shelf edge or the pick, and a change
  of mind to nobody but the shopper. Elapsed time and whether a receipt was produced complete the
  picture, because the returns that arrive late and unreceipted behave differently from the rest in
  both cost and risk.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-16T16:32:32.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `return_id` | STRING | Return ID | PK. Unique identifier for this returned line. |
| `sale_id` | STRING | Sale ID | NULL when the goods came back without a receipt, which is why store and product are also carried directly on this mart. FK to [POS Sales](./pos-sales.md) |
| `store_id` | STRING | Store ID | Location that accepted the return, which need not be the store that sold the item. FK to [Store](./store.md) |
| `product_id` | STRING | Product ID | Line that was returned. FK to [Product](./product.md) |
| `member_id` | STRING | Member ID | NULL when the return was not tied to an identified shopper. FK to [Loyalty Members](./loyalty-members.md) |
| `returned_at` | TIMESTAMP | Returned At | Exact moment the return was processed at the service desk. |
| `return_date` | DATE | Return Date | Calendar date the return was processed. |
| `quantity_returned` | INTEGER | Units Returned | Selling units handed back on this line. |
| `refund_amount` | NUMERIC | Refund Amount | Money refunded to the shopper for this line, in USD. Only the direct cost — the value destroyed by the disposition sits alongside it. |
| `reason` | STRING | Return Reason | Why the goods came back: `damaged`, `defective`, `wrong_item`, `changed_mind`, `expired` or `price_dispute`. Separates faults the chain or its suppliers can fix from the cost of a generous returns policy. |
| `disposition` | STRING | Disposition | What became of the unit: `resell` (back on the shelf at full price), `markdown` (sellable at a reduced price), `vendor_return` (cost recovered from the supplier), `disposal` (written off entirely). This is where the larger cost of a return sits. |
| `is_receipted` | BOOLEAN | Is Receipted | True when a receipt was produced, so the return resolves to an original sale line. False rows have no `sale_id` and are the harder population to control. |
| `days_since_purchase` | INTEGER | Days Since Purchase | Days between the original sale and the return. Meaningful only on receipted rows, where the original sale date is known. |
| `count_returns` | INTEGER | Return Count | Always `1` on every row; SUM to count returned lines. |

## Calculated fields

### `return_window` · STRING · Column

- **Alias:** Return Window

How long after the sale the goods came back: Week 1 (1-7 days), Week 2 (8-14 days), Weeks 3-4 (15-30 days), Late (31+ days), or No receipt when there is no sale to measure from. A row-level formula that behaves as a dimension: group and filter by it.

```sql
CASE WHEN NOT is_receipted OR days_since_purchase IS NULL THEN 'No receipt' WHEN days_since_purchase <= 7 THEN 'Week 1 (1-7 days)' WHEN days_since_purchase <= 14 THEN 'Week 2 (8-14 days)' WHEN days_since_purchase <= 30 THEN 'Weeks 3-4 (15-30 days)' ELSE 'Late (31+ days)' END
```

# Example Questions

- Which categories and suppliers cost us most after returns, once refunds and the value destroyed by disposition are taken off the margin the original sale reported?
- How much of the reverse flow arrives without a receipt, where does it concentrate, and how does its reason mix differ from receipted returns?
- Are defect and wrong-item returns clustered on particular lines or particular `stores`, and how quickly after purchase do they come back?

## Joins

- [Loyalty Members](./loyalty-members.md) — `member_id = member_id` [N:1] — The member who returned it.
  - [Member Home Store](./store.md) — The home store of the member who returned.
- [POS Sales](./pos-sales.md) — `sale_id = sale_id` [N:1] — The receipt line being returned.
  - [Sale-Day Inventory](./inventory-daily.md) — Stock at the selling store on the day of sale.
    - [Inventory SKU](./product.md) — The SKU as the sale-day stock snapshot records it.
    - [Inventory Store](./store.md) — The store the sale-day stock snapshot belongs to.
  - [Buying Member](./loyalty-members.md) — The member who bought, who need not be the one returning.
    - [Buyer Home Store](./store.md) — The home store of the member who bought.
  - [Sold Product](./product.md) — The SKU as sold on the original receipt line.
  - [Sale Promotion](./promotion.md) — The promotion the returned line was bought under.
  - [Selling Store](./store.md) — The store that made the sale, which can differ from where it came back.
  - [Sale-Day Traffic](./store-traffic.md) — Footfall at the selling store on the day of sale.
    - [Sale Traffic Store](./store.md) — The store behind that day of footfall — the selling store.
- [Product](./product.md) — `product_id = product_id` [N:1] — The SKU returned.
- [Store](./store.md) — `store_id = store_id` [N:1] — The store that took the return.
