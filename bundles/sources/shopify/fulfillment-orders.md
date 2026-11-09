---
title: "Fulfillment Orders"
description: |
  One row per fulfillment order, the instruction to ship part of an order from one location: status, request status, the order (`orderId`, `orderName`), the assigned location (`assignedLocationId`, `assignedLocationName`), fulfill-at time, delivery method and timestamps. One order can have several fulfillment orders when it ships from several places.

  Use it to follow an order from placement to shipment.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Fulfillment Orders endpoint (`fulfillment-orders`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/FulfillmentOrder"
    title: "Shopify Admin GraphQL API reference — FulfillmentOrder"
---

## Connector endpoint

- **Endpoint:** Shopify · `fulfillment-orders`
- **Default destination table:** `shopify_fulfillment_orders`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `status` | STRING | Status | The status of the fulfillment order. |
| `requestStatus` | STRING | RequestStatus | The request status of the fulfillment order. |
| `orderId` | STRING | OrderId | The ID of the order associated with this fulfillment order. |
| `orderName` | STRING | OrderName | The name of the order. |
| `assignedLocationId` | STRING | AssignedLocationId | The ID of the location assigned to fulfill this order. |
| `assignedLocationName` | STRING | AssignedLocationName | The name of the assigned location. |
| `fulfillAt` | TIMESTAMP | FulfillAt | The date and time at which the fulfillment order will be ready to be fulfilled. |
| `deliveryMethod` | STRING | DeliveryMethod | The delivery method of the fulfillment order. |
| `createdAt` | TIMESTAMP | CreatedAt | The date and time when the fulfillment order was created. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the fulfillment order was last updated. |

# Example Questions

- How many fulfillment orders are open, in progress or closed, and which locations hold the open ones?
- How long do fulfillment orders take from creation to closing, per location?
- Which orders were split into more than one fulfillment order?

## Joins

- [Orders](./orders.md) — `orderId = id` [N:1] — The order being fulfilled.
  - Description: The order being fulfilled.
- [Locations](./locations.md) — `assignedLocationId = id` [N:1] — The location the shipment is assigned to.
  - Description: The location the shipment is assigned to.
