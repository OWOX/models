---
title: "Abandoned Checkouts"
description: |
  Checkouts that a customer started and did not complete: recovery URL, completion time, line item quantity, total price, billing and shipping location, and the customer's name and email. `totalPriceSet` is the amount in the store currency, without a currency code.

  Use it for recovery campaigns and for the gap between started and completed checkouts. `customerId` points to Customers and may be empty when the checkout came from a draft order or an app.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/abandonedCheckoutsFields.js"
    title: "OWOX Data Marts Shopify connector — Abandoned Checkouts endpoint (`abandoned-checkouts`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/queries/abandonedcheckouts"
    title: "Shopify Admin GraphQL API reference — Abandoned Checkouts"
---

## Connector endpoint

- **Endpoint:** Shopify · `abandoned-checkouts`
- **Default destination table:** `shopify_abandoned_checkouts`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID for the abandoned checkout. |
| `abandonedCheckoutUrl` | STRING | Abandoned Checkout URL | The URL for the buyer to recover their checkout. |
| `completedAt` | TIMESTAMP | Completed At | The date and time when the checkout was completed. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the checkout was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the checkout was last updated. |
| `defaultCursor` | STRING | Default Cursor | A default cursor that returns the single next record, sorted ascending by ID. |
| `lineItemsQuantity` | INTEGER | Line Items Quantity | The total number of line items in the checkout. |
| `totalPriceSet` | STRING | Total Price Set | Total price of the checkout, taxes, discounts and shipping included, in the store currency; the amount only, as the connector does not keep the currency code it requests. |
| `billingAddressCity` | STRING | Billing Address City | City from the billing address. |
| `billingAddressCountry` | STRING | Billing Address Country | Country from the billing address. |
| `billingAddressProvince` | STRING | Billing Address Province | Province or state from the billing address. |
| `billingAddressZip` | STRING | Billing Address Zip | Postal/ZIP code from the billing address. |
| `shippingAddressCity` | STRING | Shipping Address City | City from the shipping address. |
| `shippingAddressCountry` | STRING | Shipping Address Country | Country from the shipping address. |
| `shippingAddressProvince` | STRING | Shipping Address Province | Province or state from the shipping address. |
| `shippingAddressZip` | STRING | Shipping Address Zip | Postal/ZIP code from the shipping address. |
| `customerId` | STRING | Customer ID | Customer globally-unique ID. FK to [Customers](./customers.md) |
| `customerFirstName` | STRING | Customer First Name | First name of the customer who started the checkout; empty when the checkout has no customer. |
| `customerLastName` | STRING | Customer Last Name | Last name of the customer who started the checkout; empty when the checkout has no customer. |
| `customerEmail` | STRING | Customer Email | Customer email address. |

# Example Questions

- How many checkouts were abandoned each week, and what was their total value?
- Which countries have the most abandoned checkouts?
- How many abandoned checkouts belong to `customers` who have ordered before?

## Joins

- [Customers](./customers.md) — `customerId = id` [N:1] — The customer who started the checkout; may be empty.
