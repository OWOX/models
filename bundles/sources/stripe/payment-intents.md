---
title: "Payment intents"
description: |
  Every payment attempt lifecycle: amount asked, amount received, status and last error. Incomplete and failed intents are the lost checkouts charges never show.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/payment_intents"
    title: "Stripe API reference — Payment intents"
---

## Connector endpoint

- **Endpoint:** Stripe · `payment_intents`
- **Default destination table:** `stripe_payment_intents`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `amount` | INTEGER | Amount | Amount intended in the smallest currency unit (cents for USD). |
| `status` | STRING | Status | requires_payment_method, requires_confirmation, requires_action, processing, requires_capture, canceled or succeeded. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `invoice` | STRING | Invoice | Invoice id (in_) when the intent pays an invoice. FK to [Invoices](./invoices.md) |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `customer` | STRING | Customer | Customer id (cus_). Join to customers. FK to [Customers](./customers.md) |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `metadata` | STRING | Metadata | Metadata object as a JSON string. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `canceled_at` | INTEGER | Canceled At | When the intent was canceled, as Unix time in seconds (UTC); use TIMESTAMP_SECONDS() in SQL. |
| `description` | STRING | Description | Description set at creation. |
| `latest_charge` | STRING | Latest Charge | Most recent charge id (ch_). Join to charges. FK to [Charges](./charges.md) |
| `capture_method` | STRING | Capture Method | automatic, automatic_async or manual. |
| `payment_method` | STRING | Payment Method | Payment method id (pm_). |
| `amount_received` | INTEGER | Amount Received | Amount received so far in the smallest currency unit (cents for USD). |
| `last_error_code` | STRING | Last Error Code | Code of the last payment error. |
| `amount_capturable` | INTEGER | Amount Capturable | Amount authorized but not yet captured in the smallest currency unit (cents for USD). |
| `cancellation_reason` | STRING | Cancellation Reason | duplicate, fraudulent, requested_by_customer, abandoned, failed_invoice, automatic, … |
| `payment_method_types` | STRING | Payment Method Types | JSON list of payment method types offered. Stored as a JSON string. |
| `statement_descriptor` | STRING | Statement Descriptor | Text shown on the customer's statement for a non-card charge, overriding the account's default descriptor; it does not apply to card charges, whose statement text this table does not carry. |
| `last_error_decline_code` | STRING | Last Error Decline Code | Card network decline code of the last error. |

# Example Questions

- How many checkouts were started but never completed, and why?
- What is the decline rate by last error code?

## Joins

- [Customers](./customers.md) — `customer = id` [N:1] — The customer the intent belongs to, when there is one.
- [Charges](./charges.md) — `latest_charge = id` [1:1] — The most recent charge attempt.
  - [Charges Balance transactions](./balance-transactions.md)
    - [Charges Balance transactions Payouts](./payouts.md)
    - [Charges Balance transactions Refunds](./refunds.md)
  - [Charges Customers](./customers.md)
  - [Charges Invoices](./invoices.md)
    - [Charges Invoices Customers](./customers.md)
    - [Charges Invoices Subscriptions](./subscriptions.md)
      - [Charges Invoices Subscriptions Customers](./customers.md)
- [Invoices](./invoices.md) — `invoice = id` [N:1] — The invoice that created the intent, when one did.
  - [Invoices Charges](./charges.md)
    - [Invoices Charges Balance transactions](./balance-transactions.md)
      - [Invoices Charges Balance transactions Payouts](./payouts.md)
      - [Invoices Charges Balance transactions Refunds](./refunds.md)
    - [Invoices Charges Customers](./customers.md)
  - [Invoices Customers](./customers.md)
  - [Invoices Subscriptions](./subscriptions.md)
    - [Invoices Subscriptions Customers](./customers.md)
