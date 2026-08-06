---
title: "Returns"
description: |
  What came back, and what happened to it: one row per returned line, with the sale it came from
  when there was a receipt, the reason the shopper gave, and what the chain did with the goods
  afterwards. Across a general-merchandise assortment returns are a material flow rather than a
  rounding error, and they cost twice over — the refund handed back and the value destroyed when
  the returned unit cannot go straight back on the shelf. That second cost is what `disposition`
  measures: a line resold at full price loses almost nothing, one marked down loses part of its
  margin, one sent back to the vendor recovers cost from someone else, and one disposed of loses
  everything. The reason a return was made says where the problem actually sits — a defect belongs
  to the supplier, a wrong item to the shelf edge or the pick, and a change of mind to nobody but
  the shopper. Elapsed time and whether a receipt was produced complete the picture, because the
  returns that arrive late and unreceipted behave differently from the rest in both cost and risk.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T04:41:39.000Z
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

# Example Questions

- Which categories and suppliers cost us most after returns, once refunds and the value destroyed by disposition are taken off the margin the original sale reported?
- How much of the reverse flow arrives without a receipt, where does it concentrate, and how does its reason mix differ from receipted returns?
- Are defect and wrong-item returns clustered on particular lines or particular `stores`, and how quickly after purchase do they come back?

## Joins

- [Loyalty Members](./loyalty-members.md) — `member_id = member_id`
- [POS Sales](./pos-sales.md) — `sale_id = sale_id`
- [Product](./product.md) — `product_id = product_id`
- [Store](./store.md) — `store_id = store_id`
