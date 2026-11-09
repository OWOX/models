---
title: "Product Metafields"
description: |
  One row per metafield attached to products: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. A metafield is a custom field a merchant or app adds to a Shopify resource; its value is stored as text whatever its type.

  `ownerId` is the `id` of the row in Products that the metafield belongs to. The connector reads the first 250 metafields per owner.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Product Metafields endpoint (`metafield-products`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Metafield"
    title: "Shopify Admin GraphQL API reference — Metafield"
---

## Connector endpoint

- **Endpoint:** Shopify · `metafield-products`
- **Default destination table:** `shopify_metafield_products`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `namespace` | STRING | Namespace | The namespace of the metafield. |
| `key` | STRING | Key | The key of the metafield. |
| `value` | STRING | Value | The value of the metafield. |
| `type` | STRING | Type | The type of the metafield. |
| `ownerId` | STRING | OwnerId | The ID of the owner resource. |
| `ownerType` | STRING | OwnerType | The type of the owner resource. |
| `createdAt` | TIMESTAMP | CreatedAt | The date and time when the metafield was created. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the metafield was last updated. |

# Example Questions

- Which metafield namespaces and keys exist on products, and how many rows does each have?
- Which products have a given metafield set, and to what value?

## Joins

- [Products](./products.md) — `ownerId = id` [N:1] — The row in Products that the metafield is attached to.
  - Description: The row in Products that the metafield is attached to.
