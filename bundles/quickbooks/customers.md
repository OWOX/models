---
title: "Customers"
description: |
  Everyone the company sells to, including sub-customers and projects, with open balance, terms, currency and billing address.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer"
    title: "Intuit QuickBooks Online API reference — Customers"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `customer`
- **Default destination table:** `quickbooks_customer`
- **Unique keys:** `realm_id`, `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). |
| `realm_id` | STRING | Realm ID | PK. FK to [Company info](./company-info.md). Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `display_name` | STRING | Display Name | |
| `company_name` | STRING | Company Name | |
| `given_name` | STRING | Given Name | |
| `family_name` | STRING | Family Name | |
| `primary_email` | STRING | Primary Email | |
| `primary_phone` | STRING | Primary Phone | |
| `balance` | FLOAT | Balance | Open A/R balance for the customer. |
| `balance_with_jobs` | FLOAT | Balance With Jobs | |
| `currency_id` | STRING | Currency ID | |
| `currency_name` | STRING | Currency Name | |
| `taxable` | BOOLEAN | Taxable | |
| `job` | BOOLEAN | Job | True for sub-customers (projects). |
| `parent_id` | STRING | Parent ID | FK to [Customers](./customers.md). |
| `parent_name` | STRING | Parent Name | |
| `payment_method_id` | STRING | Payment Method ID | |
| `payment_method_name` | STRING | Payment Method Name | |
| `sales_term_id` | STRING | Sales Term ID | |
| `sales_term_name` | STRING | Sales Term Name | |
| `bill_addr_city` | STRING | Bill Addr City | |
| `bill_addr_country` | STRING | Bill Addr Country | |
| `bill_addr_postal_code` | STRING | Bill Addr Postal Code | |
| `bill_addr` | JSON | Bill Addr | Full billing address as JSON. |
| `active` | BOOLEAN | Active | |

# Example Questions

- Which `customers` owe money right now, and how much is on sub-customer projects?
- How many active customers were added each month, and from which parent accounts?
- Which customers are taxable and on which sales terms?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
- [Customers](./customers.md) — `parent_id = id` [N:1] — Sub-customer (project) to its parent customer.
