---
title: "A/P Aging Summary report"
description: |
  A/P Aging Summary: what the company owes each vendor, split into aging buckets, as of the report date.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/report-entities/agedpayables"
    title: "Intuit QuickBooks Online Accounting API reference — agedpayables"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `aged_payables`
- **Default destination table:** `quickbooks_report_aged_payables`
- **Unique keys:** `realm_id`, `report_name`, `start_period`, `end_period`
- **Time series:** yes, loaded by date range

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
| `report_rows` | JSON | Nested Section/Data rows as JSON. Flatten in SQL; ColData.id is the Account/Customer/Vendor Id. |
| `report_columns` | JSON | Column metadata (ColTitle, ColType) as JSON; index-aligned with every ColData array. |

# Example Questions

- How much do we owe, in which aging bucket, by vendor?
- Which vendor balances are past 60 days?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the report snapshot belongs to. One snapshot row per report period; the figures are inside report_rows.
  - Description: The company the report snapshot belongs to. One snapshot row per report period; the figures are inside report_rows.
