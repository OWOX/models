---
title: "Balance Sheet report"
description: |
  The Balance Sheet as QuickBooks computes it: assets, liabilities and equity at each period end, one snapshot per period.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/report-entities/balancesheet"
    title: "Intuit QuickBooks Online Accounting API reference — balancesheet"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `balance_sheet`
- **Default destination table:** `quickbooks_report_balance_sheet`
- **Unique keys:** `realm_id`, `report_name`, `start_period`, `end_period`, `accounting_method_param`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `realm_id` | STRING | PK. |
| `report_name` | STRING | PK. |
| `report_time` | TIMESTAMP | When QuickBooks produced the snapshot. |
| `report_basis` | STRING | Cash or Accrual (absent on aging reports). |
| `start_period` | DATE | PK. |
| `end_period` | DATE | PK. |
| `summarize_columns_by` | STRING |  |
| `currency` | STRING |  |
| `header_options` | JSON | Name/Value pairs; NoReportData=true means an empty report. |
| `accounting_method_param` | STRING | PK. AccountingMethod parameter used for the request (ReportBasis echoes it). |
| `report_rows` | JSON | Nested Section/Data rows as JSON. Flatten in SQL; ColData.id is the Account/Customer/Vendor Id. |
| `report_columns` | JSON | Column metadata (ColTitle, ColType) as JSON; index-aligned with every ColData array. |

# Example Questions

- What are assets, liabilities and equity at each month end?
- How did cash, receivables and payables move month over month?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the report snapshot belongs to. One snapshot row per report period; the figures are inside report_rows.
  - Description: The company the report snapshot belongs to. One snapshot row per report period; the figures are inside report_rows.
