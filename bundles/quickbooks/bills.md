---
title: "Bills"
description: |
  What the company owes vendors: one row per bill with vendor, dates, total, open balance and expense or item lines as JSON. The payable side of the business.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill"
    title: "Intuit QuickBooks Online API reference — Bills"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `bill`
- **Default destination table:** `quickbooks_bill`
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
| `line` | JSON | Line | Line[] as JSON; DetailType is AccountBasedExpenseLineDetail (AccountRef) or ItemBasedExpenseLineDetail (ItemRef). |
| `due_date` | DATE | Due Date | |
| `balance` | FLOAT | Balance | |
| `vendor_id` | STRING | Vendor ID | FK to [Vendors](./vendors.md). |
| `vendor_name` | STRING | Vendor Name | |
| `ap_account_id` | STRING | AP Account ID | FK to [Accounts](./accounts.md). |
| `ap_account_name` | STRING | AP Account Name | |
| `sales_term_id` | STRING | Sales Term ID | |
| `sales_term_name` | STRING | Sales Term Name | |
| `department_id` | STRING | Department ID | |
| `department_name` | STRING | Department Name | |
| `linked_txn` | JSON | Linked Txn | |
| `home_balance` | FLOAT | Home Balance | |

# Example Questions

- How much do we owe each vendor, and which bills are overdue?
- What are monthly expenses by vendor and by expense line?
- What is the average time from bill date to payment?

## Joins

- [Vendors](./vendors.md) — `vendor_id = id` [N:1]
- [Accounts](./accounts.md) — `ap_account_id = id` [N:1] — Accounts Payable account the bill posts to.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
