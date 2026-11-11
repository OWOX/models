---
title: "Journal entries"
description: |
  Manual accounting entries: adjusting, accrual and reclassification postings, with their debit and credit lines as JSON.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/journalentry"
    title: "Intuit QuickBooks Online API reference — Journal entries"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `journal_entry`
- **Default destination table:** `quickbooks_journal_entry`
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
| `currency_id` | STRING | Currency ID | |
| `currency_name` | STRING | Currency Name | |
| `exchange_rate` | FLOAT | Exchange Rate | |
| `private_note` | STRING | Private Note | |
| `line` | JSON | Line | Line[] as JSON; JournalEntryLineDetail has PostingType (Debit/Credit), AccountRef and optional Entity {Type, EntityRef}. |
| `adjustment` | BOOLEAN | Adjustment | |
| `total_amt` | FLOAT | Total Amt | Sum of one side of the entry. |
| `home_total_amt` | FLOAT | Home Total Amt | |

# Example Questions

- Which manual adjustments were posted each month, and to which accounts?
- How large are adjusting entries relative to transactional activity?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — Debit and credit lines, each with its account, sit in `line` as JSON.
