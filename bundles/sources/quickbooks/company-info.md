---
title: "Company info"
description: |
  The company file itself: legal and trading name, country, base currency and fiscal-year start. One row per QuickBooks company; every other table joins to it on `realm_id`.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo"
    title: "Intuit QuickBooks Online Accounting API reference — companyinfo"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `company_info`
- **Default destination table:** `quickbooks_company_info`
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
| `company_name` | STRING |  |
| `legal_name` | STRING |  |
| `country` | STRING |  |
| `company_start_date` | DATE |  |
| `fiscal_year_start_month` | STRING |  |
| `email` | STRING |  |
| `company_addr_country` | STRING |  |
| `company_addr` | JSON |  |
| `supported_languages` | STRING |  |
| `name_value` | JSON | Extra settings as Name/Value pairs (industry type, subscription status…). |

# Example Questions

- Which company and fiscal-year start do these books belong to, and in what base currency?
- Has the company name or address changed since the last load?
