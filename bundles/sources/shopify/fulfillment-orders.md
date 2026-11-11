---
title: "Fulfillment Orders"
description: |
  One row per fulfillment order, the instruction to ship part of an order from one location: status, request status, the order (`orderId`, `orderName`), the assigned location (`assignedLocationId`, `assignedLocationName`), fulfill-at time, delivery method and timestamps. One order can have several fulfillment orders when it ships from several places.

  Use it to follow an order from placement to shipment.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/fulfillmentOrdersFields.js"
    title: "OWOX Data Marts Shopify connector — Fulfillment Orders endpoint (`fulfillment-orders`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/FulfillmentOrder"
    title: "Shopify Admin GraphQL API reference — Fulfillment Orders"
---

## Connector endpoint

- **Endpoint:** Shopify · `fulfillment-orders`
- **Default destination table:** `shopify_fulfillment_orders`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `status` | STRING | Status | The status of the fulfillment order. |
| `requestStatus` | STRING | Request Status | The request status of the fulfillment order. |
| `orderId` | STRING | Order ID | The ID of the order associated with this fulfillment order. FK to [Orders](./orders.md) |
| `orderName` | STRING | Order Name | The name of the order. |
| `assignedLocationId` | STRING | Assigned Location ID | The ID of the location assigned to fulfill this order. FK to [Locations](./locations.md) |
| `assignedLocationName` | STRING | Assigned Location Name | The name of the assigned location. |
| `fulfillAt` | TIMESTAMP | Fulfill At | The date and time at which the fulfillment order will be ready to be fulfilled. |
| `deliveryMethod` | STRING | Delivery Method | The delivery method of the fulfillment order. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the fulfillment order was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the fulfillment order was last updated. |

# Example Questions

- How many fulfillment `orders` are open, in progress or closed, and which `locations` hold the open ones?
- How long do fulfillment `orders` take from creation to closing, per `location`?
- Which `orders` were split into more than one fulfillment order?

## Joins

- [Orders](./orders.md) — `orderId = id` [N:1] — The order being fulfilled.
  - [Order's Customer](./customers.md) — The customer who placed the order being fulfilled; empty when the order has none.
- [Locations](./locations.md) — `assignedLocationId = id` [N:1] — The location the shipment is assigned to.
