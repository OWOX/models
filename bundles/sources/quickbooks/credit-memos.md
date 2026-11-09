---
title: "Credit memos"
description: |
  Credit given back to a customer, to be applied against invoices.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/creditmemo"
    title: "Intuit QuickBooks Online Accounting API reference — creditmemo"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `credit_memo`
- **Default destination table:** `quickbooks_credit_memo`
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
| `remaining_credit` | FLOAT | Remaining Credit | Part of the credit memo not yet applied to invoices, in the document currency. |
| `balance` | FLOAT | Balance | Open amount of the credit memo not yet used, in the document currency. |
| `customer_id` | STRING | Customer ID | Id of the customer on the document; joins to customer.id. |
| `customer_name` | STRING | Customer Name | Name of the customer that customer_id points to. |
| `class_id` | STRING | Class ID | Id of the class used to tag the document for class tracking; empty when classes are off. |
| `class_name` | STRING | Class Name | Name of the class that class_id points to. |
| `department_id` | STRING | Department ID | Id of the department (location) the document is tagged with; empty when locations are off. |
| `department_name` | STRING | Department Name | Name of the department (location) that department_id points to. |
| `total_tax` | FLOAT | Total Tax | Total sales tax on the document, in the document currency. |
| `home_total_amt` | FLOAT | Home Total Amt | Total amount converted to the company's home currency. |

# Example Questions

- How much revenue was credited back per customer and month?
- Which customers receive credit memos repeatedly?

## Joins

- [Customers](./customers.md) — `realm_id = realm_id`, `customer_id = id` [N:1] — The customer the document is for.
  - Description: The customer the document is for.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
