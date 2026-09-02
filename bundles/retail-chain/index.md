---
title: "Retail Chain"
description: |
  A United States general-merchandise-and-grocery chain in the supercenter format, modelled from
  the moment a shopper walks through a door to the moment goods come back over the service desk.
  People arrive at a store and some fraction of them buy; every line they buy is priced, discounted
  and costed, so margin is available at the till rather than reconstructed at month end; the stock
  behind those lines is counted every night, ordered from suppliers on a lead time, and written off
  when it is stolen, damaged or out of date. Loyalty accounts sit across the whole of it, carrying
  recency, frequency, spend and a home store, so identified baskets can be followed over time while
  anonymous ones still count towards the trade. Because a sale line carries its store, its SKU and
  its day, footfall and the day's closing stock position are one join away from any sales figure —
  which is what makes a weak week diagnosable as fewer visitors, worse conversion, a smaller basket
  or an empty shelf, rather than merely visible as a smaller number.

  **Scope:** this model covers store trade end to end — traffic, sales and margin, promotions,
  loyalty, stock, replenishment, shrink and returns. Its boundaries are worth stating plainly.
  There is no store labour or staffing data, so nothing here answers sales per labour hour,
  schedule efficiency or the cost of running a shift. Suppliers appear as a name on a product and
  on a replenishment order rather than as an entity, so supplier scorecards go only as far as that
  name carries them. There is no distribution centre — orders run from a store to a supplier, and
  the warehouse leg between them is not modelled — and no price or markdown history beyond the
  promotions themselves, so elasticity questions that need a full price ladder cannot be answered.
  There is also no online channel: this is a bricks-and-mortar chain, and its traffic is people
  walking through a door, not sessions on a site.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-09-02T16:30:06Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Vlad Flaks](https://github.com/vladflaks), [Rus Obolonsky](https://github.com/Obolrus)

| Data Mart | Fields |
|-----------|--------|
| [Inventory (daily)](./inventory-daily.md) | 10 |
| [Loyalty Members](./loyalty-members.md) | 21 |
| [POS Sales](./pos-sales.md) | 17 |
| [Product](./product.md) | 14 |
| [Promotion](./promotion.md) | 9 |
| [Replenishment](./replenishment.md) | 15 |
| [Returns](./returns.md) | 14 |
| [Shrinkage](./shrinkage.md) | 10 |
| [Store](./store.md) | 9 |
| [Store Traffic](./store-traffic.md) | 9 |

# Example Questions

- When a `store`'s sales fall, which lever moved — did fewer people come in, did fewer of them buy, did they spend less per basket, or did the lines they came for finish the day out of stock?
- Which `promotions` earned their discount and which merely bought volume we already had, judged on line-level margin rather than revenue, and does the answer change by funding source?
- What does the reverse flow really cost — refunds plus the value destroyed by disposition, plus the shrink that never reaches a till at all — and where do the two concentrate by `store`, by category and by the way each loss was detected?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/retail-chain)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Retail Chain model diagram](../res/screens/retail-chain.svg)
