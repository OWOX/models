---
title: "Product"
description: |
  The assortment, one row per SKU: what the line is, who makes it, who supplies it, what it costs
  the chain and what it lists at. Two fields do most of the analytical work here. `velocity_band`
  is the A/B/C classification that decides replenishment priority and shelf position — an A line
  sells every day and a stockout on it costs real money, a C line may sit for weeks and is mostly a
  question of whether it earns its space. `is_perishable` separates the lines with a shelf life
  from the rest, and perishability drives both how often a line has to be reordered and how much of
  it is written off before it ever sells. Alongside those, `unit_cost` against `list_price` gives
  the intended margin on every line before any promotion touches it, and `is_private_label`
  separates the chain's own brands — typically higher margin, and the lever a grocer pulls when
  shoppers trade down.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T00:46:49.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `product_id` | STRING | Product ID | PK. Unique identifier for this SKU. |
| `sku` | STRING | SKU | Stock-keeping unit code as it appears on the shelf edge and in ordering. |
| `name` | STRING | Product Name | Description of the line as it reads on the shelf and the receipt. |
| `category` | STRING | Category | Top level of the merchandising hierarchy, e.g. `Grocery`, `Fresh Food`, `Apparel`, `Home`. |
| `subcategory` | STRING | Subcategory | Second level of the merchandising hierarchy within the category. |
| `brand` | STRING | Brand | Brand the line is sold under. Compare against `is_private_label` to separate own brands from national ones. |
| `supplier_name` | STRING | Supplier | Vendor the chain buys this line from. Matches the supplier on replenishment orders, so supplier service level is answerable from these two together. |
| `unit_cost` | NUMERIC | Unit Cost | Cost to the chain of one selling unit. The basis of margin on every sale line. |
| `list_price` | NUMERIC | List Price | Shelf price of one selling unit before any promotion. The gap to `unit_cost` is the intended margin. |
| `pack_size` | STRING | Pack Size | How the line is packaged for sale, e.g. `12-count`, `2 lb`, `single`. Normalise on this before comparing prices across brands. |
| `unit_of_measure` | STRING | Unit of Measure | Unit the line is sold in: `each`, `lb`, `oz`, `pack`, `case`. |
| `velocity_band` | STRING | Velocity Band | ABC velocity class: `A` for the fastest sellers, `C` for the slowest. A stockout on an A line costs far more than one on a C line. |
| `is_private_label` | BOOLEAN | Is Private Label | True for the chain's own brands, which carry higher margin and gain share when shoppers trade down. |
| `is_perishable` | BOOLEAN | Is Perishable | True for lines with a shelf life. Perishability drives both replenishment cadence and expiry write-offs. |

# Example Questions

- Which categories carry our margin once private label is separated from national brands, and where is the intended margin never realised at the till?
- Are our A-band lines the ones we actually keep in stock, or does availability track pack size and perishability instead?
- Which suppliers concentrate the most of our perishable assortment, and what does that concentration expose us to?
