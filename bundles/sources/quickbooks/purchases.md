---
title: "Purchases"
description: |
  Expenses paid directly, without a bill: cash, check or card purchases with the account paid from and the payee. `entity_id` names the payee, and `entity_type` says whether it is a vendor, customer or employee; because ids are only unique per type, it is not drawn as a join to Vendors.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase"
    title: "Intuit QuickBooks Online Accounting API reference — Purchases"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `purchase`
- **Default destination table:** `quickbooks_purchase`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `line` | STRING | Line | Line array kept as JSON. Unnest in SQL: DetailType decides which *LineDetail object is present. Stored as a JSON string. |
| `credit` | BOOLEAN | Credit | True for a credit-card refund. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `txn_date` | DATE | Transaction Date | Business date of the transaction (not the edit date). |
| `entity_id` | STRING | Entity ID | Vendor, Customer or Employee paid. FK to [Vendors](./vendors.md) |
| `total_amt` | FLOAT | Total Amount | Total amount of the document including tax, in the document currency. |
| `total_tax` | FLOAT | Total Tax | Total sales tax on the document, in the document currency. |
| `account_id` | STRING | Account ID | Bank or credit-card account the money left. FK to [Accounts](./accounts.md) |
| `doc_number` | STRING | Doc Number | Document number shown on the form (for example the invoice or bill number); can be empty when the company does not use automatic numbering. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `entity_name` | STRING | Entity Name | Name of the payee (vendor, customer or employee) on the purchase. |
| `entity_type` | STRING | Entity Type | Type of the payee: Vendor, Customer or Employee. |
| `account_name` | STRING | Account Name | Name of the bank or credit card account the purchase was paid from. |
| `payment_type` | STRING | Payment Type | Cash, Check or CreditCard. |
| `print_status` | STRING | Print Status | Print state of the check: NotSet, NeedToPrint or PrintComplete. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `department_id` | STRING | Department ID | Id of the department (location) the document is tagged with; empty when locations are off. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `department_name` | STRING | Department Name | Name of the department (location) that department_id points to. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |
| `payment_method_id` | STRING | Payment Method ID | Id of the preferred payment method; joins to the QuickBooks payment method list. |
| `payment_method_name` | STRING | Payment Method Name | Name of the preferred payment method that payment_method_id points to, for example Cash or Check. |

# Example Questions

- What was spent directly, without a `bill`, by `account` and payee each month?
- Which `vendors` are paid mostly by card versus check?

## Joins

- [Accounts](./accounts.md) — `realm_id = realm_id` AND `account_id = id` [N:1] — Bank, credit card or cash account paid from.
  - [Accounts Company info](./company-info.md)
- [Vendors](./vendors.md) — `realm_id = realm_id` AND `entity_id = id` [N:1] — The payee, when it is a vendor. QuickBooks also allows a customer or an employee here, so some rows match no vendor.
  - [Vendors Company info](./company-info.md)
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
