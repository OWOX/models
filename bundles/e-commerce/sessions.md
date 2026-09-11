---
title: "Sessions"
description: |
  Every browsing session on the storefront, with the device it happened on, the traffic source
  and campaign that produced it, the market it came from, and whether it ended in an order.
  Sessions are the hinge of the model: marketing spend attaches on one side and orders on the
  other, which is what lets acquisition cost be weighed against revenue.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-04T06:57:53.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | The specific date when the browsing session occurred FK to [Unified Ad Spend](./unified-ad-spend.md) |
| `session_id` | STRING | Session ID | PK. Unique identifier for an individual user session FK to [Pageviews](./pageviews.md) |
| `customer_id` | INTEGER | Customer ID | Unique identifier of the customer associated with the session |
| `device_category` | STRING | Device Category | The type of hardware device used during the session (e.g., mobile, desktop) |
| `conversion_seed` | FLOAT | Conversion Seed | A technical value used to simulate the probability of a transaction. |
| `visitor_id` | STRING | Visitor ID | Unique identifier for the anonymous or recognized visitor. FK to [Visitors](./visitors.md) |
| `traffic_source_id` | INTEGER | Traffic Source ID | Internal numeric identifier for the marketing traffic source. FK to [Traffic Sources](./traffic-sources.md) |
| `country_id` | INTEGER | Country ID | Numeric identifier representing the geographic country of the visitor. FK to [Countries](./countries.md) |
| `is_conversion` | BOOLEAN | Is Conversion | Indicates whether the session resulted in a successful transaction or goal completion. |
| `source` | STRING | Source | The origin of the traffic, such as Google, Facebook, or direct entry. FK to [Unified Ad Spend](./unified-ad-spend.md) |
| `medium` | STRING | Medium | The high-level channel type of the traffic, such as organic or cost-per-click. FK to [Unified Ad Spend](./unified-ad-spend.md) |
| `campaign` | STRING | Campaign | The name of the specific marketing campaign that drove the session. |
| `sessions_count` | INTEGER | Sessions | Distinct sessions in the selected rows. |
| `orders_count` | INTEGER | Orders | Distinct orders placed in those sessions, counted across the join. |
| `conversion_rate` | FLOAT | Conversion Rate | Orders per session — right at every cut. Inlined rather than composed over `orders_count`, because that formula reads a joined mart (Orders) and a formula may not read another formula that itself reads a join. |
| `traffic_type` | STRING | Traffic Type | Paid, Organic, Owned or Direct, from the medium. Row-level; group and filter by it. |

# Example Questions

- Which `traffic sources` and campaigns produce sessions that convert, not just sessions that arrive?
- How does conversion differ across devices and `countries`?
- How does paid traffic compare with organic and direct on conversion and `order` value?

## Joins

- [Countries](./countries.md) — `country_id = country_id` [N:1] — The market the session came from.
- [Orders](./orders.md) — `session_id = session_id` [1:1] — The order this session produced, where it converted.
  - [Order Customer](./customers.md) — The customer who placed the order in this session.
    - [Customer Country](./countries.md) — The customer's home market, which can differ from where the session came from.
    - [Customer Acquisition Source](./traffic-sources.md) — The channel that originally acquired the customer.
  - [Order Lines](./purchases.md) — The lines of the order placed in this session.
    - [Ordered Product](./products.md) — The products bought in this session.
      - [Product Page](./pages.md) — The storefront page of each product bought.
        - [Product Pageviews](./pageviews.md) — Views of those product pages.
      - [Product Category](./product-category.md) — The category of each product bought.
- [Pageviews](./pageviews.md) — `session_id = session_id` [1:N] — The clickstream of this session.
  - [Viewed Pages](./pages.md) — The pages seen in this session.
- [Traffic Sources](./traffic-sources.md) — `traffic_source_id = traffic_source_id` [N:1] — The channel that drove this session.
- [Unified Ad Spend](./unified-ad-spend.md) — `date = date`, `source = source`, `medium = medium` [N:N] — Spend on the same day and channel — a cohort match, not this session's cost.
  - [Ad Spend Traffic Source](./traffic-sources.md) — The channel behind the matched spend.
- [Visitors](./visitors.md) — `visitor_id = visitor_id` [N:1] — The visitor who browsed.
