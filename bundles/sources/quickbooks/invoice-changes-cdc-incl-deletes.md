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
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. |
| `realm_id` | STRING | PK. |
| `entity` | STRING | Entity name, constant per node. |
| `status` | STRING | "Deleted" for hard-deleted objects; absent for live ones. Live rows carry the full payload. |
| `last_updated_time` | TIMESTAMP | PK. |
| `sync_token` | STRING |  |
| `txn_date` | DATE |  |
| `total_amt` | FLOAT |  |
| `payload` | JSON | Whole object as JSON (CDC returns the full payload, so the main node's columns can be re-derived). |

# Example Questions

- Which invoices were created, changed or deleted since the last run?
- Which deleted invoices still appear in older extracts?

## Joins

- [Invoices](./invoices.md) — `realm_id = realm_id`, `id = id` [N:1] — Several change rows per invoice; a row with status Deleted has no live counterpart.
  - Description: Several change rows per invoice; a row with status Deleted has no live counterpart.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
