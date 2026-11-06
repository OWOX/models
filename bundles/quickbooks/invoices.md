---
title: "Invoices"
description: |
  Sales on credit: one row per invoice with customer, dates, total, open balance and the line items as JSON. The receivable side of the business.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice"
    title: "Intuit QuickBooks Online API reference — Invoices"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `invoice`
- **Default destination table:** `quickbooks_invoice`
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
| `due_date` | DATE | Due Date | |
| `balance` | FLOAT | Balance | Unpaid remainder; 0 when fully paid. |
| `customer_id` | STRING | Customer ID | FK to [Customers](./customers.md). |
| `customer_name` | STRING | Customer Name | |
| `customer_memo` | STRING | Customer Memo | |
| `bill_email` | STRING | Bill Email | |
| `email_status` | STRING | Email Status | |
| `print_status` | STRING | Print Status | |
| `sales_term_id` | STRING | Sales Term ID | |
| `sales_term_name` | STRING | Sales Term Name | |
| `deposit_to_account_id` | STRING | Deposit To Account ID | FK to [Accounts](./accounts.md). |
| `deposit_to_account_name` | STRING | Deposit To Account Name | |
| `class_id` | STRING | Class ID | |
| `class_name` | STRING | Class Name | |
| `department_id` | STRING | Department ID | |
| `department_name` | STRING | Department Name | |
| `ship_date` | DATE | Ship Date | |
| `tracking_num` | STRING | Tracking Num | |
| `total_tax` | FLOAT | Total Tax | |
| `txn_tax_detail` | JSON | Txn Tax Detail | |
| `linked_txn` | JSON | Linked Txn | Header-level links (payments, estimates) as JSON: TxnId, TxnType. |
| `home_total_amt` | FLOAT | Home Total Amt | |
| `home_balance` | FLOAT | Home Balance | |

# Example Questions

- How much was invoiced per month, per customer and per sales term?
- Which invoices are overdue, by how many days, and what balance is open on each?
- How long do customers take to pay, from `txn_date` to the linked payment?

## Joins

- [Customers](./customers.md) — `customer_id = id` [N:1]
- [Accounts](./accounts.md) — `deposit_to_account_id = id` [N:1] — Set only when the invoice carries a deposit.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
