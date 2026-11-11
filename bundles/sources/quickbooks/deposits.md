---
title: "Deposits"
description: |
  Bank deposits, including the ones that group undeposited customer payments, with the account deposited to.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/deposit"
    title: "Intuit QuickBooks Online Accounting API reference — Deposits"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `deposit`
- **Default destination table:** `quickbooks_deposit`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `line` | STRING | Line | Line[] as JSON; lines either link received Payments (LinkedTxn) or post directly (DepositLineDetail.AccountRef, Entity). Stored as a JSON string. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `txn_date` | DATE | Transaction Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amount | Total amount of the deposit, in the document currency. |
| `doc_number` | STRING | Doc Number | Document number shown on the form (for example the invoice or bill number); can be empty when the company does not use automatic numbering. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `department_id` | STRING | Department ID | Id of the department (location) the document is tagged with; empty when locations are off. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `home_total_amt` | FLOAT | Home Total Amount | Total amount converted to the company's home currency. |
| `department_name` | STRING | Department Name | Name of the department (location) that department_id points to. |
| `cash_back_amount` | FLOAT | Cash Back Amount | Amount of cash taken back from the deposit. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |
| `cash_back_account_id` | STRING | Cash Back Account ID | Id of the account the cash back is posted to; joins to account.id. FK to [Accounts](./accounts.md) |
| `deposit_to_account_id` | STRING | Deposit To Account ID | Id of the account the money is deposited to; joins to account.id. FK to [Accounts](./accounts.md) |
| `cash_back_account_name` | STRING | Cash Back Account Name | Name of the account that cash_back_account_id points to. |
| `deposit_to_account_name` | STRING | Deposit To Account Name | Name of the account that deposit_to_account_id points to. |

# Example Questions

- How much was deposited per bank `account` each month, and how much came from Undeposited Funds?
- Which deposits included cash back, and to which `account`?

## Joins

- [Accounts](./accounts.md) as `deposit_to_account` — `realm_id = realm_id` AND `deposit_to_account_id = id` [N:1] — The bank account the deposit went into.
  - [Deposit To Account Company info](./company-info.md)
- [Accounts](./accounts.md) as `cash_back_account` — `realm_id = realm_id` AND `cash_back_account_id = id` [N:1] — The account the cash back went to. Set only when cash back was taken.
  - [Cash Back Account Company info](./company-info.md)
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
