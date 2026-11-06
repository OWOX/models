---
title: "Transfers"
description: |
  Money moved between the company's own accounts, bank to bank or bank to credit card.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transfer"
    title: "Intuit QuickBooks Online API reference — Transfers"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `transfer`
- **Default destination table:** `quickbooks_transfer`
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
| `amount` | FLOAT | Amount | |
| `from_account_id` | STRING | From Account ID | FK to [Accounts](./accounts.md). |
| `from_account_name` | STRING | From Account Name | |
| `to_account_id` | STRING | To Account ID | FK to [Accounts](./accounts.md). |
| `to_account_name` | STRING | To Account Name | |

# Example Questions

- How much moved between bank and credit-card accounts each month?
- Which transfers fund credit-card payments?

## Joins

- [Accounts](./accounts.md) — `from_account_id = id` [N:1]
- [Accounts](./accounts.md) — `to_account_id = id` [N:1]
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
