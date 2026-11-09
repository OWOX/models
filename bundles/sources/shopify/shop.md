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

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `name` | STRING | Name | The name of the shop. |
| `email` | STRING | Email | The email address of the shop. |
| `myshopifyDomain` | STRING | MyshopifyDomain | The myshopify.com domain of the shop. |
| `primaryDomain` | STRING | PrimaryDomain | The primary domain of the shop. |
| `currencyCode` | STRING | CurrencyCode | The currency code of the shop. |
| `timezoneAbbreviation` | STRING | TimezoneAbbreviation | The timezone abbreviation. |
| `ianaTimezone` | STRING | IanaTimezone | The IANA timezone. |
| `weightUnit` | STRING | WeightUnit | The default weight unit. |
| `billingAddressCity` | STRING | BillingAddressCity | City from the billing address. |
| `billingAddressCountry` | STRING | BillingAddressCountry | Country from the billing address. |
| `billingAddressProvince` | STRING | BillingAddressProvince | Province from the billing address. |
| `billingAddressZip` | STRING | BillingAddressZip | Postal/ZIP code from the billing address. |
| `plan` | STRING | Plan | The shop plan name. |
| `contactEmail` | STRING | ContactEmail | The contact email of the shop. |
| `customerAccountsV2` | STRING | CustomerAccountsV2 | The customer accounts version. |
| `taxesIncluded` | BOOLEAN | TaxesIncluded | Whether taxes are included in prices. |
| `taxShipping` | BOOLEAN | TaxShipping | Whether shipping is taxed. |
| `createdAt` | TIMESTAMP | CreatedAt | The date and time when the shop was created. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the shop was last updated. |

# Example Questions

- Which currency, time zone and plan is the store set up with?
- Are taxes included in prices, and is shipping taxed?
- What is the store's primary domain and billing country?
