---
title: "Locations"
description: |
  One row per location, physical or virtual: name, whether it is active, primary, a fulfillment service location, whether it fulfills online orders, holds active inventory or ships inventory, with address, phone and times.

  Fulfillment Orders point here on `assignedLocationId`, and Location Metafields on the location `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/locationsFields.js"
    title: "OWOX Data Marts Shopify connector — Locations endpoint (`locations`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Location"
    title: "Shopify Admin GraphQL API reference — Locations"
---

## Connector endpoint

- **Endpoint:** Shopify · `locations`
- **Default destination table:** `shopify_locations`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `name` | STRING | Name | The name of the location. |
| `isActive` | BOOLEAN | Is Active | Whether the location is active. |
| `isPrimary` | BOOLEAN | Is Primary | Whether the location is the primary location. |
| `isFulfillmentService` | BOOLEAN | Is Fulfillment Service | Whether the location is a fulfillment service location. |
| `fulfillsOnlineOrders` | BOOLEAN | Fulfills Online Orders | Whether the location can fulfill online orders. |
| `hasActiveInventory` | BOOLEAN | Has Active Inventory | Whether the location has active inventory. |
| `shipsInventory` | BOOLEAN | Ships Inventory | Whether the location ships inventory. |
| `addressLine1` | STRING | Address Line 1 | The first line of the address. |
| `addressLine2` | STRING | Address Line 2 | The second line of the address. |
| `city` | STRING | City | The city of the location. |
| `province` | STRING | Province | The province or state of the location. |
| `provinceCode` | STRING | Province Code | The province or state code. |
| `country` | STRING | Country | The country of the location. |
| `countryCode` | STRING | Country Code | The country code of the location. |
| `zip` | STRING | Zip | The postal or ZIP code. |
| `phone` | STRING | Phone | The phone number of the location. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the location was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the location was last updated. |

# Example Questions

- Which locations are active and fulfill online `orders`?
- Which locations hold active inventory but do not ship it?
- How many locations are there per country?
