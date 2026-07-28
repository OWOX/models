---
title: "Pages"
description: |
  The catalog of pages that make up the storefront — path, display title, and the function each
  page serves. It turns raw URL paths into something a business user can read, which is what
  makes funnel analysis by page type possible at all.

  The subscription portal is a page type of its own, next to product, cart and checkout. That is
  deliberate: the pages where subscribers skip, swap or cancel are as load-bearing for a
  recurring business as the checkout is for a one-time one.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-28T16:51:52.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `page_id` | STRING | PK. Unique identifier of the page. |
| `page_path` | STRING | URL path of the page relative to the domain root. |
| `page_title` | STRING | Human-readable title of the page. |
| `page_type` | STRING | Function the page serves, such as Home, Category, Product, Cart, Checkout, Subscription Portal, Blog or Account. |
| `host_name` | STRING | Domain the page is served from. |

# Example Questions

- Which landing pages bring in the most `sessions`, and which of them produce `subscriptions`?
- Where in the checkout flow do shoppers drop off, page by page?
- How much traffic do the `subscription` management pages take, and what happens to those subscribers next?
