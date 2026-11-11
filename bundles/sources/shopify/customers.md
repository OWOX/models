---
title: "Customers"
description: |
  One row per customer account: name, email, phone, account state, locale, marketing consent for email and SMS, number of orders, lifetime spend, tags and default address. `amountSpent` holds the amount only, without its currency code.

  Orders and Abandoned Checkouts point here on `customerId`. An order can have no customer, so a join from Orders to Customers is a left join.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/customersFields.js"
    title: "OWOX Data Marts Shopify connector — Customers endpoint (`customers`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Customer"
    title: "Shopify Admin GraphQL API reference — Customers"
---

## Connector endpoint

- **Endpoint:** Shopify · `customers`
- **Default destination table:** `shopify_customers`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `firstName` | STRING | First Name | The customer first name. |
| `lastName` | STRING | Last Name | The customer last name. |
| `displayName` | STRING | Display Name | The full name of the customer. |
| `email` | STRING | Email | The customer email address. |
| `phone` | STRING | Phone | The customer phone number. |
| `state` | STRING | State | The state of the customer account. |
| `locale` | STRING | Locale | The customer locale. |
| `taxExempt` | BOOLEAN | Tax Exempt | Whether the customer is exempt from being charged taxes. |
| `verifiedEmail` | BOOLEAN | Verified Email | Whether the customer has verified their email. |
| `emailMarketingConsentState` | STRING | Email Marketing Consent State | The current email marketing state for the customer. |
| `smsMarketingConsentState` | STRING | SMS Marketing Consent State | The current SMS marketing state for the customer. |
| `numberOfOrders` | INTEGER | Number Of Orders | The number of orders associated with this customer. |
| `amountSpent` | STRING | Amount Spent | The total the customer has spent across their orders, as the amount only: the connector requests the currency code with it but does not keep it. |
| `tags` | STRING | Tags | A comma-separated list of tags associated with the customer. |
| `note` | STRING | Note | A note about the customer. |
| `defaultAddressCity` | STRING | Default Address City | City from the default address. |
| `defaultAddressCountry` | STRING | Default Address Country | Country from the default address. |
| `defaultAddressProvince` | STRING | Default Address Province | Province from the default address. |
| `defaultAddressZip` | STRING | Default Address Zip | Postal/ZIP code from the default address. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the customer was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the customer was last updated. |

# Example Questions

- How many customers placed one `order`, two orders, or more, and what did each group spend?
- Which countries do customers with email marketing consent live in?
- How many customers were created each month, and how many of them have ordered?
