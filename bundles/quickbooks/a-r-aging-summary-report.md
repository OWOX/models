---
title: "A/R Aging Summary report"
description: |
  A/R Aging Summary: what each customer owes, split into current, 1–30, 31–60, 61–90 and over-90-day buckets, as of the report date.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/report-entities/agedreceivables"
    title: "Intuit QuickBooks Online API reference — A/R Aging Summary report"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `aged_receivables`
- **Default destination table:** `quickbooks_report_aged_receivables`
- **Unique keys:** `realm_id`, `report_name`, `start_period`, `end_period`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `realm_id` | STRING | Realm ID | FK to [Company info](./company-info.md).  |
| `report_name` | STRING | Report Name | PK. Unique with `realm_id`.  |
| `report_time` | TIMESTAMP | Report Time | When QuickBooks produced the snapshot. |
| `report_basis` | STRING | Report Basis | Cash or Accrual (absent on aging reports). |
| `start_period` | DATE | Start Period | |
| `end_period` | DATE | End Period | |
| `summarize_columns_by` | STRING | Summarize Columns By | |
| `currency` | STRING | Currency | |
| `header_options` | JSON | Header Options | Name/Value pairs; NoReportData=true means an empty report. |
| `report_rows` | JSON | Report Rows | Nested Section/Data rows as JSON. Flatten in SQL; ColData.id is the Account/Customer/Vendor Id. |
| `report_columns` | JSON | Report Columns | Column metadata (ColTitle, ColType) as JSON; index-aligned with every ColData array. |

# Example Questions

- How much is owed to us, in which aging bucket, by customer?
- Which customers slipped from 1–30 days into 31–60 days this month?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — One snapshot row per report period; the figures are inside `report_rows`.
