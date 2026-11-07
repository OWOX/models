---
title: "Purchases"
description: |
  Expenses paid directly, without a bill: cash, check or card purchases with the account paid from and the payee. `entity_id` names the payee, and `entity_type` says whether it is a vendor, customer or employee; because ids are only unique per type, it is not drawn as a join to Vendors.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase"
    title: "Intuit QuickBooks Online Accounting API reference — purchase"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `purchase`
- **Default destination table:** `quickbooks_purchase`
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
| `payment_type` | STRING | Cash, Check or CreditCard. |
| `account_id` | STRING | Bank or credit-card account the money left. |
| `account_name` | STRING |  |
| `entity_id` | STRING | Vendor, Customer or Employee paid. |
| `entity_name` | STRING |  |
| `entity_type` | STRING |  |
| `payment_method_id` | STRING |  |
| `payment_method_name` | STRING |  |
| `credit` | BOOLEAN | True for a credit-card refund. |
| `print_status` | STRING |  |
| `department_id` | STRING |  |
| `department_name` | STRING |  |
| `total_tax` | FLOAT |  |

# Example Questions

- What was spent directly, without a bill, by account and payee each month?
- Which vendors are paid mostly by card versus check?

## Joins

- [Accounts](./accounts.md) — `realm_id = realm_id`, `account_id = id` [N:1] — Bank, credit card or cash account paid from.
  - Description: Bank, credit card or cash account paid from.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
