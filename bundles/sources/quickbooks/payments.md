---
title: "Payments"
description: |
  Money received from customers and how it was applied to invoices. The `line` JSON names the invoices each payment settles.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment"
    title: "Intuit QuickBooks Online Accounting API reference — payment"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `payment`
- **Default destination table:** `quickbooks_payment`
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
| `txn_date` | DATE | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT |  |
| `currency_id` | STRING |  |
| `currency_name` | STRING |  |
| `exchange_rate` | FLOAT |  |
| `private_note` | STRING |  |
| `unapplied_amt` | FLOAT |  |
| `customer_id` | STRING |  |
| `customer_name` | STRING |  |
| `deposit_to_account_id` | STRING |  |
| `deposit_to_account_name` | STRING |  |
| `payment_method_id` | STRING |  |
| `payment_method_name` | STRING |  |
| `payment_ref_num` | STRING | Check or reference number. |
| `process_payment` | BOOLEAN |  |
| `line` | JSON | Line\[\] as JSON; each line has Amount and LinkedTxn\[\] {TxnId, TxnType} pointing at the Invoice it settles. |

# Example Questions

- How much cash came in per month, by payment method and deposit account?
- Which payments are unapplied or only partly applied to invoices?
- Which customers pay late most often?

## Joins

- [Customers](./customers.md) — `realm_id = realm_id`, `customer_id = id` [N:1] — The customer the document is for.
  - Description: The customer the document is for.
- [Accounts](./accounts.md) — `realm_id = realm_id`, `deposit_to_account_id = id` [N:1] — Bank or Undeposited Funds account the payment landed in.
  - Description: Bank or Undeposited Funds account the payment landed in.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
