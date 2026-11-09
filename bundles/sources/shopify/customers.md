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

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `firstName` | STRING | FirstName | The customer first name. |
| `lastName` | STRING | LastName | The customer last name. |
| `displayName` | STRING | DisplayName | The full name of the customer. |
| `email` | STRING | Email | The customer email address. |
| `phone` | STRING | Phone | The customer phone number. |
| `state` | STRING | State | The state of the customer account. |
| `locale` | STRING | Locale | The customer locale. |
| `taxExempt` | BOOLEAN | TaxExempt | Whether the customer is exempt from being charged taxes. |
| `verifiedEmail` | BOOLEAN | VerifiedEmail | Whether the customer has verified their email. |
| `emailMarketingConsentState` | STRING | EmailMarketingConsentState | The current email marketing state for the customer. |
| `smsMarketingConsentState` | STRING | SmsMarketingConsentState | The current SMS marketing state for the customer. |
| `numberOfOrders` | INTEGER | NumberOfOrders | The number of orders associated with this customer. |
| `amountSpent` | STRING | AmountSpent | The total amount spent by the customer (JSON string with amount and currencyCode). |
| `tags` | STRING | Tags | A comma-separated list of tags associated with the customer. |
| `note` | STRING | Note | A note about the customer. |
| `defaultAddressCity` | STRING | DefaultAddressCity | City from the default address. |
| `defaultAddressCountry` | STRING | DefaultAddressCountry | Country from the default address. |
| `defaultAddressProvince` | STRING | DefaultAddressProvince | Province from the default address. |
| `defaultAddressZip` | STRING | DefaultAddressZip | Postal/ZIP code from the default address. |
| `createdAt` | TIMESTAMP | CreatedAt | The date and time when the customer was created. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the customer was last updated. |

# Example Questions

- How many customers placed one order, two orders, or more, and what did each group spend?
- Which countries do customers with email marketing consent live in?
- How many customers were created each month, and how many of them have ordered?
