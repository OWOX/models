---
title: "Customers"
description: |
  Everyone the company sells to, including sub-customers and projects, with open balance, terms, currency and billing address. A sub-customer or project names its parent customer in `parent_id`; that self-reference is not drawn as a join.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer"
    title: "Intuit QuickBooks Online Accounting API reference — Customers"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `customer`
- **Default destination table:** `quickbooks_customer`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `job` | BOOLEAN | Job | True for sub-customers (projects). |
| `active` | BOOLEAN | Active | True when the record is active; false when it has been made inactive (QuickBooks never hard-deletes lists). |
| `balance` | FLOAT | Balance | Open A/R balance for the customer. |
| `taxable` | BOOLEAN | Taxable | True when the record is subject to sales tax. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `bill_addr` | STRING | Bill Addr | Full billing address as JSON. Stored as a JSON string. |
| `parent_id` | STRING | Parent ID | Id of the parent record in the same table (the parent account, customer or item); empty for top-level records. |
| `given_name` | STRING | Given Name | First name of the customer contact. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `family_name` | STRING | Family Name | Last name of the customer contact. |
| `parent_name` | STRING | Parent Name | Name of the parent record that parent_id points to. |
| `company_name` | STRING | Company Name | Business name of the customer. |
| `display_name` | STRING | Display Name | Name shown on forms and lists, unique across customers, vendors and employees in the company. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `primary_email` | STRING | Primary Email | Primary email address of the customer. |
| `primary_phone` | STRING | Primary Phone | Primary phone number of the customer. |
| `sales_term_id` | STRING | Sales Term ID | Id of the payment terms applied (for example Net 30); joins to the QuickBooks terms list. |
| `bill_addr_city` | STRING | Bill Addr City | City of the billing address. |
| `sales_term_name` | STRING | Sales Term Name | Name of the payment terms that sales_term_id points to. |
| `balance_with_jobs` | FLOAT | Balance With Jobs | Open balance of the customer including all of its sub-customers and jobs, in the home currency. |
| `bill_addr_country` | STRING | Bill Addr Country | Country of the customer's billing address. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |
| `payment_method_id` | STRING | Payment Method ID | Id of the preferred payment method; joins to the QuickBooks payment method list. |
| `payment_method_name` | STRING | Payment Method Name | Name of the preferred payment method that payment_method_id points to, for example Cash or Check. |
| `bill_addr_postal_code` | STRING | Bill Addr Postal Code | Postal or ZIP code of the billing address. |

# Example Questions

- Which `customers` owe money right now, and how much is on sub-customer projects?
- How many active customers were added each month, and from which parent `accounts`?
- Which customers are taxable and on which sales terms?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
