---
title: "Invoice changes (CDC, incl. deletes)"
description: |
  Change feed for invoices: every invoice created, updated or deleted since the last run, with deleted ones marked. The only way to see hard deletes, which the query endpoint never returns.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/changedatacapture"
    title: "Intuit QuickBooks Online Accounting API reference — changedatacapture"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `cdc_invoice`
- **Default destination table:** `quickbooks_cdc_invoice`
- **Unique keys:** `realm_id`, `id`, `last_updated_time`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks invoice Id; with realm_id it identifies the invoice that changed. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. |
| `entity` | STRING | Entity | Entity name, constant per node. |
| `status` | STRING | Status | "Deleted" for hard-deleted objects; absent for live ones. Live rows carry the full payload. |
| `last_updated_time` | TIMESTAMP | Last Updated Time | PK. When the invoice was last changed in QuickBooks (UTC), as returned by the change data capture feed. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `txn_date` | DATE | Txn Date | Date of the invoice. |
| `total_amt` | FLOAT | Total Amt | Total amount of the document including tax, in the document currency. |
| `payload` | JSON | Payload | Whole object as JSON (CDC returns the full payload, so the main node's columns can be re-derived). |

# Example Questions

- Which invoices were created, changed or deleted since the last run?
- Which deleted invoices still appear in older extracts?

## Joins

- [Invoices](./invoices.md) — `realm_id = realm_id`, `id = id` [N:1] — Several change rows per invoice; a row with status Deleted has no live counterpart.
  - Description: Several change rows per invoice; a row with status Deleted has no live counterpart.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
