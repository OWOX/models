---
title: "Items"
description: |
  Products and services sold or bought, with price, cost, quantity on hand and the income and expense accounts each one posts to. Joining items to invoice lines turns revenue into margin. A sub-item names its parent item in `parent_id`; that self-reference is not drawn as a join.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item"
    title: "Intuit QuickBooks Online Accounting API reference — Items"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `item`
- **Default destination table:** `quickbooks_item`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `sku` | STRING | SKU | Stock keeping unit code of the item. |
| `name` | STRING | Name | Name of the product or service as shown on sales forms. |
| `type` | STRING | Type | Inventory, NonInventory, Service, Category, Group… |
| `active` | BOOLEAN | Active | True when the record is active; false when it has been made inactive (QuickBooks never hard-deletes lists). |
| `taxable` | BOOLEAN | Taxable | True when the record is subject to sales tax. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `sub_item` | BOOLEAN | Sub Item | True when the item is a sub-item of another item (see parent_id). |
| `parent_id` | STRING | Parent ID | Id of the parent record in the same table (the parent account, customer or item); empty for top-level records. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `unit_price` | FLOAT | Unit Price | Default selling price per unit, in the home currency. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `description` | STRING | Description | Description of the item shown on sales forms. |
| `parent_name` | STRING | Parent Name | Name of the parent record that parent_id points to. |
| `qty_on_hand` | FLOAT | Quantity On Hand | Current stock quantity of an inventory item. |
| `purchase_cost` | FLOAT | Purchase Cost | Default cost per unit when buying the item, in the home currency. |
| `asset_account_id` | STRING | Asset Account ID | Id of the inventory asset account that tracks the current value of the item's stock; required for inventory and assembly items. |
| `income_account_id` | STRING | Income Account ID | Id of the income account that sales of the item are posted to; joins to account.id. FK to [Accounts](./accounts.md) |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads every record, whatever this time. |
| `track_qty_on_hand` | BOOLEAN | Track Quantity On Hand | True when the item is an inventory item with tracked stock quantity. |
| `asset_account_name` | STRING | Asset Account Name | Name of the account that asset_account_id points to. |
| `expense_account_id` | STRING | Expense Account ID | Id of the expense or cost of goods sold account that purchases of the item are posted to; joins to account.id. FK to [Accounts](./accounts.md) |
| `income_account_name` | STRING | Income Account Name | Name of the account that income_account_id points to. |
| `expense_account_name` | STRING | Expense Account Name | Name of the account that expense_account_id points to. |
| `fully_qualified_name` | STRING | Fully Qualified Name | Full path of the item including its parents, separated by colons (Parent:Child). |

# Example Questions

- Which products and services sell most by quantity and by revenue?
- What is the margin per item once its income and expense `accounts` are joined?
- Which items that track quantity on hand have zero or negative stock?

## Joins

- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
- [Accounts](./accounts.md) as `income_account` — `realm_id = realm_id` AND `income_account_id = id` [N:1] — The account where sales of the item are booked.
  - [Income Account Company info](./company-info.md)
- [Accounts](./accounts.md) as `expense_account` — `realm_id = realm_id` AND `expense_account_id = id` [N:1] — The account where purchases of the item are booked (cost of goods for inventory).
  - [Expense Account Company info](./company-info.md)
