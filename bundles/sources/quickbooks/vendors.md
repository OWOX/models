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

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `realm_id` | STRING | PK. Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP |  |
| `last_updated_time` | TIMESTAMP | Incremental cursor. |
| `display_name` | STRING |  |
| `company_name` | STRING |  |
| `primary_email` | STRING |  |
| `primary_phone` | STRING |  |
| `balance` | FLOAT | Open A/P balance owed to the vendor. |
| `currency_id` | STRING |  |
| `currency_name` | STRING |  |
| `vendor_1099` | BOOLEAN |  |
| `acct_num` | STRING |  |
| `term_id` | STRING |  |
| `term_name` | STRING |  |
| `bill_addr_country` | STRING |  |
| `bill_addr` | JSON |  |
| `active` | BOOLEAN |  |

# Example Questions

- Which `vendors` do we owe, and how much per vendor?
- How many vendors have been added or deactivated this year?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
