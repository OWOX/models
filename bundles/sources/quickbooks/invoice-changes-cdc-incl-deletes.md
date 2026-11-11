---
title: "Invoice changes (CDC, incl. deletes)"
description: |
  Change feed for invoices: every invoice created, updated or deleted since the last run, with deleted ones marked. The only way to see hard deletes, which the query endpoint never returns.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/changedatacapture"
    title: "Intuit QuickBooks Online API reference — Invoice changes (CDC, incl. deletes)"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `cdc_invoice`
- **Default destination table:** `quickbooks_cdc_invoice`
- **Unique keys:** `realm_id`, `id`, `last_updated_time`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. FK to [Invoices](./invoices.md). |
| `realm_id` | STRING | Realm ID | PK. FK to [Company info](./company-info.md). |
| `entity` | STRING | Entity | Entity name, constant per node. |
| `status` | STRING | Status | "Deleted" for hard-deleted objects; absent for live ones. Live rows carry the full payload. |
| `last_updated_time` | TIMESTAMP | Last Updated Time | PK. |
| `sync_token` | STRING | Sync Token | |
| `txn_date` | DATE | Txn Date | |
| `total_amt` | FLOAT | Total Amt | |
| `payload` | JSON | Payload | Whole object as JSON (CDC returns the full payload, so the main node's columns can be re-derived). |

# Example Questions

- Which invoices were created, changed or deleted since the last run?
- Which deleted invoices still appear in older extracts?

## Joins

- [Invoices](./invoices.md) — `id = id`, `realm_id = realm_id` [N:1] — Several change rows per invoice; a row whose `status` is Deleted has no live counterpart.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
