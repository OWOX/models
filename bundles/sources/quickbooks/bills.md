---
title: "Bills"
description: |
  What the company owes vendors: one row per bill with vendor, dates, total, open balance and expense or item lines as JSON. The payable side of the business.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill"
    title: "Intuit QuickBooks Online Accounting API reference — Bills"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `bill`
- **Default destination table:** `quickbooks_bill`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `line` | STRING | Line | Line[] as JSON; DetailType is AccountBasedExpenseLineDetail (AccountRef) or ItemBasedExpenseLineDetail (ItemRef). Stored as a JSON string. |
| `balance` | FLOAT | Balance | Open amount still to be paid on the bill, in the bill currency. |
| `due_date` | DATE | Due Date | Date the bill is due for payment. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `txn_date` | DATE | Transaction Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amount | Total amount of the document including tax, in the document currency. |
| `vendor_id` | STRING | Vendor ID | Id of the vendor on the document; joins to vendor.id. FK to [Vendors](./vendors.md) |
| `doc_number` | STRING | Doc Number | Document number shown on the form (for example the invoice or bill number); can be empty when the company does not use automatic numbering. |
| `linked_txn` | STRING | Linked Transaction | Transactions linked to this one (for example the payments applied to a bill) as a JSON array of transaction id and type; flatten with UNNEST or JSON functions in SQL. Stored as a JSON string. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `vendor_name` | STRING | Vendor Name | Name of the vendor that vendor_id points to. |
| `home_balance` | FLOAT | Home Balance | Open balance of the bill converted to the company's home currency. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `ap_account_id` | STRING | AP Account ID | Id of the accounts payable account the document is posted to; joins to account.id. FK to [Accounts](./accounts.md) |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `department_id` | STRING | Department ID | Id of the department (location) the document is tagged with; empty when locations are off. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `sales_term_id` | STRING | Sales Term ID | Id of the payment terms on the bill (for example Net 30); joins to the QuickBooks terms list. |
| `ap_account_name` | STRING | AP Account Name | Name of the account that ap_account_id points to. |
| `department_name` | STRING | Department Name | Name of the department (location) that department_id points to. |
| `sales_term_name` | STRING | Sales Term Name | Name of the payment terms that sales_term_id points to. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |

# Example Questions

- How much do we owe each `vendor`, and which bills are overdue?
- What are monthly expenses by `vendor` and by expense line?
- What is the average time from bill date to `payment`?

## Joins

- [Vendors](./vendors.md) — `realm_id = realm_id` AND `vendor_id = id` [N:1] — The vendor the document is for.
  - [Vendors Company info](./company-info.md)
- [Accounts](./accounts.md) — `realm_id = realm_id` AND `ap_account_id = id` [N:1] — Accounts Payable account the bill posts to.
  - [Accounts Company info](./company-info.md)
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
