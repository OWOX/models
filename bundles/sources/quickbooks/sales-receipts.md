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
| `line` | JSON | Line | Line array kept as JSON. Unnest in SQL: DetailType decides which \*LineDetail object is present. |
| `customer_id` | STRING | Customer ID | Id of the customer on the document; joins to customer.id. |
| `customer_name` | STRING | Customer Name | Name of the customer that customer_id points to. |
| `deposit_to_account_id` | STRING | Deposit To Account ID | Id of the account the money is deposited to; joins to account.id. |
| `deposit_to_account_name` | STRING | Deposit to Account Name | Name of the account that deposit_to_account_id points to. |
| `payment_method_id` | STRING | Payment Method ID | Id of the preferred payment method; joins to the QuickBooks payment method list. |
| `payment_method_name` | STRING | Payment Method Name | Name of the preferred payment method that payment_method_id points to, for example Cash or Check. |
| `payment_ref_num` | STRING | Payment Ref Num | Payment reference number, for example a check number or card reference. |
| `bill_email` | STRING | Bill Email | Email address the receipt is sent to. |
| `class_id` | STRING | Class ID | Id of the class used to tag the document for class tracking; empty when classes are off. |
| `class_name` | STRING | Class Name | Name of the class that class_id points to. |
| `department_id` | STRING | Department ID | Id of the department (location) the document is tagged with; empty when locations are off. |
| `department_name` | STRING | Department Name | Name of the department (location) that department_id points to. |
| `total_tax` | FLOAT | Total Tax | Total sales tax on the document, in the document currency. |
| `home_total_amt` | FLOAT | Home Total Amt | Total amount converted to the company's home currency. |

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
