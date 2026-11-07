---
title: "Bill payments"
description: |
  Payments made against bills, by check or credit card, with the vendor and the accounts involved.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/billpayment"
    title: "Intuit QuickBooks Online Accounting API reference — billpayment"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `bill_payment`
- **Default destination table:** `quickbooks_bill_payment`
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
| `doc_number` | STRING |  |
| `txn_date` | DATE | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT |  |
| `currency_id` | STRING |  |
| `currency_name` | STRING |  |
| `exchange_rate` | FLOAT |  |
| `private_note` | STRING |  |
| `pay_type` | STRING | Check or CreditCard. |
| `vendor_id` | STRING |  |
| `vendor_name` | STRING |  |
| `ap_account_id` | STRING |  |
| `ap_account_name` | STRING |  |
| `check_bank_account_id` | STRING |  |
| `check_bank_account_name` | STRING |  |
| `check_print_status` | STRING |  |
| `credit_card_account_id` | STRING |  |
| `credit_card_account_name` | STRING |  |
| `line` | JSON | Line\[\] as JSON; LinkedTxn\[\] {TxnId, TxnType=Bill} names the bills settled. |

# Example Questions

- How much was paid to vendors per month, by check and by card?
- Which vendors received the largest payments, and from which accounts?

## Joins

- [Vendors](./vendors.md) — `realm_id = realm_id`, `vendor_id = id` [N:1] — The vendor the document is for.
  - Description: The vendor the document is for.
- [Accounts](./accounts.md) — `realm_id = realm_id`, `ap_account_id = id` [N:1] — The Accounts Payable account the payment is booked against. `check_bank_account_id` (the bank account of a check payment) and `credit_card_account_id` (the card account of a card payment) also hold account ids, each joined to Accounts the same way.
  - Description: The Accounts Payable account the payment is booked against. `check_bank_account_id` (the bank account of a check payment) and `credit_card_account_id` (the card account of a card payment) also hold account ids, each joined to Accounts the same way.
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
  - Description: The company the row belongs to.
