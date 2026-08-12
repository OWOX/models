---
title: "Customers"
description: |
  Everyone who has registered an account on the storefront, with the channel that first
  brought them in, the market they belong to, and the segment their buying behaviour puts them
  in. This is where acquisition meets retention: the same row explains how a customer was won
  and how valuable they turned out to be.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-11T13:25:25.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `customer_id` | INTEGER | Customer ID | PK. Unique identifier for an individual registered customer |
| `customer_segment` | STRING | Customer Segment | The classification of the customer based on their purchase history or value |
| `registration_date` | DATE | Registration Date | The specific date when the customer account was created in the system |
| `acquisition_traffic_source_id` | INTEGER |  | FK to [Traffic Sources](./traffic-sources.md) |
| `country_id` | INTEGER | Country ID | The primary geographical location assigned to the customer FK to [Countries](./countries.md) |

# Example Questions

- Which acquisition channels bring in the customers who go on to `order` repeatedly, rather than just once?
- How is the customer base split across segments and `countries`, and how has that mix shifted as new customers register?
- What does an acquired customer cost by channel, and how does that compare with the revenue they generate?

## Joins

- [Countries](./countries.md) — `country_id = country_id`
- [Acquisition Traffic Source](./traffic-sources.md) — `acquisition_traffic_source_id = traffic_source_id`
