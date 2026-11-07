---
title: "Preferences"
description: |
  How the company's books are set up: the home currency, whether multicurrency, class tracking, department tracking and sales tax are on, the fiscal-year start month and the book close date, plus the sales-form, vendor and product preference settings as JSON. One row per company.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/preferences"
    title: "Intuit QuickBooks Online Accounting API reference — preferences"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `preferences`
- **Default destination table:** `quickbooks_preferences`
- **Unique keys:** `realm_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | PK. Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP |  |
| `last_updated_time` | TIMESTAMP | Incremental cursor. |
| `home_currency` | STRING |  |
| `multi_currency_enabled` | BOOLEAN |  |
| `class_tracking_per_txn` | BOOLEAN |  |
| `class_tracking_per_txn_line` | BOOLEAN |  |
| `track_departments` | BOOLEAN |  |
| `first_month_of_fiscal_year` | STRING |  |
| `book_close_date` | DATE |  |
| `tax_year_month` | STRING |  |
| `using_sales_tax` | BOOLEAN |  |
| `sales_forms_prefs` | JSON |  |
| `vendor_and_purchases_prefs` | JSON |  |
| `product_and_services_prefs` | JSON |  |

# Example Questions

- Does this company track classes, departments and multicurrency, and what is its home currency?
- What are the company's fiscal-year start month and book close date?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [1:1] — The company these preferences belong to; one row each.
  - Description: The company these preferences belong to; one row each.
