---
type: "OWOX Data Mart"
title: "🥈 Customers (E-Commerce)"
description: "This Data Mart provides a comprehensive profile of registered e-commerce customers, including their segmentation, registration dates, and geographical locations. It is primarily used for analyzing customer acquisition trends and performing user-base segmentation for targeted marketing."
tags: ["owox"]
timestamp: 2026-07-16T01:07:29.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `customer_id` | INTEGER | PK. Unique identifier for an individual registered customer |
| `customer_segment` | STRING | The classification of the customer based on their purchase history or value |
| `registration_date` | DATE | The specific date when the customer account was created in the system |
| `acquisition_traffic_source_id` | INTEGER | FK to [🥈 Traffic Sources (E-Commerce)](./traffic-sources-e-commerce.md) |
| `country_id` | INTEGER | The primary geographical location assigned to the customer FK to [🥈 Countries (E-Commerce)](./countries-e-commerce.md) |

## Joins

- [Acquisition Traffic Source](./traffic-sources-e-commerce.md) — `acquisition_traffic_source_id = traffic_source_id`
- [Countries](./countries-e-commerce.md) — `country_id = country_id`
