---
title: "Pages"
description: |
  The catalog of pages that make up the storefront — path, display title, and the function
  each page serves (product, category, checkout and so on). It turns raw URL paths into
  something a business user can read, which is what makes funnel analysis by page type
  possible at all.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-05T19:03:12.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `page_id` | INTEGER | Page ID | PK. Unique numerical identifier for each specific page on the website. FK to [Pageviews](./pageviews.md) |
| `page_path` | STRING | Page Path | The URL path of the page relative to the domain root. |
| `page_title` | STRING | Page Title | The human-readable name or display title of the web page. |
| `page_type` | STRING | Page Type | Functional category of the page, such as Product, Category, or Checkout. |

# Example Questions

- Which landing pages bring in the most `sessions`, and which of them actually convert?
- Where in the checkout flow do shoppers drop off, page by page?
- How does engagement differ between `product` pages, `category` pages and content pages?

## Joins

- [Pageviews](./pageviews.md) — `page_id = page_id`
