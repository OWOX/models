---
title: "Bill payments"
description: |
  Payments made against bills, by check or credit card, with the vendor and the accounts involved.
tags: ["owox", "connector", "quickbooks"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/billpayment"
    title: "Intuit QuickBooks Online Accounting API reference — Bill payments"
---

## Connector endpoint

- **Endpoint:** QuickBooks · `bill_payment`
- **Default destination table:** `quickbooks_bill_payment`
- **Manifest version:** 1.1
- **Unique keys:** `realm_id`, `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. QuickBooks entity Id (string). Primary key together with realm_id. |
| `line` | STRING | Line | Line[] as JSON; LinkedTxn[] {TxnId, TxnType=Bill} names the bills settled. Stored as a JSON string. |
| `pay_type` | STRING | Pay Type | Check or CreditCard. |
| `realm_id` | STRING | Realm ID | PK. Company (realm) id, stamped from the RealmId parameter. FK to [Company info](./company-info.md) |
| `txn_date` | DATE | Transaction Date | Business date of the transaction (not the edit date). |
| `total_amt` | FLOAT | Total Amount | Total amount paid, the sum of the payment's lines, in the document currency. |
| `vendor_id` | STRING | Vendor ID | Id of the vendor on the document; joins to vendor.id. FK to [Vendors](./vendors.md) |
| `doc_number` | STRING | Doc Number | Document number shown on the form (for example the invoice or bill number); can be empty when the company does not use automatic numbering. |
| `sync_token` | STRING | Sync Token | Version counter; changes on every edit. |
| `create_time` | DATETIME | Create Time | When the record was created in QuickBooks (UTC timestamp). |
| `currency_id` | STRING | Currency ID | Currency code of the document, for example USD; empty when multicurrency is off. |
| `vendor_name` | STRING | Vendor Name | Name of the vendor that vendor_id points to. |
| `private_note` | STRING | Private Note | Internal memo entered on the document; not shown to the customer or vendor. |
| `ap_account_id` | STRING | AP Account ID | Id of the accounts payable account the document is posted to; joins to account.id. FK to [Accounts](./accounts.md) |
| `currency_name` | STRING | Currency Name | Currency name that goes with currency_id, for example United States Dollar. |
| `exchange_rate` | FLOAT | Exchange Rate | Rate that converts the document currency to the company's home currency; 1 or empty when the document is in the home currency. |
| `ap_account_name` | STRING | AP Account Name | Name of the account that ap_account_id points to. |
| `last_updated_time` | DATETIME | Last Updated Time | When the record was last changed in QuickBooks (MetaData.LastUpdatedTime); the connector reads only records changed after its Load changes since setting. |
| `check_print_status` | STRING | Check Print Status | Print state of the check: NotSet, NeedToPrint or PrintComplete. |
| `check_bank_account_id` | STRING | Check Bank Account ID | Id of the bank account a check payment is drawn from; joins to account.id. FK to [Accounts](./accounts.md) |
| `credit_card_account_id` | STRING | Credit Card Account ID | Id of the credit card account the payment was made with; joins to account.id. FK to [Accounts](./accounts.md) |
| `check_bank_account_name` | STRING | Check Bank Account Name | Name of the bank account that check_bank_account_id points to. |
| `credit_card_account_name` | STRING | Credit Card Account Name | Name of the account that credit_card_account_id points to. |

# Example Questions

- How much was paid to `vendors` per month, by check and by card?
- Which `vendors` received the largest `payments`, and from which `accounts`?

## Joins

- [Vendors](./vendors.md) — `realm_id = realm_id` AND `vendor_id = id` [N:1] — The vendor the document is for.
  - [Vendors Company info](./company-info.md)
- [Accounts](./accounts.md) as `ap_account` — `realm_id = realm_id` AND `ap_account_id = id` [N:1] — The Accounts Payable account the payment is booked against.
  - [Ap Account Company info](./company-info.md)
- [Accounts](./accounts.md) as `credit_card_account` — `realm_id = realm_id` AND `credit_card_account_id = id` [N:1] — The credit card account a card payment is charged to. Set only when the payment is made by card.
  - [Credit Card Account Company info](./company-info.md)
- [Accounts](./accounts.md) as `check_bank_account` — `realm_id = realm_id` AND `check_bank_account_id = id` [N:1] — The bank account a check payment is drawn on. Set only when the payment is made by check.
  - [Check Bank Account Company info](./company-info.md)
- [Company info](./company-info.md) — `realm_id = realm_id` [N:1] — The company the row belongs to.
