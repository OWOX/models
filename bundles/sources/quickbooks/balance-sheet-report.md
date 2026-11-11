---
title: "Balance Sheet report"
description: |
  The Balance Sheet as QuickBooks computes it: assets, liabilities and equity at each period end, one snapshot per period.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/report-entities/balancesheet"
    title: "Intuit QuickBooks Online Accounting API reference — Balance Sheet report"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `balance_sheet`
- **Default destination table:** `quickbooks_report_balance_sheet`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `report_name`, `start_period`, `end_period`, `accounting_method_param`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `currency` | STRING | Currency | Currency code the report amounts are in. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `end_period` | DATE | End Period | PK. Last day of the reporting period. |
| `report_name` | STRING | Report Name | PK. Name of the QuickBooks report, for example ProfitAndLoss. |
| `report_rows` | STRING | Report Rows | Nested Section/Data rows as JSON. Flatten in SQL; ColData.id is the Account/Customer/Vendor Id. Stored as a JSON string. |
| `report_time` | DATETIME | Report Time | When QuickBooks produced the snapshot. |
| `report_basis` | STRING | Report Basis | Cash or Accrual (absent on aging reports). |
| `start_period` | DATE | Start Period | PK. First day of the reporting period. |
| `header_options` | STRING | Header Options | Name/Value pairs; NoReportData=true means an empty report. Stored as a JSON string. |
| `report_columns` | STRING | Report Columns | Column metadata (ColTitle, ColType) as JSON; index-aligned with every ColData array. Stored as a JSON string. |
| `summarize_columns_by` | STRING | Summarize Columns By | How the report columns are split, for example Total, Month or Customers. |
| `accounting_method_param` | STRING | Accounting Method Param | PK. AccountingMethod parameter used for the request (ReportBasis echoes it). |

# Example Questions

- What are assets, liabilities and equity at each month end?
- How did cash, receivables and payables move month over month?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the report snapshot belongs to. One snapshot row per report period; the figures are inside report_rows.
