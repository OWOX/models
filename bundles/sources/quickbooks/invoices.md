---
title: "Invoices"
description: |
  Sales on credit: one row per invoice with customer, dates, total, open balance and the line items as JSON. The receivable side of the business.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice"
    title: "Intuit QuickBooks Online Accounting API reference — Invoices"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `invoice`
- **Default destination table:** `quickbooks_invoice`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `line` | STRING | Line | Line array kept as JSON. Unnest in SQL: DetailType decides which *LineDetail object is present. Stored as a JSON string. |
| `balance` | FLOAT | Balance | Unpaid remainder; 0 when fully paid. |
| `class_id` | STRING | Class ID | Id of the class used to tag the document for class tracking; empty when classes are off. |
| `due_date` | DATE | Due Date | Date the invoice is due for payment. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `txn_date` | DATE | Transaction Date | Business date of the transaction (not the edit date). |
| `ship_date` | DATE | Ship Date | Date the goods were or will be shipped. |
| `total_amt` | FLOAT | Total Amount | Total amount of the document including tax, in the document currency. |
| `total_tax` | FLOAT | Total Tax | Total sales tax on the document, in the document currency. |
| `bill_email` | STRING | Bill Email | Email address the invoice is sent to. |
| `class_name` | STRING | Class Name | Name of the class that class_id points to. |
| `doc_number` | STRING | Doc Number | Document number shown on the form (for example the invoice or bill number); can be empty when the company does not use automatic numbering. |
| `linked_txn` | STRING | Linked Transaction | Header-level links (payments, estimates) as JSON: TxnId, TxnType. Stored as a JSON string. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `customer_id` | STRING | Customer ID | Id of the customer on the document; joins to customer.id. FK to [Customers](./customers.md) |
| `email_status` | STRING | Email Status | Whether the document has been emailed: NotSet, NeedToSend or EmailSent. |
| `home_balance` | FLOAT | Home Balance | Open balance converted to the company's home currency. |
| `print_status` | STRING | Print Status | Print state of the document: NotSet, NeedToPrint or PrintComplete. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `tracking_num` | STRING | Tracking Num | Shipping tracking number entered on the invoice. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `customer_memo` | STRING | Customer Memo | Message to the customer printed on the document. |
| `customer_name` | STRING | Customer Name | Name of the customer that customer_id points to. |
| `department_id` | STRING | Department ID | Id of the department (location) the document is tagged with; empty when locations are off. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `sales_term_id` | STRING | Sales Term ID | Id of the payment terms applied (for example Net 30); joins to the QuickBooks terms list. |
| `home_total_amt` | FLOAT | Home Total Amount | Total amount converted to the company's home currency. |
| `txn_tax_detail` | STRING | Transaction Tax Detail | Tax detail of the document as JSON: total tax, tax code and the per-rate tax lines. Stored as a JSON string. |
| `department_name` | STRING | Department Name | Name of the department (location) that department_id points to. |
| `sales_term_name` | STRING | Sales Term Name | Name of the payment terms that sales_term_id points to. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |
| `deposit_to_account_id` | STRING | Deposit To Account ID | Id of the account the money is deposited to; joins to account.id. FK to [Accounts](./accounts.md) |
| `deposit_to_account_name` | STRING | Deposit To Account Name | Name of the account that deposit_to_account_id points to. |

# Example Questions

- How much was invoiced per month, per `customer` and per sales term?
- Which invoices are overdue, by how many days, and what balance is open on each?
- How long do `customers` take to pay, from the transaction date to the linked `payment`?

## Joins

- [Customers](./customers.md) — `realm_id = realm_id` AND `customer_id = id` [N:1] — The customer the document is for.
  - [Customers Company info](./company-info.md)
- [Accounts](./accounts.md) — `realm_id = realm_id` AND `deposit_to_account_id = id` [N:1] — Set only when the invoice carries a deposit.
  - [Accounts Company info](./company-info.md)
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
