---
title: "Accounts"
description: |
  The chart of accounts: every bank, receivable, payable, income, expense and equity account with its type, classification, parent and current balance. The spine every transaction posts to.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "Intuit QuickBooks Online API reference — Accounts"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `account`
- **Default destination table:** `quickbooks_account`
- **Unique keys:** `realm_id`, `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). |
| `realm_id` | STRING | Realm ID | PK. FK to [Company info](./company-info.md). Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `name` | STRING | Name | |
| `fully_qualified_name` | STRING | Fully Qualified Name | Parent:Child path for sub-accounts. |
| `account_type` | STRING | Account Type | Bank, Accounts Receivable, Expense, Income, Credit Card… |
| `account_sub_type` | STRING | Account Sub Type | |
| `classification` | STRING | Classification | Asset, Liability, Equity, Revenue, Expense. |
| `acct_num` | STRING | Acct Num | |
| `current_balance` | FLOAT | Current Balance | |
| `current_balance_with_sub_accounts` | FLOAT | Current Balance With Sub Accounts | |
| `currency_id` | STRING | Currency ID | |
| `currency_name` | STRING | Currency Name | |
| `sub_account` | BOOLEAN | Sub Account | |
| `parent_id` | STRING | Parent ID | FK to [Accounts](./accounts.md). |
| `parent_name` | STRING | Parent Name | |
| `description` | STRING | Description | |
| `active` | BOOLEAN | Active | |

# Example Questions

- How is the chart of accounts structured, and which accounts are sub-accounts of which?
- What is the current balance of every bank and credit-card account, and how much sits in Accounts Receivable and Payable?
- Which accounts are inactive but still hold a balance?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — Every table carries the company id.
- [Accounts](./accounts.md) — `parent_id = id` [N:1] — Sub-account to its parent account.
