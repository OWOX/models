---
title: "Deposits"
description: |
  Bank deposits, including the ones that group undeposited customer payments, with the account deposited to.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/deposit"
    title: "Intuit QuickBooks Online API reference — Deposits"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `deposit`
- **Default destination table:** `quickbooks_deposit`
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
| `line` | JSON | Line | Line[] as JSON; lines either link received Payments (LinkedTxn) or post directly (DepositLineDetail.AccountRef, Entity). |
| `deposit_to_account_id` | STRING | Deposit To Account ID | FK to [Accounts](./accounts.md). |
| `deposit_to_account_name` | STRING | Deposit To Account Name | |
| `cash_back_amount` | FLOAT | Cash Back Amount | |
| `cash_back_account_id` | STRING | Cash Back Account ID | FK to [Accounts](./accounts.md). |
| `cash_back_account_name` | STRING | Cash Back Account Name | |
| `department_id` | STRING | Department ID | |
| `department_name` | STRING | Department Name | |
| `home_total_amt` | FLOAT | Home Total Amt | |

# Example Questions

- How much was deposited per bank account each month, and how much came from Undeposited Funds?
- Which deposits included cash back, and to which account?

## Joins

- [Accounts](./accounts.md) — `deposit_to_account_id = id` [N:1]
- [Accounts](./accounts.md) — `cash_back_account_id = id` [N:1] — Only when cash back was taken.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
