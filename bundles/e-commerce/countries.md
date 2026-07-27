---
title: "Countries"
description: |
  The countries the storefront sells into, and the relative weight each one carries in the
  business. Every visitor, session and customer is tied to a country here, which makes this
  the single place geography is defined for the whole model — so revenue, conversion and
  acquisition cost can all be cut the same way across markets.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-27T16:47:23.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `country_id` | INTEGER | PK. Unique internal identifier for each country record. |
| `country` | STRING | Full name of the country. |
| `country_code` | STRING | Two-letter ISO country code representing the nation. |
| `weight` | INTEGER | Numerical value used to prioritize or rank countries in the e-commerce system. |

# Example Questions

- Which countries contribute the most revenue, and how does that compare with their share of `sessions`?
- Where does conversion hold up across markets, and which countries under-deliver against the traffic they receive?
- Which countries are worth expanding into, judged on `order` value rather than traffic volume?
