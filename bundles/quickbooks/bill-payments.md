---
title: "Bill payments"
description: |
  Payments made against bills, by check or credit card, with the vendor and the accounts involved.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/billpayment"
    title: "Intuit QuickBooks Online API reference — Bill payments"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `bill_payment`
- **Default destination table:** `quickbooks_bill_payment`
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
| `pay_type` | STRING | Pay Type | Check or CreditCard. |
| `vendor_id` | STRING | Vendor ID | FK to [Vendors](./vendors.md). |
| `vendor_name` | STRING | Vendor Name | |
| `ap_account_id` | STRING | AP Account ID | FK to [Accounts](./accounts.md). |
| `ap_account_name` | STRING | AP Account Name | |
| `check_bank_account_id` | STRING | Check Bank Account ID | FK to [Accounts](./accounts.md). |
| `check_bank_account_name` | STRING | Check Bank Account Name | |
| `check_print_status` | STRING | Check Print Status | |
| `credit_card_account_id` | STRING | Credit Card Account ID | FK to [Accounts](./accounts.md). |
| `credit_card_account_name` | STRING | Credit Card Account Name | |
| `line` | JSON | Line | Line[] as JSON; LinkedTxn[] {TxnId, TxnType=Bill} names the bills settled. |

# Example Questions

- How much was paid to vendors per month, by check and by card?
- Which bills are still unpaid after their due date?

## Joins

- [Vendors](./vendors.md) — `vendor_id = id` [N:1]
- [Accounts](./accounts.md) — `ap_account_id = id` [N:1]
- [Accounts](./accounts.md) — `check_bank_account_id = id` [N:1] — Bank account for a check payment.
- [Accounts](./accounts.md) — `credit_card_account_id = id` [N:1] — Credit card account for a card payment.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
