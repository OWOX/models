---
title: "Inventory Items"
description: |
  One row per inventory item, the stock-keeping record behind a variant: SKU, whether stock is tracked, whether it requires shipping, harmonized system code and country of origin, with creation and update times. Stock quantities per location are not in this table.

  Product Variants point here on `inventoryItemId`; `variantId` here names the variant the item belongs to.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Inventory Items endpoint (`inventory-items`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/InventoryItem"
    title: "Shopify Admin GraphQL API reference — InventoryItem"
---

## Connector endpoint

- **Endpoint:** Shopify · `inventory-items`
- **Default destination table:** `shopify_inventory_items`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `sku` | STRING | SKU | The unique SKU (stock keeping unit) of the inventory item. |
| `tracked` | BOOLEAN | Tracked | Whether inventory levels are tracked for the item. |
| `requiresShipping` | BOOLEAN | RequiresShipping | Whether the item requires shipping. |
| `harmonizedSystemCode` | STRING | HarmonizedSystemCode | The harmonized system code of the item. |
| `countryCodeOfOrigin` | STRING | CountryCodeOfOrigin | The ISO 3166-1 alpha-2 country code of where the item originated from. |
| `variantId` | STRING | VariantId | The ID of the variant associated with this inventory item. |
| `createdAt` | TIMESTAMP | CreatedAt | The date and time when the inventory item was created. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the inventory item was last updated. |

# Example Questions

- Which inventory items are not tracked, and which of them require shipping?
- Which countries of origin appear most often across inventory items?
- Which items have no harmonized system code?
