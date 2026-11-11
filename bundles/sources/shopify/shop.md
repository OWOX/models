---
title: "Shop"
description: |
  One row for the store: name, email, domains, currency, time zone, weight unit, billing address, plan, whether taxes are included in prices, and creation and update times. It is where to read the store currency and time zone.

  Shop Metafields point here on the shop `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/shopFields.js"
    title: "OWOX Data Marts Shopify connector — Shop endpoint (`shop`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Shop"
    title: "Shopify Admin GraphQL API reference — Shop"
---

## Connector endpoint

- **Endpoint:** Shopify · `shop`
- **Default destination table:** `shopify_shop`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `name` | STRING | Name | The name of the shop. |
| `email` | STRING | Email | The email address of the shop. |
| `myshopifyDomain` | STRING | Myshopify Domain | The myshopify.com domain of the shop. |
| `primaryDomain` | STRING | Primary Domain | The primary domain of the shop. |
| `currencyCode` | STRING | Currency Code | Three-letter code of the currency the store sells in now; each order keeps the store currency of its own day in its `currencyCode`. |
| `timezoneAbbreviation` | STRING | Timezone Abbreviation | Short abbreviation of the store's time zone; `ianaTimezone` holds its full IANA name. |
| `ianaTimezone` | STRING | IANA Timezone | The store's time zone as an IANA name; use it to read timestamps as the store's local days. |
| `weightUnit` | STRING | Weight Unit | The default weight unit. |
| `billingAddressCity` | STRING | Billing Address City | City from the billing address. |
| `billingAddressCountry` | STRING | Billing Address Country | Country from the billing address. |
| `billingAddressProvince` | STRING | Billing Address Province | Province from the billing address. |
| `billingAddressZip` | STRING | Billing Address Zip | Postal/ZIP code from the billing address. |
| `plan` | STRING | Plan | The shop plan name. |
| `contactEmail` | STRING | Contact Email | The contact email of the shop. |
| `customerAccountsV2` | STRING | Login Required at Checkout | Whether customers must log in to their account before checkout (Shopify `customerAccountsV2.loginRequiredAtCheckout`), as `true` or `false` text; despite the name, it is not an accounts version. |
| `taxesIncluded` | BOOLEAN | Taxes Included | Whether taxes are included in prices. |
| `taxShipping` | BOOLEAN | Tax Shipping | Whether shipping is taxed. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the shop was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the shop was last updated. |

# Example Questions

- Which currency, time zone and plan is the store set up with?
- Are taxes included in prices, and is shipping taxed?
- What is the store's primary domain and billing country?
