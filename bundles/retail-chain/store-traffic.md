---
title: "Store Traffic"
description: |
  How many people walked through each door each day, how many of them bought something, and what
  they spent when they did. Footfall is the denominator retail is missing whenever it looks only
  at sales: a store whose revenue fell may have been busier than ever and converted worse, or
  quieter and converted the same, and those two are completely different problems with completely
  different fixes. One row per store and day, with the day itself described — weekend and holiday
  flags are carried because retail demand is driven by the calendar more than by anything a store
  does, and a Tuesday is not comparable to a Saturday. Conversion and average basket sit alongside
  footfall so the three levers of a store day — traffic, conversion, basket — can be separated
  instead of collapsing into one revenue number.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T04:43:44.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `traffic_id` | STRING | Traffic ID | PK. Unique identifier for this store-day. |
| `store_id` | STRING | Store ID | Location the footfall was counted at. FK to [Store](./store.md) |
| `traffic_date` | DATE | Traffic Date | Calendar day the count covers. Together with `store_id` this is the grain of the mart. |
| `is_weekend` | BOOLEAN | Is Weekend | True for Saturday and Sunday. Weekend footfall runs far above weekday, so match days of week before comparing periods. |
| `is_holiday` | BOOLEAN | Is Holiday | True on a public holiday. Holidays shift both footfall and basket size and should be isolated, not averaged in. |
| `footfall` | INTEGER | Footfall | People who entered the store that day, counted at the door. The denominator behind conversion and sales per visitor. |
| `transactions` | INTEGER | Transactions | Baskets paid for that day. Reconciles with the receipt lines recorded for the same store and day. |
| `conversion_pct` | FLOAT | Conversion % | Transactions divided by footfall, as a **percentage on a 0–100 scale** — `87.4` means 87.4%, not 8740%. In food and general-merchandise retail this runs high — most people who walk in buy something — so read it against a grocery benchmark rather than a fashion one. |
| `avg_basket_value` | NUMERIC | Average Basket Value | Average spend per basket that day, in USD. The third lever on a store day, alongside footfall and conversion. |

# Example Questions

- When a `store`'s sales fall, is it losing visitors or losing them at the shelf — and which of the two explains more of the chain's variance?
- What does holiday trading actually add once the extra footfall is separated from the higher basket that comes with it?
- Which `stores` convert visitors best for their format, and what would the chain gain if the bottom quartile matched the median?

## Joins

- [Store](./store.md) — `store_id = store_id`
