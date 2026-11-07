---
title: "Credit memos"
description: |
  Credit given back to a customer, to be applied against invoices.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/creditmemo"
    title: "Intuit QuickBooks Online Accounting API reference — creditmemo"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `credit_memo`
- **Default destination table:** `quickbooks_credit_memo`
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | PK. Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP |  |
| `last_updated_time` | TIMESTAMP | Incremental cursor. |
| `doc_number` | STRING |  |
| `txn_date` | DATE | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT |  |
| `currency_id` | STRING |  |
| `currency_name` | STRING |  |
| `exchange_rate` | FLOAT |  |
| `private_note` | STRING |  |
| `line` | JSON | Line array kept as JSON. Unnest in SQL: DetailType decides which \*LineDetail object is present. |
| `remaining_credit` | FLOAT |  |
| `balance` | FLOAT |  |
| `customer_id` | STRING |  |
| `customer_name` | STRING |  |
| `class_id` | STRING |  |
| `class_name` | STRING |  |
| `department_id` | STRING |  |
| `department_name` | STRING |  |
| `total_tax` | FLOAT |  |
| `home_total_amt` | FLOAT |  |

# Example Questions

- How much revenue was credited back per customer and month?
- Which customers receive credit memos repeatedly?

## Joins

- [Customers](./customers.md) — `realm_id = realm_id`, `customer_id = id` [N:1] — The customer the document is for.
  - Description: The customer the document is for.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
