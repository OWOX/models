---
title: "Transfers"
description: |
  Money moved between the company's own accounts, bank to bank or bank to credit card.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transfer"
    title: "Intuit QuickBooks Online Accounting API reference — Transfers"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `transfer`
- **Default destination table:** `quickbooks_transfer`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `amount` | FLOAT | Amount | Amount moved from the source account to the destination account. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `txn_date` | DATE | Transaction Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amount | Total amount of the document including tax, in the document currency. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `to_account_id` | STRING | To Account ID | Id of the account the money is moved to; joins to account.id. FK to [Accounts](./accounts.md) |
| `from_account_id` | STRING | From Account ID | Id of the account the money is moved from; joins to account.id. FK to [Accounts](./accounts.md) |
| `to_account_name` | STRING | To Account Name | Name of the account that to_account_id points to. |
| `from_account_name` | STRING | From Account Name | Name of the account that from_account_id points to. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |

# Example Questions

- How much moved between bank and credit-card `accounts` each month?
- Which transfers fund credit-card `payments`?

## Joins

- [Accounts](./accounts.md) as `from_account` — `realm_id = realm_id` AND `from_account_id = id` [N:1] — The account the money moved from.
  - [From Account Company info](./company-info.md)
- [Accounts](./accounts.md) as `to_account` — `realm_id = realm_id` AND `to_account_id = id` [N:1] — The account the money moved to.
  - [To Account Company info](./company-info.md)
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
