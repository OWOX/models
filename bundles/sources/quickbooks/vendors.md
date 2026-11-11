---
title: "Vendors"
description: |
  Everyone the company buys from, with open payable balance, terms and currency.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendor"
    title: "Intuit QuickBooks Online Accounting API reference — Vendors"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `vendor`
- **Default destination table:** `quickbooks_vendor`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `active` | BOOLEAN | Active | True when the record is active; false when it has been made inactive (QuickBooks never hard-deletes lists). |
| `balance` | FLOAT | Balance | Open A/P balance owed to the vendor. |
| `term_id` | STRING | Term ID | Id of the payment terms agreed with the vendor; joins to the QuickBooks terms list. |
| `acct_num` | STRING | Acct Num | Account number the vendor uses for the company; optional and can be empty. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `bill_addr` | STRING | Bill Addr | Billing address as JSON: line1 to line5, city, country subdivision, postal code and country. Stored as a JSON string. |
| `term_name` | STRING | Term Name | Name of the payment terms that term_id points to. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `vendor_1099` | BOOLEAN | Vendor 1099 | True when the vendor is tracked for 1099 tax reporting. |
| `company_name` | STRING | Company Name | Business name of the vendor. |
| `display_name` | STRING | Display Name | Name shown on forms and lists, unique across customers, vendors and employees in the company. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `primary_email` | STRING | Primary Email | Primary email address of the vendor. |
| `primary_phone` | STRING | Primary Phone | Primary phone number of the vendor. |
| `bill_addr_country` | STRING | Bill Addr Country | Country of the vendor's billing address. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |

# Example Questions

- Which `vendors` do we owe, and how much per vendor?
- How many vendors have been added or deactivated this year?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
