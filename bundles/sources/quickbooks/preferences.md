---
title: "Preferences"
description: |
  How the company's books are set up: the home currency, whether multicurrency, class tracking, department tracking and sales tax are on, the fiscal-year start month and the book close date, plus the sales-form, vendor and product preference settings as JSON. One row per company.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/preferences"
    title: "Intuit QuickBooks Online Accounting API reference — Preferences"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `preferences`
- **Default destination table:** `quickbooks_preferences`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `home_currency` | STRING | Home Currency | Home currency code of the company, for example USD. |
| `tax_year_month` | STRING | Tax Year Month | First month of the income tax year, as a month name. |
| `book_close_date` | DATE | Book Close Date | Closing date of the books; transactions dated on or before it are protected from changes. |
| `using_sales_tax` | BOOLEAN | Using Sales Tax | True when the company uses sales tax. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads every record, whatever this time. |
| `sales_forms_prefs` | STRING | Sales Forms Prefs | Sales form preferences as JSON: default terms, shipping, discounts, deposits and custom fields. Stored as a JSON string. |
| `track_departments` | BOOLEAN | Track Departments | True when departments (locations) are tracked. |
| `class_tracking_per_txn` | BOOLEAN | Class Tracking Per Transaction | True when classes are tracked on the whole transaction. |
| `multi_currency_enabled` | BOOLEAN | Multi Currency Enabled | True when multicurrency is turned on, so documents can use currencies other than the home currency. |
| `first_month_of_fiscal_year` | STRING | First Month Of Fiscal Year | First month of the fiscal year, as a month name. |
| `product_and_services_prefs` | STRING | Product And Services Prefs | Product and service preferences as JSON: inventory tracking, quantity on hand and price rules. Stored as a JSON string. |
| `vendor_and_purchases_prefs` | STRING | Vendor And Purchases Prefs | Vendor and purchase preferences as JSON: bill payment, purchase order and expense tracking settings. Stored as a JSON string. |
| `class_tracking_per_txn_line` | BOOLEAN | Class Tracking Per Transaction Line | True when classes are tracked on each transaction line. |

# Example Questions

- Does this company track classes, departments and multicurrency, and what is its home currency?
- What are the company's fiscal-year start month and book close date?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [1:1] — The company these preferences belong to; one row each.
