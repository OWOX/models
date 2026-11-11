---
title: "Product Variants"
description: |
  One row per product variant, the sellable unit: title, SKU, barcode, price, compare-at price, position, inventory quantity and policy, tax settings and availability. It names its product (`productId`, `productTitle`) and its inventory item (`inventoryItemId`).

  Use it to move from a product to its SKUs and prices, and from a SKU to its stock record in Inventory Items.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/productVariantsFields.js"
    title: "OWOX Data Marts Shopify connector — Product Variants endpoint (`product-variants`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/ProductVariant"
    title: "Shopify Admin GraphQL API reference — Product Variants"
---

## Connector endpoint

- **Endpoint:** Shopify · `product-variants`
- **Default destination table:** `shopify_product_variants`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `title` | STRING | Title | The title of the variant. |
| `displayName` | STRING | Display Name | The display name of the variant. |
| `sku` | STRING | SKU | The SKU of the variant. |
| `barcode` | STRING | Barcode | The barcode of the variant. |
| `price` | FLOAT | Price | The price of the variant. |
| `compareAtPrice` | FLOAT | Compare At Price | The compare at price of the variant. |
| `position` | INTEGER | Position | The position of the variant in the list. |
| `inventoryQuantity` | INTEGER | Inventory Quantity | The total quantity of the variant that can be sold; stock per location is not in any table here. |
| `inventoryPolicy` | STRING | Inventory Policy | Whether customers can buy the variant once it is out of stock: `CONTINUE` lets them, `DENY` does not. |
| `inventoryItemId` | STRING | Inventory Item ID | The ID of the inventory item. FK to [Inventory Items](./inventory-items.md) |
| `productId` | STRING | Product ID | The ID of the product. FK to [Products](./products.md) |
| `productTitle` | STRING | Product Title | The title of the product. |
| `taxable` | BOOLEAN | Taxable | Whether the variant is taxable. |
| `taxCode` | STRING | Tax Code | A tax code for the variant; Shopify marks the field deprecated and does not define it. |
| `availableForSale` | BOOLEAN | Available For Sale | Whether the variant is available for sale. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the variant was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the variant was last updated. |

# Example Questions

- How many variants does each `product` have, and what is the price spread inside a product?
- Which variants are available for sale but have zero inventory quantity?
- Which variants are priced below their compare-at price, and by how much?

## Joins

- [Products](./products.md) — `productId = id` [N:1] — The product the variant belongs to.
- [Inventory Items](./inventory-items.md) — `inventoryItemId = id` [1:1] — The stock record behind the variant.
