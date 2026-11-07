---
title: "Deposits"
description: |
  Bank deposits, including the ones that group undeposited customer payments, with the account deposited to.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/deposit"
    title: "Intuit QuickBooks Online Accounting API reference — deposit"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `deposit`
- **Default destination table:** `quickbooks_deposit`
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
| `line` | JSON | Line[] as JSON; lines either link received Payments (LinkedTxn) or post directly (DepositLineDetail.AccountRef, Entity). |
| `deposit_to_account_id` | STRING |  |
| `deposit_to_account_name` | STRING |  |
| `cash_back_amount` | FLOAT |  |
| `cash_back_account_id` | STRING |  |
| `cash_back_account_name` | STRING |  |
| `department_id` | STRING |  |
| `department_name` | STRING |  |
| `home_total_amt` | FLOAT |  |

# Example Questions

- How much was deposited per bank account each month, and how much came from Undeposited Funds?
- Which deposits included cash back, and to which account?

## Joins

- [Accounts](./accounts.md) — `realm_id = realm_id`, `deposit_to_account_id = id` [N:1] — The bank account the deposit went into. `cash_back_account_id` holds a second account id (cash back taken), joined to Accounts the same way.
  - Description: The bank account the deposit went into. `cash_back_account_id` holds a second account id (cash back taken), joined to Accounts the same way.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
