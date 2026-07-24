---
type: "OWOX Data Mart"
title: "🥈 Sessions (E-Commerce)"
description: "This Data Mart provides a detailed log of individual e-commerce browsing sessions, including traffic sources, device types, and conversion outcomes. It is primarily used to analyze user behavior, marketing attribution, and website performance across different geographic regions."
tags: ["owox"]
timestamp: 2026-07-16T02:42:23.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The specific date when the browsing session occurred FK to [🥈 Unified Ad Spend (E-Commerce)](./unified-ad-spend-e-commerce.md) |
| `session_id` | STRING | PK. Unique identifier for an individual user session FK to [🥈 Orders (E-Commerce)](./orders-e-commerce.md) |
| `customer_id` | INTEGER | Unique identifier of the customer associated with the session FK to [🥈 Customers (E-Commerce)](./customers-e-commerce.md) |
| `device_category` | STRING | The type of hardware device used during the session (e.g., mobile, desktop) |
| `conversion_seed` | FLOAT | A technical value used to simulate the probability of a transaction. |
| `visitor_id` | STRING | Unique identifier for the anonymous or recognized visitor. FK to [🥈 Visitors (E-Commerce)](./visitors-e-commerce.md) |
| `traffic_source_id` | INTEGER | Internal numeric identifier for the marketing traffic source. FK to [🥈 Traffic Sources (E-Commerce)](./traffic-sources-e-commerce.md) |
| `country_id` | INTEGER | Numeric identifier representing the geographic country of the visitor. FK to [🥈 Countries (E-Commerce)](./countries-e-commerce.md) |
| `is_conversion` | BOOLEAN | Indicates whether the session resulted in a successful transaction or goal completion. |
| `source` | STRING | The origin of the traffic, such as Google, Facebook, or direct entry. FK to [🥈 Unified Ad Spend (E-Commerce)](./unified-ad-spend-e-commerce.md) |
| `medium` | STRING | The high-level channel type of the traffic, such as organic or cost-per-click. FK to [🥈 Unified Ad Spend (E-Commerce)](./unified-ad-spend-e-commerce.md) |
| `campaign` | STRING | The name of the specific marketing campaign that drove the session. |

## Joins

- [Visitors](./visitors-e-commerce.md) — `visitor_id = visitor_id`
- [Traffic Sources](./traffic-sources-e-commerce.md) — `traffic_source_id = traffic_source_id`
- [Countries](./countries-e-commerce.md) — `country_id = country_id`
- [Pageviews](./pageviews-e-commerce.md) — `session_id = session_id`
- [Customers](./customers-e-commerce.md) — `customer_id = customer_id`
- [Orders](./orders-e-commerce.md) — `session_id = session_id`
- [Unified Ad Spend](./unified-ad-spend-e-commerce.md) — `date = date`, `source = source`, `medium = medium`
