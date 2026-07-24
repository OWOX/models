---
type: "OWOX Data Mart"
title: "🥈 Pages (E-Commerce)"
description: "This dataset provides a comprehensive directory of all web pages within the e-commerce platform, categorized by their functional purpose. It is used to map specific URL paths to human-readable titles and page types, such as Product, Category, or Checkout, to support website navigation and conversion analysis."
tags: ["owox"]
timestamp: 2026-06-05T09:13:22.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `page_id` | INTEGER | Unique numerical identifier for each specific page on the website. FK to [🥈 Pageviews (E-Commerce)](./pageviews-e-commerce.md) |
| `page_path` | STRING | The URL path of the page relative to the domain root. |
| `page_title` | STRING | The human-readable name or display title of the web page. |
| `page_type` | STRING | Functional category of the page, such as Product, Category, or Checkout. |

## Joins

- [Pageviews](./pageviews-e-commerce.md) — `page_id = page_id`
