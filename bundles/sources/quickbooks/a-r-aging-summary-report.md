---
title: "A/R Aging Summary report"
description: |
  A/R Aging Summary: what each customer owes, split into current, 1–30, 31–60, 61–90 and over-90-day buckets, as of the report date.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/report-entities/agedreceivables"
    title: "Intuit QuickBooks Online Accounting API reference — agedreceivables"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `aged_receivables`
- **Default destination table:** `quickbooks_report_aged_receivables`
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

- How much is owed to us, in which aging bucket, by customer?
- Which customers slipped from 1–30 days into 31–60 days this month?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the report snapshot belongs to. One snapshot row per report period; the figures are inside report_rows.
  - Description: The company the report snapshot belongs to. One snapshot row per report period; the figures are inside report_rows.
