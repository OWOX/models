---
title: "Shop"
description: |
  One row for the store: name, email, domains, currency, time zone, weight unit, billing address, plan, whether taxes are included in prices, and creation and update times. It is where to read the store currency and time zone.

  Shop Metafields point here on the shop `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Shop endpoint (`shop`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Shop"
    title: "Shopify Admin GraphQL API reference — Shop"
---

## Connector endpoint

- **Endpoint:** Shopify · `shop`
- **Default destination table:** `shopify_shop`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. A globally-unique ID. |
| `name` | STRING | The name of the shop. |
| `email` | STRING | The email address of the shop. |
| `myshopifyDomain` | STRING | The myshopify.com domain of the shop. |
| `primaryDomain` | STRING | The primary domain of the shop. |
| `currencyCode` | STRING | The currency code of the shop. |
| `timezoneAbbreviation` | STRING | The timezone abbreviation. |
| `ianaTimezone` | STRING | The IANA timezone. |
| `weightUnit` | STRING | The default weight unit. |
| `billingAddressCity` | STRING | City from the billing address. |
| `billingAddressCountry` | STRING | Country from the billing address. |
| `billingAddressProvince` | STRING | Province from the billing address. |
| `billingAddressZip` | STRING | Postal/ZIP code from the billing address. |
| `plan` | STRING | The shop plan name. |
| `contactEmail` | STRING | The contact email of the shop. |
| `customerAccountsV2` | STRING | The customer accounts version. |
| `taxesIncluded` | BOOLEAN | Whether taxes are included in prices. |
| `taxShipping` | BOOLEAN | Whether shipping is taxed. |
| `createdAt` | TIMESTAMP | The date and time when the shop was created. |
| `updatedAt` | TIMESTAMP | The date and time when the shop was last updated. |

# Example Questions

- Which currency, time zone and plan is the store set up with?
- Are taxes included in prices, and is shipping taxed?
- What is the store's primary domain and billing country?
