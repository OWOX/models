---
title: "Tender Transactions"
description: |
  One row per tender transaction, an actual movement of money between buyer and shop: amount, currency, remote payment reference, whether it is a test transaction, the order it belongs to and the time it was processed. Shopify describes it as the record to use for reconciling payments.

  Orders is the table to join: `orderId` is empty when the order has been deleted.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/tenderTransactionsFields.js"
    title: "OWOX Data Marts Shopify connector — Tender Transactions endpoint (`tender-transactions`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/TenderTransaction"
    title: "Shopify Admin GraphQL API reference — Tender Transactions"
---

## Connector endpoint

- **Endpoint:** Shopify · `tender-transactions`
- **Default destination table:** `shopify_tender_transactions`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `amount` | FLOAT | Amount | The amount of the tender transaction. |
| `currencyCode` | STRING | Currency Code | Three-letter code of the currency `amount` is in. |
| `remoteReference` | STRING | Remote Reference | The remote gateway reference. |
| `test` | BOOLEAN | Test | Whether the transaction is a test transaction. |
| `orderId` | STRING | Order ID | The ID of the order. FK to [Orders](./orders.md) |
| `processedAt` | TIMESTAMP | Processed At | The date and time when the transaction was processed. |

# Example Questions

- How much money moved per day, by currency, excluding test transactions?
- Which `orders` have no tender transaction?
- How many test transactions are mixed into the data?

## Joins

- [Orders](./orders.md) — `orderId = id` [N:1] — The order the payment belongs to; empty when the order was deleted.
  - [Order's Customer](./customers.md) — The customer on the order this transaction belongs to; empty when the order has no customer or was deleted.
