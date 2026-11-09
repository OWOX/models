---
title: "Transfers"
description: |
  Money moved between the company's own accounts, bank to bank or bank to credit card.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transfer"
    title: "Intuit QuickBooks Online Accounting API reference — transfer"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `transfer`
- **Default destination table:** `quickbooks_transfer`
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
| `txn_date` | DATE | Txn Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amt | Total amount of the document including tax, in the document currency. |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `amount` | FLOAT | Amount | Amount moved from the source account to the destination account. |
| `from_account_id` | STRING | From Account ID | Id of the account the money is moved from; joins to account.id. |
| `from_account_name` | STRING | From Account Name | Name of the account that from_account_id points to. |
| `to_account_id` | STRING | To Account ID | Id of the account the money is moved to; joins to account.id. |
| `to_account_name` | STRING | To Account Name | Name of the account that to_account_id points to. |

# Example Questions

- How much moved between bank and credit-card accounts each month?
- Which transfers fund credit-card payments?

## Joins

- [Accounts](./accounts.md) — `realm_id = realm_id`, `from_account_id = id` [N:1] — The account the money moved from.
  - Description: The account the money moved from.
- [Accounts](./accounts.md) — `realm_id = realm_id`, `to_account_id = id` [N:1] — The account the money moved to.
  - Description: The account the money moved to.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
