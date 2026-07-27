---
title: "Sessions"
description: |
  Every browsing session on the storefront, with the device it happened on, the traffic source
  and campaign that produced it, the market it came from, and whether it ended in an order.
  Sessions are the hinge of the model: marketing spend attaches on one side and orders on the
  other, which is what lets acquisition cost be weighed against revenue.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T16:47:26.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The specific date when the browsing session occurred FK to [Unified Ad Spend](./unified-ad-spend.md) |
| `session_id` | STRING | PK. Unique identifier for an individual user session FK to [Orders](./orders.md) |
| `customer_id` | INTEGER | Unique identifier of the customer associated with the session FK to [Customers](./customers.md) |
| `device_category` | STRING | The type of hardware device used during the session (e.g., mobile, desktop) |
| `conversion_seed` | FLOAT | A technical value used to simulate the probability of a transaction. |
| `visitor_id` | STRING | Unique identifier for the anonymous or recognized visitor. FK to [Visitors](./visitors.md) |
| `traffic_source_id` | INTEGER | Internal numeric identifier for the marketing traffic source. FK to [Traffic Sources](./traffic-sources.md) |
| `country_id` | INTEGER | Numeric identifier representing the geographic country of the visitor. FK to [Countries](./countries.md) |
| `is_conversion` | BOOLEAN | Indicates whether the session resulted in a successful transaction or goal completion. |
| `source` | STRING | The origin of the traffic, such as Google, Facebook, or direct entry. FK to [Unified Ad Spend](./unified-ad-spend.md) |
| `medium` | STRING | The high-level channel type of the traffic, such as organic or cost-per-click. FK to [Unified Ad Spend](./unified-ad-spend.md) |
| `campaign` | STRING | The name of the specific marketing campaign that drove the session. |

# Example Questions

- Which `traffic sources` and campaigns produce sessions that convert, not just sessions that arrive?
- How does conversion differ across devices and `countries`?
- How does paid traffic compare with organic and direct on conversion and `order` value?

## Joins

- [Visitors](./visitors.md) — `visitor_id = visitor_id`
- [Traffic Sources](./traffic-sources.md) — `traffic_source_id = traffic_source_id`
- [Countries](./countries.md) — `country_id = country_id`
- [Pageviews](./pageviews.md) — `session_id = session_id`
- [Customers](./customers.md) — `customer_id = customer_id`
- [Orders](./orders.md) — `session_id = session_id`
- [Unified Ad Spend](./unified-ad-spend.md) — `date = date`, `source = source`, `medium = medium`
