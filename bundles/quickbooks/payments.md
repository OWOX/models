---
title: "Payments"
description: |
  Money received from customers and how it was applied to invoices. The `line` JSON names the invoices each payment settles.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment"
    title: "Intuit QuickBooks Online API reference — Payments"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `payment`
- **Default destination table:** `quickbooks_payment`
- **Unique keys:** `realm_id`, `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). |
| `realm_id` | STRING | Realm ID | PK. FK to [Company info](./company-info.md). Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `txn_date` | DATE | Txn Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amt | |
| `currency_id` | STRING | Currency ID | |
| `currency_name` | STRING | Currency Name | |
| `exchange_rate` | FLOAT | Exchange Rate | |
| `private_note` | STRING | Private Note | |
| `unapplied_amt` | FLOAT | Unapplied Amt | |
| `customer_id` | STRING | Customer ID | FK to [Customers](./customers.md). |
| `customer_name` | STRING | Customer Name | |
| `deposit_to_account_id` | STRING | Deposit To Account ID | FK to [Accounts](./accounts.md). |
| `deposit_to_account_name` | STRING | Deposit To Account Name | |
| `payment_method_id` | STRING | Payment Method ID | |
| `payment_method_name` | STRING | Payment Method Name | |
| `payment_ref_num` | STRING | Payment Ref Num | Check or reference number. |
| `process_payment` | BOOLEAN | Process Payment | |
| `line` | JSON | Line | Line[] as JSON; each line has Amount and LinkedTxn[] {TxnId, TxnType} pointing at the Invoice it settles. |

# Example Questions

- How much cash came in per month, by payment method and deposit account?
- Which payments are unapplied or only partly applied to invoices?
- Which customers pay late most often?

## Joins

- [Customers](./customers.md) — `customer_id = id` [N:1]
- [Accounts](./accounts.md) — `deposit_to_account_id = id` [N:1] — Bank or Undeposited Funds account the payment landed in.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
