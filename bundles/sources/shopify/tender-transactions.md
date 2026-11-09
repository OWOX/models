---
title: "Tender Transactions"
description: |
  One row per tender transaction, an actual movement of money between buyer and shop: amount, currency, remote payment reference, whether it is a test transaction, the order it belongs to and the time it was processed. Shopify describes it as the record to use for reconciling payments.

  Orders is the table to join: `orderId` is empty when the order has been deleted.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Tender Transactions endpoint (`tender-transactions`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/TenderTransaction"
    title: "Shopify Admin GraphQL API reference — TenderTransaction"
---

## Connector endpoint

- **Endpoint:** Shopify · `tender-transactions`
- **Default destination table:** `shopify_tender_transactions`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `amount` | NUMERIC | Amount | The amount of the tender transaction. |
| `currencyCode` | STRING | CurrencyCode | The currency code. |
| `remoteReference` | STRING | RemoteReference | The remote gateway reference. |
| `test` | BOOLEAN | Test | Whether the transaction is a test transaction. |
| `orderId` | STRING | OrderId | The ID of the order. |
| `processedAt` | TIMESTAMP | ProcessedAt | The date and time when the transaction was processed. |

# Example Questions

- How much money moved per day, by currency, excluding test transactions?
- Which orders have no tender transaction?
- How many test transactions are mixed into the data?

## Joins

- [Orders](./orders.md) — `orderId = id` [N:1] — The order the payment belongs to; empty when the order was deleted.
  - Description: The order the payment belongs to; empty when the order was deleted.
