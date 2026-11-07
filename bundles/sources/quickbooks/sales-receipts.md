---
title: "Sales receipts"
description: |
  Sales paid at the time of sale, without an invoice: customer, items, total and the account the money went to.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt"
    title: "Intuit QuickBooks Online Accounting API reference — salesreceipt"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `sales_receipt`
- **Default destination table:** `quickbooks_sales_receipt`
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
| `line` | JSON | Line array kept as JSON. Unnest in SQL: DetailType decides which *LineDetail object is present. |
| `customer_id` | STRING |  |
| `customer_name` | STRING |  |
| `deposit_to_account_id` | STRING |  |
| `deposit_to_account_name` | STRING |  |
| `payment_method_id` | STRING |  |
| `payment_method_name` | STRING |  |
| `payment_ref_num` | STRING |  |
| `bill_email` | STRING |  |
| `class_id` | STRING |  |
| `class_name` | STRING |  |
| `department_id` | STRING |  |
| `department_name` | STRING |  |
| `total_tax` | FLOAT |  |
| `home_total_amt` | FLOAT |  |

# Example Questions

- How much point-of-sale revenue arrived without an invoice, by month and payment method?
- Which items sell most through sales receipts versus invoices?

## Joins

- [Customers](./customers.md) — `realm_id = realm_id`, `customer_id = id` [N:1] — The customer the document is for.
  - Description: The customer the document is for.
- [Accounts](./accounts.md) — `realm_id = realm_id`, `deposit_to_account_id = id` [N:1] — The account the sale was deposited to; Undeposited Funds when none was chosen.
  - Description: The account the sale was deposited to; Undeposited Funds when none was chosen.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
