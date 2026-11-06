---
title: "Items"
description: |
  Products and services sold or bought, with price, cost, quantity on hand and the income and expense accounts each one posts to. Joining items to invoice lines turns revenue into margin. A sub-item names its parent item in `parent_id`; that self-reference is not drawn as a join.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item"
    title: "Intuit QuickBooks Online Accounting API reference — item"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `item`
- **Default destination table:** `quickbooks_item`
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
| `name` | STRING |  |
| `fully_qualified_name` | STRING |  |
| `sku` | STRING |  |
| `type` | STRING | Inventory, NonInventory, Service, Category, Group… |
| `description` | STRING |  |
| `unit_price` | FLOAT |  |
| `purchase_cost` | FLOAT |  |
| `qty_on_hand` | FLOAT |  |
| `taxable` | BOOLEAN |  |
| `track_qty_on_hand` | BOOLEAN |  |
| `income_account_id` | STRING |  |
| `income_account_name` | STRING |  |
| `expense_account_id` | STRING |  |
| `expense_account_name` | STRING |  |
| `asset_account_id` | STRING |  |
| `asset_account_name` | STRING |  |
| `sub_item` | BOOLEAN |  |
| `parent_id` | STRING |  |
| `parent_name` | STRING |  |
| `active` | BOOLEAN |  |

# Example Questions

- Which products and services sell most by quantity and by revenue?
- What is the margin per item once its income and expense accounts are joined?
- Which inventory items are below their reorder point?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
- [Accounts](./accounts.md) — `realm_id = realm_id`, `income_account_id = id` [N:1] — The account where sales of the item are booked. `expense_account_id` holds the account where purchases of the item are booked (cost of goods for inventory), joined to Accounts the same way.
  - Description: The account where sales of the item are booked. `expense_account_id` holds the account where purchases of the item are booked (cost of goods for inventory), joined to Accounts the same way.
