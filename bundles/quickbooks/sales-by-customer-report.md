---
title: "Sales by Customer report"
description: |
  Sales per customer for the period, as QuickBooks reports it.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/report-entities/customersales"
    title: "Intuit QuickBooks Online API reference — Sales by Customer report"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `customer_sales`
- **Default destination table:** `quickbooks_report_customer_sales`
- **Unique keys:** `realm_id`, `report_name`, `start_period`, `end_period`, `accounting_method_param`
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
| `accounting_method_param` | STRING | Accounting Method Param | AccountingMethod parameter used for the request (ReportBasis echoes it). |
| `report_rows` | JSON | Report Rows | Nested Section/Data rows as JSON. Flatten in SQL; ColData.id is the Account/Customer/Vendor Id. |
| `report_columns` | JSON | Report Columns | Column metadata (ColTitle, ColType) as JSON; index-aligned with every ColData array. |

# Example Questions

- Which customers generated the most sales in the period?
- How concentrated is revenue among the top customers?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — One snapshot row per report period; the figures are inside `report_rows`.
