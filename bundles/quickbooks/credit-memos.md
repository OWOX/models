---
title: "Credit memos"
description: |
  Credit given back to a customer, to be applied against invoices.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/creditmemo"
    title: "Intuit QuickBooks Online API reference — Credit memos"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `credit_memo`
- **Default destination table:** `quickbooks_credit_memo`
- **Unique keys:** `realm_id`, `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Unique with `realm_id`. QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | Realm ID | FK to [Company info](./company-info.md). Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `doc_number` | STRING | Doc Number | |
| `txn_date` | DATE | Txn Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amt | |
| `currency_id` | STRING | Currency ID | |
| `currency_name` | STRING | Currency Name | |
| `exchange_rate` | FLOAT | Exchange Rate | |
| `private_note` | STRING | Private Note | |
| `line` | JSON | Line | Line array kept as JSON. Unnest in SQL: DetailType decides which *LineDetail object is present. |
| `remaining_credit` | FLOAT | Remaining Credit | |
| `balance` | FLOAT | Balance | |
| `customer_id` | STRING | Customer ID | FK to [Customers](./customers.md).  |
| `customer_name` | STRING | Customer Name | |
| `class_id` | STRING | Class ID | |
| `class_name` | STRING | Class Name | |
| `department_id` | STRING | Department ID | |
| `department_name` | STRING | Department Name | |
| `total_tax` | FLOAT | Total Tax | |
| `home_total_amt` | FLOAT | Home Total Amt | |

# Example Questions

- How much revenue was credited back per customer and month, and against which invoices?
- Which customers receive credit memos repeatedly?

## Joins

- [Customers](./customers.md) — `customer_id = id` [N:1]
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
