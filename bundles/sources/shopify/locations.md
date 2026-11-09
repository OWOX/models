---
title: "Locations"
description: |
  One row per location, physical or virtual: name, whether it is active, primary, a fulfillment service location, whether it fulfills online orders, holds active inventory or ships inventory, with address, phone and times.

  Fulfillment Orders point here on `assignedLocationId`, and Location Metafields on the location `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Locations endpoint (`locations`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Location"
    title: "Shopify Admin GraphQL API reference — Location"
---

## Connector endpoint

- **Endpoint:** Shopify · `locations`
- **Default destination table:** `shopify_locations`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `name` | STRING | Name | The name of the location. |
| `isActive` | BOOLEAN | IsActive | Whether the location is active. |
| `isPrimary` | BOOLEAN | IsPrimary | Whether the location is the primary location. |
| `isFulfillmentService` | BOOLEAN | IsFulfillmentService | Whether the location is a fulfillment service location. |
| `fulfillsOnlineOrders` | BOOLEAN | FulfillsOnlineOrders | Whether the location can fulfill online orders. |
| `hasActiveInventory` | BOOLEAN | HasActiveInventory | Whether the location has active inventory. |
| `shipsInventory` | BOOLEAN | ShipsInventory | Whether the location ships inventory. |
| `addressLine1` | STRING | AddressLine1 | The first line of the address. |
| `addressLine2` | STRING | AddressLine2 | The second line of the address. |
| `city` | STRING | City | The city of the location. |
| `province` | STRING | Province | The province or state of the location. |
| `provinceCode` | STRING | ProvinceCode | The province or state code. |
| `country` | STRING | Country | The country of the location. |
| `countryCode` | STRING | CountryCode | The country code of the location. |
| `zip` | STRING | Zip | The postal or ZIP code. |
| `phone` | STRING | Phone | The phone number of the location. |
| `createdAt` | TIMESTAMP | CreatedAt | The date and time when the location was created. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the location was last updated. |

# Example Questions

- Which locations are active and fulfill online orders?
- Which locations hold active inventory but do not ship it?
- How many locations are there per country?
