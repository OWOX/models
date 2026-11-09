---
title: "Vendor Expenses report"
description: |
  Spend per vendor for the period, as QuickBooks reports it.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/report-entities/vendorexpenses"
    title: "Intuit QuickBooks Online Accounting API reference — vendorexpenses"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `vendor_expenses`
- **Default destination table:** `quickbooks_report_vendor_expenses`
- **Unique keys:** `realm_id`, `report_name`, `start_period`, `end_period`, `accounting_method_param`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. |
| `report_name` | STRING | Report Name | PK. Name of the QuickBooks report, for example ProfitAndLoss. |
| `report_time` | TIMESTAMP | Report Time | When QuickBooks produced the snapshot. |
| `report_basis` | STRING | Report Basis | Cash or Accrual (absent on aging reports). |
| `start_period` | DATE | Start Period | PK. First day of the reporting period. |
| `end_period` | DATE | End Period | PK. Last day of the reporting period. |
| `summarize_columns_by` | STRING | Summarize Columns by | How the report columns are split, for example Total, Month or Customers. |
| `currency` | STRING | Currency | Currency code the report amounts are in. |
| `header_options` | JSON | Header Options | Name/Value pairs; NoReportData=true means an empty report. |
| `accounting_method_param` | STRING | Accounting Method Param | PK. AccountingMethod parameter used for the request (ReportBasis echoes it). |
| `report_rows` | JSON | Report Rows | Nested Section/Data rows as JSON. Flatten in SQL; ColData.id is the Account/Customer/Vendor Id. |
| `report_columns` | JSON | Report Columns | Column metadata (ColTitle, ColType) as JSON; index-aligned with every ColData array. |

# Example Questions

- Which vendors account for most of the spend in the period?
- How did spend per vendor change versus the previous period?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the report snapshot belongs to. One snapshot row per report period; the figures are inside report_rows.
  - Description: The company the report snapshot belongs to. One snapshot row per report period; the figures are inside report_rows.
