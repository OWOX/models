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

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `doc_number` | STRING | Doc Number | Document number shown on the form (for example the invoice or bill number); can be empty when the company does not use automatic numbering. |
| `txn_date` | DATE | Txn Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amt | Total amount of the document including tax, in the document currency. |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `line` | JSON | Line | Line\[\] as JSON; DetailType is AccountBasedExpenseLineDetail (AccountRef) or ItemBasedExpenseLineDetail (ItemRef). |
| `due_date` | DATE | Due Date | Date the bill is due for payment. |
| `balance` | FLOAT | Balance | Open amount still to be paid on the bill, in the bill currency. |
| `vendor_id` | STRING | Vendor ID | Id of the vendor on the document; joins to vendor.id. |
| `vendor_name` | STRING | Vendor Name | Name of the vendor that vendor_id points to. |
| `ap_account_id` | STRING | AP Account ID | Id of the accounts payable account the document is posted to; joins to account.id. |
| `ap_account_name` | STRING | Ap Account Name | Name of the account that ap_account_id points to. |
| `sales_term_id` | STRING | Sales Term ID | Id of the payment terms on the bill (for example Net 30); joins to the QuickBooks terms list. |
| `sales_term_name` | STRING | Sales Term Name | Name of the payment terms that sales_term_id points to. |
| `department_id` | STRING | Department ID | Id of the department (location) the document is tagged with; empty when locations are off. |
| `department_name` | STRING | Department Name | Name of the department (location) that department_id points to. |
| `linked_txn` | JSON | Linked Txn | Transactions linked to this one (for example the payments applied to a bill) as a JSON array of transaction id and type; flatten with UNNEST or JSON functions in SQL. |
| `home_balance` | FLOAT | Home Balance | Open balance of the bill converted to the company's home currency. |

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
