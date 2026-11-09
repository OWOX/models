---
title: "Purchases"
description: |
  Expenses paid directly, without a bill: cash, check or card purchases with the account paid from and the payee.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase"
    title: "Intuit QuickBooks Online API reference — Purchases"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `purchase`
- **Default destination table:** `quickbooks_purchase`
- **Unique keys:** `realm_id`, `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). |
| `realm_id` | STRING | Realm ID | PK. FK to [Company info](./company-info.md). Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `doc_number` | STRING | Doc Number | |
| `txn_date` | DATE | Txn Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amt | |
| `currency_id` | STRING | Currency ID | |
| `currency_name` | STRING | Currency Name | |
| `exchange_rate` | FLOAT | Exchange Rate | |
| `private_note` | STRING | Private Note | |
| `line` | JSON | Line | Line array kept as JSON. Unnest in SQL: DetailType decides which *LineDetail object is present. |
| `payment_type` | STRING | Payment Type | Cash, Check or CreditCard. |
| `account_id` | STRING | Account ID | FK to [Accounts](./accounts.md). Bank or credit-card account the money left. |
| `account_name` | STRING | Account Name | |
| `entity_id` | STRING | Entity ID | FK to [Vendors](./vendors.md). Vendor, Customer or Employee paid. |
| `entity_name` | STRING | Entity Name | |
| `entity_type` | STRING | Entity Type | |
| `payment_method_id` | STRING | Payment Method ID | |
| `payment_method_name` | STRING | Payment Method Name | |
| `credit` | BOOLEAN | Credit | True for a credit-card refund. |
| `print_status` | STRING | Print Status | |
| `department_id` | STRING | Department ID | |
| `department_name` | STRING | Department Name | |
| `total_tax` | FLOAT | Total Tax | |

# Example Questions

- What was spent directly, without a bill, by account and payee each month?
- Which vendors are paid mostly by card versus check?

## Joins

- [Accounts](./accounts.md) — `account_id = id`, `realm_id = realm_id` [N:1] — Bank, credit card or cash account paid from.
- [Vendors](./vendors.md) — `entity_id = id`, `realm_id = realm_id` [N:1] — Only when the payee is a vendor; QuickBooks also allows a customer or employee here.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
