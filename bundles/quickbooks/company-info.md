---
title: "Company info"
description: |
  The company file itself: legal and trading name, country, base currency and fiscal-year start. One row per QuickBooks company; every other table joins to it on `realm_id`.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo"
    title: "Intuit QuickBooks Online API reference — Company info"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `company_info`
- **Default destination table:** `quickbooks_company_info`
- **Unique keys:** `realm_id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `company_name` | STRING | Company Name | |
| `legal_name` | STRING | Legal Name | |
| `country` | STRING | Country | |
| `company_start_date` | DATE | Company Start Date | |
| `fiscal_year_start_month` | STRING | Fiscal Year Start Month | |
| `email` | STRING | Email | |
| `company_addr_country` | STRING | Company Addr Country | |
| `company_addr` | JSON | Company Addr | |
| `supported_languages` | STRING | Supported Languages | |
| `name_value` | JSON | Name Value | Extra settings as Name/Value pairs (industry type, subscription status…). |

# Example Questions

- Which company and fiscal-year start do these books belong to, and in what base currency?
- Has the company name or address changed since the last load?
