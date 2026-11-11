---
title: "Sales receipts"
description: |
  Sales paid at the time of sale, without an invoice: customer, items, total and the account the money went to.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt"
    title: "Intuit QuickBooks Online API reference — Sales receipts"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `sales_receipt`
- **Default destination table:** `quickbooks_sales_receipt`
- **Unique keys:** `realm_id`, `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). |
| `realm_id` | STRING | Realm ID | PK. FK to [Company info](./company-info.md). Company (realm) id, stamped from the RealmId parameter. |
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
| `customer_id` | STRING | Customer ID | FK to [Customers](./customers.md). |
| `customer_name` | STRING | Customer Name | |
| `deposit_to_account_id` | STRING | Deposit To Account ID | FK to [Accounts](./accounts.md). |
| `deposit_to_account_name` | STRING | Deposit To Account Name | |
| `payment_method_id` | STRING | Payment Method ID | |
| `payment_method_name` | STRING | Payment Method Name | |
| `payment_ref_num` | STRING | Payment Ref Num | |
| `bill_email` | STRING | Bill Email | |
| `class_id` | STRING | Class ID | |
| `class_name` | STRING | Class Name | |
| `department_id` | STRING | Department ID | |
| `department_name` | STRING | Department Name | |
| `total_tax` | FLOAT | Total Tax | |
| `home_total_amt` | FLOAT | Home Total Amt | |

# Example Questions

- How much point-of-sale revenue arrived without an invoice, by month and payment method?
- Which items sell most through sales receipts versus invoices?

## Joins

- [Customers](./customers.md) — `customer_id = id`, `realm_id = realm_id` [N:1]
- [Accounts](./accounts.md) — `deposit_to_account_id = id`, `realm_id = realm_id` [N:1]
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
