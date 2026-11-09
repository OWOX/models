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

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `home_currency` | STRING | Home Currency | Home currency code of the company, for example USD. |
| `multi_currency_enabled` | BOOLEAN | Multi Currency Enabled | True when multicurrency is turned on, so documents can use currencies other than the home currency. |
| `class_tracking_per_txn` | BOOLEAN | Class Tracking per Txn | True when classes are tracked on the whole transaction. |
| `class_tracking_per_txn_line` | BOOLEAN | Class Tracking per Txn Line | True when classes are tracked on each transaction line. |
| `track_departments` | BOOLEAN | Track Departments | True when departments (locations) are tracked. |
| `first_month_of_fiscal_year` | STRING | First Month of Fiscal Year | First month of the fiscal year, as a month name. |
| `book_close_date` | DATE | Book Close Date | Closing date of the books; transactions dated on or before it are protected from changes. |
| `tax_year_month` | STRING | Tax Year Month | First month of the income tax year, as a month name. |
| `using_sales_tax` | BOOLEAN | Using Sales Tax | True when the company uses sales tax. |
| `sales_forms_prefs` | JSON | Sales Forms Prefs | Sales form preferences as JSON: default terms, shipping, discounts, deposits and custom fields. |
| `vendor_and_purchases_prefs` | JSON | Vendor and Purchases Prefs | Vendor and purchase preferences as JSON: bill payment, purchase order and expense tracking settings. |
| `product_and_services_prefs` | JSON | Product and Services Prefs | Product and service preferences as JSON: inventory tracking, quantity on hand and price rules. |

# Example Questions

- Does this company track classes, departments and multicurrency, and what is its home currency?
- What are the company's fiscal-year start month and book close date?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [1:1] — The company these preferences belong to; one row each.
  - Description: The company these preferences belong to; one row each.
