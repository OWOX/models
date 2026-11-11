---
title: "Refund receipts"
description: |
  Money returned to a customer from a bank or credit-card account.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/refundreceipt"
    title: "Intuit QuickBooks Online Accounting API reference — Refund receipts"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `refund_receipt`
- **Default destination table:** `quickbooks_refund_receipt`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `line` | STRING | Line | Line array kept as JSON. Unnest in SQL: DetailType decides which *LineDetail object is present. Stored as a JSON string. |
| `class_id` | STRING | Class ID | Id of the class used to tag the document for class tracking; empty when classes are off. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `txn_date` | DATE | Transaction Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amount | Total amount of the document including tax, in the document currency. |
| `total_tax` | FLOAT | Total Tax | Total sales tax on the document, in the document currency. |
| `class_name` | STRING | Class Name | Name of the class that class_id points to. |
| `doc_number` | STRING | Doc Number | Document number shown on the form (for example the invoice or bill number); can be empty when the company does not use automatic numbering. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `customer_id` | STRING | Customer ID | Id of the customer on the document; joins to customer.id. FK to [Customers](./customers.md) |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `customer_name` | STRING | Customer Name | Name of the customer that customer_id points to. |
| `department_id` | STRING | Department ID | Id of the department (location) the document is tagged with; empty when locations are off. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `home_total_amt` | FLOAT | Home Total Amount | Total amount converted to the company's home currency. |
| `department_name` | STRING | Department Name | Name of the department (location) that department_id points to. |
| `payment_ref_num` | STRING | Payment Ref Num | Payment reference number, for example a check number or card reference. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |
| `payment_method_id` | STRING | Payment Method ID | Id of the preferred payment method; joins to the QuickBooks payment method list. |
| `payment_method_name` | STRING | Payment Method Name | Name of the preferred payment method that payment_method_id points to, for example Cash or Check. |
| `deposit_to_account_id` | STRING | Deposit To Account ID | Account the refund was paid from. FK to [Accounts](./accounts.md) |
| `deposit_to_account_name` | STRING | Deposit To Account Name | Name of the account that deposit_to_account_id points to. |

# Example Questions

- How much was refunded per month and from which `account`?
- Which `items` or `customers` drive refunds?

## Joins

- [Customers](./customers.md) — `realm_id = realm_id` AND `customer_id = id` [N:1] — The customer the document is for.
  - [Customers Company info](./company-info.md)
- [Accounts](./accounts.md) — `realm_id = realm_id` AND `deposit_to_account_id = id` [N:1] — Account the refund was paid from.
  - [Accounts Company info](./company-info.md)
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
