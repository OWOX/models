---
title: "Order Metafields"
description: |
  One row per metafield attached to orders: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. A metafield is a custom field a merchant or app adds to a Shopify resource; its value is stored as text whatever its type.

  `ownerId` is the `id` of the row in Orders that the metafield belongs to. The connector reads the first 250 metafields per owner.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Order Metafields endpoint (`metafield-orders`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Metafield"
    title: "Shopify Admin GraphQL API reference — Metafield"
---

## Connector endpoint

- **Endpoint:** Shopify · `metafield-orders`
- **Default destination table:** `shopify_metafield_orders`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. A globally-unique ID. |
| `namespace` | STRING | The namespace of the metafield. |
| `key` | STRING | The key of the metafield. |
| `value` | STRING | The value of the metafield. |
| `type` | STRING | The type of the metafield. |
| `ownerId` | STRING | The ID of the owner resource. |
| `ownerType` | STRING | The type of the owner resource. |
| `createdAt` | TIMESTAMP | The date and time when the metafield was created. |
| `updatedAt` | TIMESTAMP | The date and time when the metafield was last updated. |

# Example Questions

- Which metafield namespaces and keys exist on orders, and how many rows does each have?
- Which orders have a given metafield set, and to what value?

## Joins

- [Orders](./orders.md) — `ownerId = id` [N:1] — The row in Orders that the metafield is attached to.
  - Description: The row in Orders that the metafield is attached to.
