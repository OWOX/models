---
title: "Preferences"
description: |
  How the company keeps its books: accrual or cash basis, whether classes, departments and multicurrency are on, default accounts and terms. One row per company.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/preferences"
    title: "Intuit QuickBooks Online API reference — Preferences"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `preferences`
- **Default destination table:** `quickbooks_preferences`
- **Unique keys:** `realm_id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | Realm ID | PK. FK to [Company info](./company-info.md). Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `home_currency` | STRING | Home Currency | |
| `multi_currency_enabled` | BOOLEAN | Multi Currency Enabled | |
| `class_tracking_per_txn` | BOOLEAN | Class Tracking Per Txn | |
| `class_tracking_per_txn_line` | BOOLEAN | Class Tracking Per Txn Line | |
| `track_departments` | BOOLEAN | Track Departments | |
| `first_month_of_fiscal_year` | STRING | First Month Of Fiscal Year | |
| `book_close_date` | DATE | Book Close Date | |
| `tax_year_month` | STRING | Tax Year Month | |
| `using_sales_tax` | BOOLEAN | Using Sales Tax | |
| `sales_forms_prefs` | JSON | Sales Forms Prefs | |
| `vendor_and_purchases_prefs` | JSON | Vendor And Purchases Prefs | |
| `product_and_services_prefs` | JSON | Product And Services Prefs | |

# Example Questions

- Does this company run on accrual or cash accounting, and does it track classes, departments and multicurrency?
- Which default accounts and sales terms do new transactions pick up?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [1:1]
