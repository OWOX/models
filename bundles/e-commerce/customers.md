---
title: "🥈 Customers"
description: "This Data Mart provides a comprehensive profile of registered e-commerce customers, including their segmentation, registration dates, and geographical locations. It is primarily used for analyzing customer acquisition trends and performing user-base segmentation for targeted marketing."
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-24T16:38:33.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `customer_id` | INTEGER | PK. Unique identifier for an individual registered customer |
| `customer_segment` | STRING | The classification of the customer based on their purchase history or value |
| `registration_date` | DATE | The specific date when the customer account was created in the system |
| `acquisition_traffic_source_id` | INTEGER |  |
| `country_id` | INTEGER | The primary geographical location assigned to the customer |

## Joins

- Acquisition Traffic Source
- Countries
