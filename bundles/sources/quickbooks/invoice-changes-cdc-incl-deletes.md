---
title: "Invoice changes (CDC, incl. deletes)"
description: |
  Change feed for invoices: every invoice created, updated or deleted since the last run, with deleted ones marked. The only way to see hard deletes, which the query endpoint never returns.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/changedatacapture"
    title: "Intuit QuickBooks Online Accounting API reference — Invoice changes (CDC, incl. deletes)"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `cdc_invoice`
- **Default destination table:** `quickbooks_cdc_invoice`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`, `last_updated_time`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks invoice Id; with realm_id it identifies the invoice that changed. FK to [Invoices](./invoices.md) |
| `entity` | STRING | Entity | Entity name, constant per node. |
| `status` | STRING | Status | "Deleted" for hard-deleted objects; absent for live ones. Live rows carry the full payload. |
| `payload` | STRING | Payload | Whole object as JSON (CDC returns the full payload, so the main node's columns can be re-derived). Stored as a JSON string. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `txn_date` | DATE | Transaction Date | Date of the invoice. |
| `total_amt` | FLOAT | Total Amount | Total amount of the document including tax, in the document currency. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `last_updated_time` | DATETIME | Last Updated Time | PK. When the invoice was last changed in QuickBooks (UTC), as returned by the change data capture feed. |

# Example Questions

- Which `invoices` were created, changed or deleted since the last run?
- Which deleted `invoices` still appear in older extracts?

## Joins

- [Invoices](./invoices.md) — `realm_id = realm_id` AND `id = id` [N:1] — Several change rows per invoice; a row with status Deleted has no live counterpart.
  - [Invoices Accounts](./accounts.md)
    - [Invoices Accounts Company info](./company-info.md)
  - [Invoices Company info](./company-info.md)
  - [Invoices Customers](./customers.md)
    - [Invoices Customers Company info](./company-info.md)
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
