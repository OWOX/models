---
title: "Invoices"
description: |
  Sales on credit: one row per invoice with customer, dates, total, open balance and the line items as JSON. The receivable side of the business.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice"
    title: "Intuit QuickBooks Online Accounting API reference — invoice"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `invoice`
- **Default destination table:** `quickbooks_invoice`
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
| `due_date` | DATE |  |
| `balance` | FLOAT | Unpaid remainder; 0 when fully paid. |
| `customer_id` | STRING |  |
| `customer_name` | STRING |  |
| `customer_memo` | STRING |  |
| `bill_email` | STRING |  |
| `email_status` | STRING |  |
| `print_status` | STRING |  |
| `sales_term_id` | STRING |  |
| `sales_term_name` | STRING |  |
| `deposit_to_account_id` | STRING |  |
| `deposit_to_account_name` | STRING |  |
| `class_id` | STRING |  |
| `class_name` | STRING |  |
| `department_id` | STRING |  |
| `department_name` | STRING |  |
| `ship_date` | DATE |  |
| `tracking_num` | STRING |  |
| `total_tax` | FLOAT |  |
| `txn_tax_detail` | JSON |  |
| `linked_txn` | JSON | Header-level links (payments, estimates) as JSON: TxnId, TxnType. |
| `home_total_amt` | FLOAT |  |
| `home_balance` | FLOAT |  |

# Example Questions

- How much was invoiced per month, per customer and per sales term?
- Which invoices are overdue, by how many days, and what balance is open on each?
- How long do customers take to pay, from `txn_date` to the linked payment?

## Joins

- [Customers](./customers.md) — `realm_id = realm_id`, `customer_id = id` [N:1] — The customer the document is for.
  - Description: The customer the document is for.
- [Accounts](./accounts.md) — `realm_id = realm_id`, `deposit_to_account_id = id` [N:1] — Set only when the invoice carries a deposit.
  - Description: Set only when the invoice carries a deposit.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
