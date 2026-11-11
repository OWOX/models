---
title: "Items"
description: |
  Products and services sold or bought, with price, cost, quantity on hand and the income and expense accounts each one posts to. Joining items to invoice lines turns revenue into margin.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item"
    title: "Intuit QuickBooks Online API reference — Items"
---

## Connector endpoint

- **Endpoint:** QuickBooks Online · `item`
- **Default destination table:** `quickbooks_item`
- **Unique keys:** `realm_id`, `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). |
| `realm_id` | STRING | Realm ID | PK. FK to [Company info](./company-info.md). Company (realm) id, stamped from the RealmId parameter. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | TIMESTAMP | Create Time | |
| `last_updated_time` | TIMESTAMP | Last Updated Time | Incremental cursor. |
| `name` | STRING | Name | |
| `fully_qualified_name` | STRING | Fully Qualified Name | |
| `sku` | STRING | SKU | |
| `type` | STRING | Type | Inventory, NonInventory, Service, Category, Group… |
| `description` | STRING | Description | |
| `unit_price` | FLOAT | Unit Price | |
| `purchase_cost` | FLOAT | Purchase Cost | |
| `qty_on_hand` | FLOAT | Qty On Hand | |
| `taxable` | BOOLEAN | Taxable | |
| `track_qty_on_hand` | BOOLEAN | Track Qty On Hand | |
| `income_account_id` | STRING | Income Account ID | FK to [Accounts](./accounts.md). |
| `income_account_name` | STRING | Income Account Name | |
| `expense_account_id` | STRING | Expense Account ID | FK to [Accounts](./accounts.md). |
| `expense_account_name` | STRING | Expense Account Name | |
| `asset_account_id` | STRING | Asset Account ID | |
| `asset_account_name` | STRING | Asset Account Name | |
| `sub_item` | BOOLEAN | Sub Item | |
| `parent_id` | STRING | Parent ID | The parent item's or category's `id` in this same table, within the same `realm_id`. `parent_name` and `fully_qualified_name` already carry the hierarchy. |
| `parent_name` | STRING | Parent Name | |
| `active` | BOOLEAN | Active | |

# Example Questions

- Which products and services sell most by quantity and by revenue?
- What is the margin per item once its income and expense accounts are joined?
- Which inventory items are below their reorder point?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1]
- [Accounts](./accounts.md) — `income_account_id = id`, `realm_id = realm_id` [N:1] — Where sales of the item are booked.
- [Accounts](./accounts.md) — `expense_account_id = id`, `realm_id = realm_id` [N:1] — Where purchases of the item are booked (COGS for inventory).
