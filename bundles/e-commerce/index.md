---
title: "E-Commerce"
description: |
  An online retail business modeled end to end — from the traffic that arrives on the
  storefront, through browsing sessions and product discovery, to orders, revenue and repeat
  purchasing, with paid advertising across every major channel tied back to the sales it drives.
  Web sessions, pageviews and traffic sources describe how shoppers find and move through the
  store; the product catalog and its categories describe what they browse; orders, purchases and
  customers capture what they buy and how often they return; and unified ad spend brings Google,
  Facebook, TikTok, LinkedIn, Microsoft, Reddit and X advertising together with Shopify sales so
  acquisition cost can be weighed against the revenue it returns.

  **How this business is managed**
  - **Marketing** — brings in shoppers who buy, at a return on ad spend the business can carry.
  - **Advertising** — buys paid clicks on seven ad platforms at the lowest cost it can.
  - **Head of Marketing** — oversees paid media across every warehouse the company keeps data in.
  - **Product** — turns storefront visits into orders.
  - **Sales** — grows settled revenue year on year, across categories and markets.
  - **Operations** — gets every order to the customer, with fewer cancellations and returns.
  - **Finance** — makes sure booked revenue turns into revenue the store keeps; its data is closed to business users.

  **Key metrics**
  - Settled revenue — [Purchases · Item Net Revenue](./purchases.md?field=line_net_revenue) by [Orders · Order Date](./orders.md?field=order_date).
  - Conversion — [Sessions · Conversion Rate](./sessions.md?field=conversion_rate), orders per session as a fraction (0.028 means 2.8%).
  - Ad spend — [Unified Ad Spend · Spend](./unified-ad-spend.md?field=spend).
  - Order outcome — [Orders · Completion Rate](./orders.md?field=completion_rate), the share of orders neither cancelled nor returned, as a fraction (0.90 means 90%), read on Orders alone; [Orders · Status](./orders.md?field=status) says which.

  **Key Data Marts**
  - [Sessions](./sessions.md) — every visit, with the channel that brought it and whether it ended in an order.
  - [Purchases](./purchases.md) — every order line: booked and settled revenue, cost of goods and profit.
  - [Unified Ad Spend](./unified-ad-spend.md) — spend, clicks and the platforms' own conversion claims from all seven ad platforms.
  - Ad Performance — spend set against the orders and revenue the store recorded, campaign by campaign.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-10-20T20:04:21Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Vlad Flaks](https://github.com/vladflaks), [Rus Obolonsky](https://github.com/Obolrus)

| Data Mart | Fields |
|-----------|--------|
| [Countries](./countries.md) | 4 |
| [Customers](./customers.md) | 5 |
| [Orders](./orders.md) | 5 |
| [Pages](./pages.md) | 4 |
| [Pageviews](./pageviews.md) | 6 |
| [Product Category](./product-category.md) | 5 |
| [Products](./products.md) | 8 |
| [Purchases](./purchases.md) | 12 |
| [Sessions](./sessions.md) | 12 |
| [Traffic Sources](./traffic-sources.md) | 6 |
| [Unified Ad Spend](./unified-ad-spend.md) | 9 |
| [Visitors](./visitors.md) | 11 |

# Example Questions

- Which `traffic sources` and paid channels bring in the shoppers who actually convert, and what does each acquired `customer` cost versus the revenue they generate?
- How does the storefront funnel — `sessions` to `product views` to `orders` — convert, and where are the biggest drop-offs by `country`, `category` or landing `page`?
- Which `products` and `categories` drive the most revenue and repeat purchasing, and how does that shift across `countries` and over time?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/e-commerce)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![E-Commerce model diagram](../res/screens/e-commerce.svg)
