---
title: "Abandoned Checkouts"
description: |
  Checkouts that a customer started and did not complete: recovery URL, completion time, line item quantity, total price, billing and shipping location, and the customer's name and email. `totalPriceSet` is a JSON string with the amount and currency.

  Use it for recovery campaigns and for the gap between started and completed checkouts. `customerId` points to Customers and may be empty when the checkout came from a draft order or an app.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Abandoned Checkouts endpoint (`abandoned-checkouts`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/queries/abandonedcheckouts"
    title: "Shopify Admin GraphQL API reference — abandonedcheckouts"
---

## Connector endpoint

- **Endpoint:** Shopify · `abandoned-checkouts`
- **Default destination table:** `shopify_abandoned_checkouts`
- **Unique keys:** `id`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. A globally-unique ID for the abandoned checkout. |
| `abandonedCheckoutUrl` | STRING | The URL for the buyer to recover their checkout. |
| `completedAt` | TIMESTAMP | The date and time when the checkout was completed. |
| `createdAt` | TIMESTAMP | The date and time when the checkout was created. |
| `updatedAt` | TIMESTAMP | The date and time when the checkout was last updated. |
| `defaultCursor` | STRING | A default cursor that returns the single next record, sorted ascending by ID. |
| `lineItemsQuantity` | INTEGER | The total number of line items in the checkout. |
| `totalPriceSet` | STRING | The total price of the checkout including taxes, discounts, and shipping (MoneyBag as JSON string). |
| `billingAddressCity` | STRING | City from the billing address. |
| `billingAddressCountry` | STRING | Country from the billing address. |
| `billingAddressProvince` | STRING | Province or state from the billing address. |
| `billingAddressZip` | STRING | Postal/ZIP code from the billing address. |
| `shippingAddressCity` | STRING | City from the shipping address. |
| `shippingAddressCountry` | STRING | Country from the shipping address. |
| `shippingAddressProvince` | STRING | Province or state from the shipping address. |
| `shippingAddressZip` | STRING | Postal/ZIP code from the shipping address. |
| `customerId` | STRING | Customer globally-unique ID. |
| `customerFirstName` | STRING | Customer first name. |
| `customerLastName` | STRING | Customer last name. |
| `customerEmail` | STRING | Customer email address. |

# Example Questions

- How many checkouts were abandoned each week, and what was their total value?
- Which countries have the most abandoned checkouts?
- How many abandoned checkouts belong to customers who have ordered before?

## Joins

- [Customers](./customers.md) — `customerId = id` [N:1] — The customer who started the checkout; may be empty.
  - Description: The customer who started the checkout; may be empty.
