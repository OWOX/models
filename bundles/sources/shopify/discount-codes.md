---
title: "Discount Codes"
description: |
  One row per discount code: the code, discount type, title, status, start and end time, usage limit, whether it applies once per customer and the number of uses counted asynchronously. The codes customers actually used on an order are listed in Orders as comma-separated text (`discountCodes`).

  There is no key column to join this table to Orders; match `code` against the codes in that text. A discount with several codes shows only its first one here.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/discountCodesFields.js"
    title: "OWOX Data Marts Shopify connector — Discount Codes endpoint (`discount-codes`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/DiscountCodeNode"
    title: "Shopify Admin GraphQL API reference — Discount Codes"
---

## Connector endpoint

- **Endpoint:** Shopify · `discount-codes`
- **Default destination table:** `shopify_discount_codes`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `code` | STRING | Code | The discount's first code; a discount that has several codes shows only one of them here. |
| `discountType` | STRING | Discount Type | The type of discount (DiscountCodeBasic, DiscountCodeBxgy, DiscountCodeFreeShipping). |
| `title` | STRING | Title | The title of the discount. |
| `status` | STRING | Status | The status of the discount. |
| `startsAt` | TIMESTAMP | Starts At | The date and time when the discount becomes active. |
| `endsAt` | TIMESTAMP | Ends At | The date and time when the discount expires. |
| `usageLimit` | INTEGER | Usage Limit | The maximum number of times the discount can be redeemed; empty when usage is unlimited. |
| `appliesOncePerCustomer` | BOOLEAN | Applies Once Per Customer | True when each customer can use the discount only once; empty, not false, otherwise. |
| `asyncUsageCount` | INTEGER | Async Usage Count | The number of times the discount has been used, updated asynchronously so it can lag behind; empty, not 0, for a discount never used. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the discount was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the discount was last updated. |

# Example Questions

- Which discount codes are active now, and which expire this month?
- How many codes of each discount type exist?
- Which codes are close to their usage limit?
