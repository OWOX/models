---
title: "Inventory Items"
description: |
  One row per inventory item, the stock-keeping record behind a variant: SKU, whether stock is tracked, whether it requires shipping, harmonized system code and country of origin, with creation and update times. Stock quantities per location are not in this table.

  Product Variants point here on `inventoryItemId`; `variantId` here names the variant the item belongs to.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/inventoryItemsFields.js"
    title: "OWOX Data Marts Shopify connector — Inventory Items endpoint (`inventory-items`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/InventoryItem"
    title: "Shopify Admin GraphQL API reference — Inventory Items"
---

## Connector endpoint

- **Endpoint:** Shopify · `inventory-items`
- **Default destination table:** `shopify_inventory_items`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `sku` | STRING | SKU | The unique SKU (stock keeping unit) of the inventory item. |
| `tracked` | BOOLEAN | Tracked | Whether inventory levels are tracked for the item. |
| `requiresShipping` | BOOLEAN | Requires Shipping | Whether the item requires shipping. |
| `harmonizedSystemCode` | STRING | Harmonized System Code | The harmonized system code of the item. |
| `countryCodeOfOrigin` | STRING | Country Code Of Origin | The ISO 3166-1 alpha-2 country code of where the item originated from. |
| `variantId` | STRING | Variant ID | The ID of the variant associated with this inventory item. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the inventory item was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the inventory item was last updated. |

# Example Questions

- Which inventory items are not tracked, and which of them require shipping?
- Which countries of origin appear most often across inventory items?
- Which items have no harmonized system code?
