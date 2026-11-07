---
title: "Bills"
description: |
  What the company owes vendors: one row per bill with vendor, dates, total, open balance and expense or item lines as JSON. The payable side of the business.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill"
    title: "Intuit QuickBooks Online Accounting API reference — bill"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `bill`
- **Default destination table:** `quickbooks_bill`
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
| `line` | JSON | Line[] as JSON; DetailType is AccountBasedExpenseLineDetail (AccountRef) or ItemBasedExpenseLineDetail (ItemRef). |
| `due_date` | DATE |  |
| `balance` | FLOAT |  |
| `vendor_id` | STRING |  |
| `vendor_name` | STRING |  |
| `ap_account_id` | STRING |  |
| `ap_account_name` | STRING |  |
| `sales_term_id` | STRING |  |
| `sales_term_name` | STRING |  |
| `department_id` | STRING |  |
| `department_name` | STRING |  |
| `linked_txn` | JSON |  |
| `home_balance` | FLOAT |  |

# Example Questions

- How much do we owe each vendor, and which bills are overdue?
- What are monthly expenses by vendor and by expense line?
- What is the average time from bill date to payment?

## Joins

- [Vendors](./vendors.md) — `realm_id = realm_id`, `vendor_id = id` [N:1] — The vendor the document is for.
  - Description: The vendor the document is for.
- [Accounts](./accounts.md) — `realm_id = realm_id`, `ap_account_id = id` [N:1] — Accounts Payable account the bill posts to.
  - Description: Accounts Payable account the bill posts to.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
