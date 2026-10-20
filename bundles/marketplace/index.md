---
title: "Marketplace"
description: |
  A two-sided online marketplace modeled end to end: independent buyers and independent
  sellers matched through listings and search, with every order carrying the full economics —
  gross merchandise value, the category take rate, the platform's cut and the seller's
  payout. Around that match sit the signals that tell you whether the two sides are actually
  clearing: what buyers searched for and failed to find, which listings never sold, which
  orders fell through before settling, and what the ratings say afterwards. Together they let
  you follow both sides of the flywheel — where demand goes unmet, and where supply gives up.

  **How this business is managed**
  - **Supply** — grows the number of sellers who actually sell, and keeps their catalogues live while they do.
  - **Demand** — turns buyers' searches into orders, and brings the buyers who order back for a second one.
  - **Trust & Safety** — keeps orders from being cancelled after they are placed, and buyers from ending up with a complaint.

  **Key metrics**
  - Net GMV — [Orders · Net GMV](./orders.md?field=net_gmv) by [Orders · Ordered At](./orders.md?field=ordered_at).
  - Take rate — [Orders · Take Rate](./orders.md?field=net_take_rate), platform revenue over net GMV, on a 0–1 scale.
  - Active sellers — [Orders · Active Sellers](./orders.md?field=active_sellers), distinct sellers with a non-cancelled order in the period.
  - Cancellation rate — [Orders · Cancellation Rate](./orders.md?field=cancellation_rate), by order count, on a 0–1 scale.

  **Key Data Marts**
  - [Orders](./orders.md) — every match of a buyer to a seller's listing, with its full economics.
  - [Search Requests](./search-requests.md) — the demand that arrives, and how much of it ends in an order.
  - [Seller](./seller.md) — the supply side, and where each seller is in its life on the platform.
  - [Listings](./listings.md) — the catalogue buyers can order from today.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-10-20T20:05:21Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Vlad Flaks](https://github.com/vladflaks), [Rus Obolonsky](https://github.com/Obolrus)

| Data Mart | Fields |
|-----------|--------|
| [Buyer](./buyer.md) | 7 |
| [Cancellations](./cancellations.md) | 7 |
| [Category](./category.md) | 4 |
| [Listings](./listings.md) | 7 |
| [Orders](./orders.md) | 15 |
| [Reviews](./reviews.md) | 6 |
| [Search Requests](./search-requests.md) | 10 |
| [Seller](./seller.md) | 10 |

# Example Questions

- Where is liquidity weakest — which `categories` have `buyers` searching but too little live supply to fill the demand?
- Is take-rate optimisation costing us supply, with `sellers` in our highest-commission `categories` going dormant faster than the rest?
- How much of our booked GMV never settles, and do `cancellations` and complaints concentrate around the same `sellers`?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/marketplace)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Marketplace model diagram](../res/screens/marketplace.svg)
