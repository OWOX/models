---
title: "Journal entries"
description: |
  Manual accounting entries: adjusting, accrual and reclassification postings, with their debit and credit lines as JSON.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/journalentry"
    title: "Intuit QuickBooks Online Accounting API reference — journalentry"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `journal_entry`
- **Default destination table:** `quickbooks_journal_entry`
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
| `currency_id` | STRING |  |
| `currency_name` | STRING |  |
| `exchange_rate` | FLOAT |  |
| `private_note` | STRING |  |
| `line` | JSON | Line[] as JSON; JournalEntryLineDetail has PostingType (Debit/Credit), AccountRef and optional Entity {Type, EntityRef}. |
| `adjustment` | BOOLEAN |  |
| `total_amt` | FLOAT | Sum of one side of the entry. |
| `home_total_amt` | FLOAT |  |

# Example Questions

- Which manual adjustments were posted each month, and to which accounts?
- How large are adjusting entries relative to transactional activity?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
