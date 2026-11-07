---
title: "Customers"
description: |
  One row per customer account: name, email, phone, account state, locale, marketing consent for email and SMS, number of orders, lifetime spend, tags and default address. `amountSpent` is a JSON string holding the amount and its currency code.

  Orders and Abandoned Checkouts point here on `customerId`. A guest checkout can have an order without a customer row, so a join from Orders to Customers is a left join.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Customers endpoint (`customers`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Customer"
    title: "Shopify Admin GraphQL API reference — Customer"
---

## Connector endpoint

- **Endpoint:** Shopify · `customers`
- **Default destination table:** `shopify_customers`
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. A globally-unique ID. |
| `firstName` | STRING | The customer first name. |
| `lastName` | STRING | The customer last name. |
| `displayName` | STRING | The full name of the customer. |
| `email` | STRING | The customer email address. |
| `phone` | STRING | The customer phone number. |
| `state` | STRING | The state of the customer account. |
| `locale` | STRING | The customer locale. |
| `taxExempt` | BOOLEAN | Whether the customer is exempt from being charged taxes. |
| `verifiedEmail` | BOOLEAN | Whether the customer has verified their email. |
| `emailMarketingConsentState` | STRING | The current email marketing state for the customer. |
| `smsMarketingConsentState` | STRING | The current SMS marketing state for the customer. |
| `numberOfOrders` | INTEGER | The number of orders associated with this customer. |
| `amountSpent` | STRING | The total amount spent by the customer (JSON string with amount and currencyCode). |
| `tags` | STRING | A comma-separated list of tags associated with the customer. |
| `note` | STRING | A note about the customer. |
| `defaultAddressCity` | STRING | City from the default address. |
| `defaultAddressCountry` | STRING | Country from the default address. |
| `defaultAddressProvince` | STRING | Province from the default address. |
| `defaultAddressZip` | STRING | Postal/ZIP code from the default address. |
| `createdAt` | TIMESTAMP | The date and time when the customer was created. |
| `updatedAt` | TIMESTAMP | The date and time when the customer was last updated. |

# Example Questions

- How many customers placed one order, two orders, or more, and what did each group spend?
- Which countries do customers with email marketing consent live in?
- How many customers were created each month, and how many of them have ordered?
