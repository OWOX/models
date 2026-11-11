---
title: "Journal entries"
description: |
  Manual accounting entries: adjusting, accrual and reclassification postings, with their debit and credit lines as JSON.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/journalentry"
    title: "Intuit QuickBooks Online Accounting API reference — Journal entries"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `journal_entry`
- **Default destination table:** `quickbooks_journal_entry`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `line` | STRING | Line | Line[] as JSON; JournalEntryLineDetail has PostingType (Debit/Credit), AccountRef and optional Entity {Type, EntityRef}. Stored as a JSON string. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `txn_date` | DATE | Transaction Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amount | Sum of one side of the entry. |
| `adjustment` | BOOLEAN | Adjustment | True when the entry is an adjusting journal entry. |
| `doc_number` | STRING | Doc Number | Document number shown on the form (for example the invoice or bill number); can be empty when the company does not use automatic numbering. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `home_total_amt` | FLOAT | Home Total Amount | Total amount converted to the company's home currency. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |

# Example Questions

- Which manual adjustments were posted each month, and to which `accounts`?
- How large are adjusting entries relative to transactional activity?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
