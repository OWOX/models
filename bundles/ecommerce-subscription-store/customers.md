---
title: "Customers"
description: |
  Everyone who has bought from the store, with the channel that first brought them in, the
  market they buy from, their contact details for lifecycle marketing, and the behavioural type
  their buying history puts them in. This is the join point between acquisition and everything
  that follows: the same row explains how a customer was won and where they are today.

  First and last order dates sit here, so the base can be split into who is currently buying and
  who has drifted away, before any subscription logic is applied. Marketing consent is explicit,
  which matters because win-back and dunning campaigns can only address customers who allow it.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-28T16:51:49.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `customer_id` | STRING | Customer ID | PK. Unique identifier of the customer. |
| `registered_at` | DATE | Registered At | Date the customer account was created. |
| `first_order_date` | DATE | First Order Date | Date the customer placed their first order. |
| `last_order_date` | DATE | Last Order Date | Date the customer placed their most recent order. |
| `customer_type` | STRING | Customer Type | Behavioural type based on buying history: New, Returning or Churned. |
| `email` | STRING | Email | Most recent known email address of the customer. |
| `phone` | STRING | Phone | Most recent known phone number of the customer. |
| `city` | STRING | City | City the customer's latest order was shipped to. |
| `country` | STRING | Country | Country the customer's latest order was shipped to. |
| `country_code` | STRING | Country Code | Two-letter code of the country the customer buys from. |
| `acquisition_traffic_source_id` | STRING | Acquisition Traffic Source ID | Traffic source that first brought the customer to the store. FK to [Traffic Sources](./traffic-sources.md) |
| `marketing_opt_in` | BOOLEAN | Marketing Opt In | Whether the customer consented to receive marketing communication. |

# Example Questions

- Which acquisition channels bring in customers who go on to buy repeatedly, rather than once?
- How is the customer base split across markets, and where is the `subscription` programme under-represented?
- How many customers have gone quiet, and how many of them are still reachable by email or phone?

## Joins

- [Traffic Sources](./traffic-sources.md) — `acquisition_traffic_source_id = traffic_source_id`
