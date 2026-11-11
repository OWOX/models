---
title: "Shopify"
description: |
  What the OWOX Data Marts Shopify connector loads from a store through the Shopify Admin GraphQL API, and how the tables fit together. The commerce core is Orders, Customers, Products and Product Variants: an order points to its customer, a variant to its product and to its inventory item, and money movements (Tender Transactions) and shipments (Fulfillment Orders) point back to the order. Fulfillment Orders also point to the Locations they ship from. Abandoned Checkouts record the customers who started and did not finish an order.

  The store's content is Blogs, Articles and Pages. Ten metafield tables, one per owner type, hold the custom fields merchants and apps attach to blogs, articles, pages, products, variants, collections, customers, orders, locations and the shop; each points to its owner on `ownerId`.

  Every id is a Shopify global ID, a string such as `gid://shopify/Order/…`. Order detail without a column of its own (line items, shipping lines, refunds, discount applications) is kept as JSON text, to unnest in SQL. The money columns of Orders and Abandoned Checkouts are in the store currency.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`a3766e5bc`](https://github.com/OWOX/owox-data-marts/commit/a3766e5bc1053780a65b259d9515bedec3c9d782), on Shopify Admin GraphQL API 2026-07.
tags: ["owox", "index", "connector", "shopify"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify"
    title: "OWOX Data Marts — Shopify connector source"
    last_modified: 2026-10-07
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Ievgen Krasovytskyi](https://github.com/ikrasovytskyi)

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Abandoned Checkouts](./abandoned-checkouts.md) | 20 | 2026-08-07 | Checkouts that a customer started and did not complete: recovery URL, completion time, line item quantity, total price, billing and shipping location, and the customer's name and email. |
| [Article Metafields](./article-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to articles: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Articles](./articles.md) | 15 | 2026-08-07 | One row per blog article: title, handle, body, summary, author name, the blog it sits in (`blogId`, `blogTitle`), whether it is published, publication time, tags, template suffix, image URL and timestamps. |
| [Blog Metafields](./blog-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to blogs: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Blogs](./blogs.md) | 6 | 2026-08-07 | One row per blog of the online store: title, handle, template suffix, creation and update times. |
| [Collection Metafields](./collection-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to collections: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Collections](./collections.md) | 10 | 2026-08-07 | One row per collection: title, handle, description, sort order, template suffix, number of products, image URL and last update. |
| [Customer Metafields](./customer-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to customers: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Customers](./customers.md) | 22 | 2026-08-07 | One row per customer account: name, email, phone, account state, locale, marketing consent for email and SMS, number of orders, lifetime spend, tags and default address. |
| [Discount Codes](./discount-codes.md) | 12 | 2026-08-07 | One row per discount code: the code, discount type, title, status, start and end time, usage limit, whether it applies once per customer and the number of uses counted asynchronously. |
| [Fulfillment Orders](./fulfillment-orders.md) | 11 | 2026-08-07 | One row per fulfillment order, the instruction to ship part of an order from one location: status, request status, the order (`orderId`, `orderName`), the assigned location (`assignedLocationId`, `assignedLocationName`), fulfill-at time, delivery method and timestamps. |
| [Inventory Items](./inventory-items.md) | 9 | 2026-08-07 | One row per inventory item, the stock-keeping record behind a variant: SKU, whether stock is tracked, whether it requires shipping, harmonized system code and country of origin, with creation and update times. |
| [Location Metafields](./location-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to locations: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Locations](./locations.md) | 19 | 2026-08-07 | One row per location, physical or virtual: name, whether it is active, primary, a fulfillment service location, whether it fulfills online orders, holds active inventory or ships inventory, with address, phone and times. |
| [Order Metafields](./order-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to orders: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Orders](./orders.md) | 96 | 2026-10-07 | One row per order placed in the store: financial and fulfillment status, order totals (subtotal, tax, shipping, discounts, refunded), currency, customer contact fields, billing and shipping location, tags, source and the key timestamps. |
| [Page Metafields](./page-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to pages: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Pages](./pages.md) | 10 | 2026-08-07 | One row per static page of the online store: title, handle, body, body summary, publication status and time, template suffix and timestamps. |
| [Product Metafields](./product-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to products: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Product Variant Metafields](./product-variant-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to product variants: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Product Variants](./product-variants.md) | 18 | 2026-08-07 | One row per product variant, the sellable unit: title, SKU, barcode, price, compare-at price, position, inventory quantity and policy, tax settings and availability. |
| [Products](./products.md) | 21 | 2026-08-07 | One row per product in the catalog: title, handle, vendor, product type, status, tags, total inventory, number of variants, the lowest and highest variant price, SEO title and description, and publication and update times. |
| [Shop](./shop.md) | 20 | 2026-08-07 | One row for the store: name, email, domains, currency, time zone, weight unit, billing address, plan, whether taxes are included in prices, and creation and update times. |
| [Shop Metafields](./shop-metafields.md) | 9 | 2026-08-07 | One row per metafield attached to the shop: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. |
| [Tender Transactions](./tender-transactions.md) | 7 | 2026-08-07 | One row per tender transaction, an actual movement of money between buyer and shop: amount, currency, remote payment reference, whether it is a test transaction, the order it belongs to and the time it was processed. |

# Example Questions

- How do `orders`, refunds and discounts add up to net sales per month and per `customer`?
- Which `customers` placed repeat `orders`, and which started a checkout they never finished?
- Which `products` and variants sell, and what stock record and `location` stand behind them?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/shopify)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->
