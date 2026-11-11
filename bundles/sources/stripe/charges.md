---
title: "Charges"
description: |
  One row per charge attempt with amount, outcome, card details and the customer, invoice and payment intent it belongs to. The sales side of a payment; its fee and net live on the balance transaction.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/charges"
    title: "Stripe API reference — Charges"
---

## Connector endpoint

- **Endpoint:** Stripe · `charges`
- **Default destination table:** `stripe_charges`
- **Unique keys:** `id`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `amount` | INTEGER | Amount | Amount requested in the smallest currency unit (cents for USD). |
| `amount_captured` | INTEGER | Amount Captured | Amount actually captured in the smallest currency unit (cents for USD); equals amount unless the charge was authorized for more. |
| `amount_refunded` | INTEGER | Amount Refunded | Amount refunded so far in the smallest currency unit (cents for USD); grows after creation. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `status` | STRING | Status | succeeded, pending or failed. |
| `paid` | BOOLEAN | Paid | true when the charge succeeded or was successfully authorized. |
| `captured` | BOOLEAN | Captured | true when the charge was captured (funds taken), false for an uncaptured authorization. |
| `refunded` | BOOLEAN | Refunded | true when the charge is fully refunded. |
| `disputed` | BOOLEAN | Disputed | true when a dispute (chargeback) exists on this charge. |
| `customer` | STRING | Customer | FK to [Customers](./customers.md). Customer id (cus_). Join to customers. |
| `payment_intent` | STRING | Payment Intent | FK to [Payment intents](./payment-intents.md). Payment intent id (pi_) this charge belongs to. Join to payment_intents. |
| `invoice` | STRING | Invoice | FK to [Invoices](./invoices.md). Invoice id (in_) when the charge paid an invoice. Join to invoices. |
| `balance_transaction` | STRING | Balance Transaction | FK to [Balance transactions](./balance-transactions.md). Balance transaction id (txn_) carrying this charge's fee and net. Join to balance_transactions. |
| `payment_method` | STRING | Payment Method | Payment method id (pm_) used. |
| `payment_method_type` | STRING | Payment Method Type | Payment method family: card, link, sepa_debit, us_bank_account, … |
| `card_brand` | STRING | Card Brand | Card brand: visa, mastercard, amex, … |
| `card_funding` | STRING | Card Funding | credit, debit or prepaid. |
| `card_country` | STRING | Card Country | Two-letter issuing country of the card. |
| `card_last4` | STRING | Card Last4 | Last four digits of the card. |
| `outcome_network_status` | STRING | Outcome Network Status | approved_by_network, declined_by_network, not_sent_to_network or reversed_after_approval. |
| `outcome_risk_level` | STRING | Outcome Risk Level | Stripe Radar risk level: normal, elevated, highest. |
| `outcome_seller_message` | STRING | Outcome Seller Message | Human-readable outcome from Stripe. |
| `failure_code` | STRING | Failure Code | Error code when the charge failed (card_declined, insufficient_funds, …). |
| `failure_message` | STRING | Failure Message | Human-readable failure reason. |
| `description` | STRING | Description | Description set when the charge was created. |
| `receipt_email` | STRING | Receipt Email | Email the receipt was sent to. |
| `statement_descriptor` | STRING | Statement Descriptor | Text shown on the customer's card statement. |
| `billing_country` | STRING | Billing Country | Two-letter country from the billing address. |
| `metadata` | JSON | Metadata | Metadata object your systems attached (order ids, plan names) as a JSON string. |

# Example Questions

- How many charges failed or were declined this month, and for which reasons?
- What share of volume comes from each card brand and country?
- Which `customers` have refunded or disputed charges?

## Joins

- [Customers](./customers.md) — `customer = id` [N:1] — Who paid.
- [Payment intents](./payment-intents.md) — `payment_intent = id` [N:1] — The payment attempt lifecycle this charge belongs to.
- [Invoices](./invoices.md) — `invoice = id` [N:1] — Set when the charge paid an invoice.
- [Balance transactions](./balance-transactions.md) — `balance_transaction = id` [N:1] — The fee and net of this charge.
