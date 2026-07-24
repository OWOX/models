---
title: "🥈 Sessions"
description: "This Data Mart provides a detailed log of individual e-commerce browsing sessions, including traffic sources, device types, and conversion outcomes. It is primarily used to analyze user behavior, marketing attribution, and website performance across different geographic regions."
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-24T16:38:24.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The specific date when the browsing session occurred |
| `session_id` | STRING | PK. Unique identifier for an individual user session |
| `customer_id` | INTEGER | Unique identifier of the customer associated with the session |
| `device_category` | STRING | The type of hardware device used during the session (e.g., mobile, desktop) |
| `conversion_seed` | FLOAT | A technical value used to simulate the probability of a transaction. |
| `visitor_id` | STRING | Unique identifier for the anonymous or recognized visitor. |
| `traffic_source_id` | INTEGER | Internal numeric identifier for the marketing traffic source. |
| `country_id` | INTEGER | Numeric identifier representing the geographic country of the visitor. |
| `is_conversion` | BOOLEAN | Indicates whether the session resulted in a successful transaction or goal completion. |
| `source` | STRING | The origin of the traffic, such as Google, Facebook, or direct entry. |
| `medium` | STRING | The high-level channel type of the traffic, such as organic or cost-per-click. |
| `campaign` | STRING | The name of the specific marketing campaign that drove the session. |

## Joins

- Visitors
- Traffic Sources
- Countries
- Pageviews
- Customers
- Orders
- Unified Ad Spend
