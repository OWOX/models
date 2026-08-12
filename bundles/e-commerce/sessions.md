---
title: "Sessions"
description: |
  Every browsing session on the storefront, with the device it happened on, the traffic source
  and campaign that produced it, the market it came from, and whether it ended in an order.
  Sessions are the hinge of the model: marketing spend attaches on one side and orders on the
  other, which is what lets acquisition cost be weighed against revenue.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-12T08:41:51.000Z
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

# Example Questions

- Which `traffic sources` and campaigns produce sessions that convert, not just sessions that arrive?
- How does conversion differ across devices and `countries`?
- How does paid traffic compare with organic and direct on conversion and `order` value?

## Joins

- [Countries](./countries.md) — `country_id = country_id`
- [Orders](./orders.md) — `session_id = session_id`
- [Pageviews](./pageviews.md) — `session_id = session_id`
- [Traffic Sources](./traffic-sources.md) — `traffic_source_id = traffic_source_id`
- [Unified Ad Spend](./unified-ad-spend.md) — `date = date`, `source = source`, `medium = medium`
- [Visitors](./visitors.md) — `visitor_id = visitor_id`
