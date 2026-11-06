---
title: "Discount Codes"
description: |
  One row per discount code: the code, discount type, title, status, start and end time, usage limit, whether it applies once per customer and the number of uses counted asynchronously. The codes customers actually used on an order are kept as JSON text in Orders (`discountCodes`).

  There is no key column to join this table to Orders; match on the `code` text inside the JSON.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Discount Codes endpoint (`discount-codes`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/DiscountCodeNode"
    title: "Shopify Admin GraphQL API reference — DiscountCodeNode"
---

## Connector endpoint

- **Endpoint:** Shopify · `discount-codes`
- **Default destination table:** `shopify_discount_codes`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. A globally-unique ID. |
| `code` | STRING | The discount code string. |
| `discountType` | STRING | The type of discount (DiscountCodeBasic, DiscountCodeBxgy, DiscountCodeFreeShipping). |
| `title` | STRING | The title of the discount. |
| `status` | STRING | The status of the discount. |
| `startsAt` | TIMESTAMP | The date and time when the discount becomes active. |
| `endsAt` | TIMESTAMP | The date and time when the discount expires. |
| `usageLimit` | INTEGER | The maximum number of times the discount can be used. |
| `appliesOncePerCustomer` | BOOLEAN | Whether the discount can only be used once per customer. |
| `asyncUsageCount` | INTEGER | The number of times the discount has been used. |
| `createdAt` | TIMESTAMP | The date and time when the discount was created. |
| `updatedAt` | TIMESTAMP | The date and time when the discount was last updated. |

# Example Questions

- Which discount codes are active now, and which expire this month?
- How many codes of each discount type exist?
- Which codes are close to their usage limit?
