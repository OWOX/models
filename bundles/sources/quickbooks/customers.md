---
title: "Customers"
description: |
  Everyone the company sells to, including sub-customers and projects, with open balance, terms, currency and billing address. A sub-customer or project names its parent customer in `parent_id`; that self-reference is not drawn as a join.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer"
    title: "Intuit QuickBooks Online Accounting API reference — customer"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `customer`
- **Default destination table:** `quickbooks_customer`
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | PK. Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP |  |
| `last_updated_time` | TIMESTAMP | Incremental cursor. |
| `display_name` | STRING |  |
| `company_name` | STRING |  |
| `given_name` | STRING |  |
| `family_name` | STRING |  |
| `primary_email` | STRING |  |
| `primary_phone` | STRING |  |
| `balance` | FLOAT | Open A/R balance for the customer. |
| `balance_with_jobs` | FLOAT |  |
| `currency_id` | STRING |  |
| `currency_name` | STRING |  |
| `taxable` | BOOLEAN |  |
| `job` | BOOLEAN | True for sub-customers (projects). |
| `parent_id` | STRING |  |
| `parent_name` | STRING |  |
| `payment_method_id` | STRING |  |
| `payment_method_name` | STRING |  |
| `sales_term_id` | STRING |  |
| `sales_term_name` | STRING |  |
| `bill_addr_city` | STRING |  |
| `bill_addr_country` | STRING |  |
| `bill_addr_postal_code` | STRING |  |
| `bill_addr` | JSON | Full billing address as JSON. |
| `active` | BOOLEAN |  |

# Example Questions

- Which `customers` owe money right now, and how much is on sub-customer projects?
- How many active customers were added each month, and from which parent accounts?
- Which customers are taxable and on which sales terms?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
