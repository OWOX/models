---
title: "Company info"
description: |
  The company file itself: legal and trading name, country, address, first day of business and fiscal-year start month. One row per QuickBooks company; every other table joins to it on `realm_id`.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo"
    title: "Intuit QuickBooks Online Accounting API reference — Company info"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `company_info`
- **Default destination table:** `quickbooks_company_info`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | QuickBooks entity Id (string). Primary key together with realm_id. |
| `email` | STRING | Email | Company email address. |
| `country` | STRING | Country | Country of the company. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. |
| `legal_name` | STRING | Legal Name | Legal name of the company. |
| `name_value` | STRING | Name Value | Extra settings as Name/Value pairs (industry type, subscription status…). Stored as a JSON string. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `company_addr` | STRING | Company Addr | Company address as JSON: lines, city, country subdivision, postal code and country. Stored as a JSON string. |
| `company_name` | STRING | Company Name | Name the company uses for business, as shown on forms. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads every record, whatever this time. |
| `company_start_date` | DATE | Company Start Date | Date the company started, as set in QuickBooks. |
| `supported_languages` | STRING | Supported Languages | Languages the company file supports, as a comma-separated list of language codes. |
| `company_addr_country` | STRING | Company Addr Country | Country of the company address. |
| `fiscal_year_start_month` | STRING | Fiscal Year Start Month | Month the fiscal year starts, as a month name such as January. |

# Example Questions

- Which company and fiscal-year start do these books belong to, and where is the company based?
- Has the company name or address changed since the last load?
