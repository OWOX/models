---
title: "Vendors"
description: |
  Everyone the company buys from, with open payable balance, terms and currency.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendor"
    title: "Intuit QuickBooks Online Accounting API reference — vendor"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `vendor`
- **Default destination table:** `quickbooks_vendor`
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `display_name` | STRING | Display Name | Name shown on forms and lists, unique across customers, vendors and employees in the company. |
| `company_name` | STRING | Company Name | Business name of the vendor. |
| `primary_email` | STRING | Primary Email | Primary email address of the vendor. |
| `primary_phone` | STRING | Primary Phone | Primary phone number of the vendor. |
| `balance` | FLOAT | Balance | Open A/P balance owed to the vendor. |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `vendor_1099` | BOOLEAN | Vendor 1099 | True when the vendor is tracked for 1099 tax reporting. |
| `acct_num` | STRING | Acct Num | Account number the vendor uses for the company; optional and can be empty. |
| `term_id` | STRING | Term ID | Id of the payment terms agreed with the vendor; joins to the QuickBooks terms list. |
| `term_name` | STRING | Term Name | Name of the payment terms that term_id points to. |
| `bill_addr_country` | STRING | Bill Addr Country | Country of the vendor's billing address. |
| `bill_addr` | JSON | Bill Addr | Billing address as JSON: line1 to line5, city, country subdivision, postal code and country. |
| `active` | BOOLEAN | Active | True when the record is active; false when it has been made inactive (QuickBooks never hard-deletes lists). |

# Example Questions

- Which `vendors` do we owe, and how much per vendor?
- How many vendors have been added or deactivated this year?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
