---
title: "Payment intents"
description: |
  Every payment attempt lifecycle: amount asked, amount received, status and last error. Incomplete and failed intents are the lost checkouts charges never show.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/payment_intents"
    title: "Stripe API reference — Payment intents"
---

## Connector endpoint

- **Endpoint:** Stripe · `payment_intents`
- **Default destination table:** `stripe_payment_intents`
- **Unique keys:** `id`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `amount` | INTEGER | Amount | Amount intended in the smallest currency unit (cents for USD). |
| `amount_received` | INTEGER | Amount Received | Amount received so far in the smallest currency unit (cents for USD). |
| `amount_capturable` | INTEGER | Amount Capturable | Amount authorized but not yet captured in the smallest currency unit (cents for USD). |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `status` | STRING | Status | requires_payment_method, requires_confirmation, requires_action, processing, requires_capture, canceled or succeeded. |
| `customer` | STRING | Customer | FK to [Customers](./customers.md). Customer id (cus_). Join to customers. |
| `invoice` | STRING | Invoice | FK to [Invoices](./invoices.md). Invoice id (in_) when the intent pays an invoice. |
| `latest_charge` | STRING | Latest Charge | FK to [Charges](./charges.md). Most recent charge id (ch_). Join to charges. |
| `payment_method` | STRING | Payment Method | Payment method id (pm_). |
| `payment_method_types` | JSON | Payment Method Types | JSON list of payment method types offered. |
| `capture_method` | STRING | Capture Method | automatic, automatic_async or manual. |
| `canceled_at` | TIMESTAMP | Canceled At | When the intent was canceled. |
| `cancellation_reason` | STRING | Cancellation Reason | duplicate, fraudulent, requested_by_customer, abandoned, failed_invoice, automatic, … |
| `last_error_code` | STRING | Last Error Code | Code of the last payment error. |
| `last_error_decline_code` | STRING | Last Error Decline Code | Card network decline code of the last error. |
| `description` | STRING | Description | Description set at creation. |
| `statement_descriptor` | STRING | Statement Descriptor | Statement descriptor. |
| `metadata` | JSON | Metadata | Metadata object as a JSON string. |

# Example Questions

- How many checkouts were started but never completed, and why?
- What is the decline rate by last error code?

## Joins

- [Customers](./customers.md) — `customer = id` [N:1]
- [Charges](./charges.md) — `latest_charge = id` [1:1] — The most recent charge attempt.
- [Invoices](./invoices.md) — `invoice = id` [N:1]
