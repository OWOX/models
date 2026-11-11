---
title: "Accounts"
description: |
  The chart of accounts: every bank, receivable, payable, income, expense and equity account with its type, classification, parent and current balance. The spine every transaction posts to. A sub-account names its parent account in `parent_id`; that self-reference is not drawn as a join.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "Intuit QuickBooks Online Accounting API reference — Accounts"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `account`
- **Default destination table:** `quickbooks_account`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `name` | STRING | Name | Name of the account in the chart of accounts. |
| `active` | BOOLEAN | Active | True when the record is active; false when it has been made inactive (QuickBooks never hard-deletes lists). |
| `acct_num` | STRING | Acct Num | Account number in the chart of accounts; optional and can be empty. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `parent_id` | STRING | Parent ID | Id of the parent record in the same table (the parent account, customer or item); empty for top-level records. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code the account holds its amounts in, for example USD. |
| `description` | STRING | Description | Description of the account. |
| `parent_name` | STRING | Parent Name | Name of the parent record that parent_id points to. |
| `sub_account` | BOOLEAN | Sub Account | True when the account is a sub-account of another account (see parent_id). |
| `account_type` | STRING | Account Type | Bank, Accounts Receivable, Expense, Income, Credit Card… |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `classification` | STRING | Classification | Asset, Liability, Equity, Revenue, Expense. |
| `current_balance` | FLOAT | Current Balance | Balance of the account itself, without its sub-accounts; Intuit sets it for balance sheet accounts. |
| `account_sub_type` | STRING | Account Sub Type | QuickBooks account sub-type that refines the account type, for example Checking or Savings for bank accounts. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads every record, whatever this time. |
| `fully_qualified_name` | STRING | Fully Qualified Name | Parent:Child path for sub-accounts. |
| `current_balance_with_sub_accounts` | FLOAT | Current Balance With Sub Accounts | Balance of the account plus all of its sub-accounts. |

# Example Questions

- How is the chart of accounts structured, and which accounts are sub-accounts of which?
- What is the current balance of every bank and credit-card account, and how much sits in Accounts Receivable and Payable?
- Which accounts are inactive but still hold a balance?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — Every table carries the company id.
