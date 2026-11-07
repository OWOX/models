---
title: "Product Variants"
description: |
  One row per product variant, the sellable unit: title, SKU, barcode, price, compare-at price, position, inventory quantity and policy, tax settings and availability. It names its product (`productId`, `productTitle`) and its inventory item (`inventoryItemId`).

  Use it to move from a product to its SKUs and prices, and from a SKU to its stock record in Inventory Items.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Product Variants endpoint (`product-variants`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/ProductVariant"
    title: "Shopify Admin GraphQL API reference — ProductVariant"
---

## Connector endpoint

- **Endpoint:** Shopify · `product-variants`
- **Default destination table:** `shopify_product_variants`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. A globally-unique ID. |
| `title` | STRING | The title of the variant. |
| `displayName` | STRING | The display name of the variant. |
| `sku` | STRING | The SKU of the variant. |
| `barcode` | STRING | The barcode of the variant. |
| `price` | NUMERIC | The price of the variant. |
| `compareAtPrice` | NUMERIC | The compare at price of the variant. |
| `position` | INTEGER | The position of the variant in the list. |
| `inventoryQuantity` | INTEGER | The total inventory quantity. |
| `inventoryPolicy` | STRING | The inventory policy. |
| `inventoryItemId` | STRING | The ID of the inventory item. |
| `productId` | STRING | The ID of the product. |
| `productTitle` | STRING | The title of the product. |
| `taxable` | BOOLEAN | Whether the variant is taxable. |
| `taxCode` | STRING | The tax code. |
| `availableForSale` | BOOLEAN | Whether the variant is available for sale. |
| `createdAt` | TIMESTAMP | The date and time when the variant was created. |
| `updatedAt` | TIMESTAMP | The date and time when the variant was last updated. |

# Example Questions

- How many variants does each product have, and what is the price spread inside a product?
- Which variants are available for sale but have zero inventory quantity?
- Which variants are priced below their compare-at price, and by how much?

## Joins

- [Products](./products.md) — `productId = id` [N:1] — The product the variant belongs to.
  - Description: The product the variant belongs to.
- [Inventory Items](./inventory-items.md) — `inventoryItemId = id` [1:1] — The stock record behind the variant. Each variant has one inventory item, so the join does not repeat rows.
  - Description: The stock record behind the variant. Each variant has one inventory item, so the join does not repeat rows.
