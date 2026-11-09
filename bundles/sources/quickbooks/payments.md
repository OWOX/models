---
title: "Payments"
description: |
  Money received from customers and how it was applied to invoices. The `line` JSON names the invoices each payment settles.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment"
    title: "Intuit QuickBooks Online Accounting API reference — payment"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `payment`
- **Default destination table:** `quickbooks_payment`
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
| `txn_date` | DATE | Txn Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amt | Total amount of the document including tax, in the document currency. |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `unapplied_amt` | FLOAT | Unapplied Amt | Part of the payment not yet applied to any invoice; it stays as customer credit. |
| `customer_id` | STRING | Customer ID | Id of the customer on the document; joins to customer.id. |
| `customer_name` | STRING | Customer Name | Name of the customer that customer_id points to. |
| `deposit_to_account_id` | STRING | Deposit To Account ID | Id of the account the money is deposited to; joins to account.id. |
| `deposit_to_account_name` | STRING | Deposit to Account Name | Name of the account that deposit_to_account_id points to. |
| `payment_method_id` | STRING | Payment Method ID | Id of the preferred payment method; joins to the QuickBooks payment method list. |
| `payment_method_name` | STRING | Payment Method Name | Name of the preferred payment method that payment_method_id points to, for example Cash or Check. |
| `payment_ref_num` | STRING | Payment Ref Num | Check or reference number. |
| `process_payment` | BOOLEAN | Process Payment | True when the payment is to be processed through QuickBooks Payments. |
| `line` | JSON | Line | Line\[\] as JSON; each line has Amount and LinkedTxn\[\] {TxnId, TxnType} pointing at the Invoice it settles. |

# Example Questions

- How much cash came in per month, by payment method and deposit account?
- Which payments are unapplied or only partly applied to invoices?
- Which customers pay late most often?

## Joins

- [Customers](./customers.md) — `realm_id = realm_id`, `customer_id = id` [N:1] — The customer the document is for.
  - Description: The customer the document is for.
- [Accounts](./accounts.md) — `realm_id = realm_id`, `deposit_to_account_id = id` [N:1] — Bank or Undeposited Funds account the payment landed in.
  - Description: Bank or Undeposited Funds account the payment landed in.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
