---
title: "Vendors"
description: |
  Everyone the company buys from, with open payable balance, terms and currency.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendor"
    title: "Intuit QuickBooks Online API reference — Vendors"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `vendor`
- **Default destination table:** `quickbooks_vendor`
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
| `primary_email` | STRING | Primary Email | |
| `primary_phone` | STRING | Primary Phone | |
| `balance` | FLOAT | Balance | Open A/P balance owed to the vendor. |
| `currency_id` | STRING | Currency ID | |
| `currency_name` | STRING | Currency Name | |
| `vendor_1099` | BOOLEAN | Vendor 1099 | |
| `acct_num` | STRING | Acct Num | |
| `term_id` | STRING | Term ID | |
| `term_name` | STRING | Term Name | |
| `bill_addr_country` | STRING | Bill Addr Country | |
| `bill_addr` | JSON | Bill Addr | |
| `active` | BOOLEAN | Active | |

# Example Questions

- Which `vendors` do we owe, and how much per vendor?
- How many vendors have been added or deactivated this year?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
