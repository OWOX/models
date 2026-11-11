---
title: "Charges"
description: |
  One row per charge attempt with amount, outcome, card details and the customer, invoice and payment intent it belongs to. The sales side of a payment; its fee and net live on the balance transaction.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/charges"
    title: "Stripe API reference — Charges"
---

## Connector endpoint

- **Endpoint:** Stripe · `charges`
- **Default destination table:** `stripe_charges`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `paid` | BOOLEAN | Paid | true when the charge succeeded or was successfully authorized. |
| `amount` | INTEGER | Amount | Amount requested in the smallest currency unit (cents for USD). |
| `status` | STRING | Status | succeeded, pending or failed. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `invoice` | STRING | Invoice | Invoice id (in_) when the charge paid an invoice. Join to invoices. FK to [Invoices](./invoices.md) |
| `captured` | BOOLEAN | Captured | true when the charge was captured (funds taken), false for an uncaptured authorization. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `customer` | STRING | Customer | Customer id (cus_). Join to customers. FK to [Customers](./customers.md) |
| `disputed` | BOOLEAN | Disputed | true when a dispute (chargeback) exists on this charge. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `metadata` | STRING | Metadata | Metadata object your systems attached (order ids, plan names) as a JSON string. |
| `refunded` | BOOLEAN | Refunded | true when the charge is fully refunded. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `card_brand` | STRING | Card Brand | Card brand: visa, mastercard, amex, … |
| `card_last4` | STRING | Card Last4 | Last four digits of the card. |
| `description` | STRING | Description | Description set when the charge was created. |
| `card_country` | STRING | Card Country | Two-letter issuing country of the card. |
| `card_funding` | STRING | Card Funding | credit, debit or prepaid. |
| `failure_code` | STRING | Failure Code | Error code when the charge failed (card_declined, insufficient_funds, …). |
| `receipt_email` | STRING | Receipt Email | Email the receipt was sent to. |
| `payment_intent` | STRING | Payment Intent | Payment intent id (pi_) this charge belongs to. Join to payment_intents. FK to [Payment intents](./payment-intents.md) |
| `payment_method` | STRING | Payment Method | Payment method id (pm_) used. |
| `amount_captured` | INTEGER | Amount Captured | Amount captured in the smallest currency unit (cents for USD); less than amount after a partial capture. |
| `amount_refunded` | INTEGER | Amount Refunded | Amount refunded so far in the smallest currency unit (cents for USD); grows after creation. |
| `billing_country` | STRING | Billing Country | Two-letter country from the billing address. |
| `failure_message` | STRING | Failure Message | Human-readable failure reason. |
| `outcome_risk_level` | STRING | Outcome Risk Level | Stripe Radar risk level: normal, elevated, highest. |
| `balance_transaction` | STRING | Balance Transaction | Balance transaction id (txn_) carrying this charge's fee and net. Join to balance_transactions. FK to [Balance transactions](./balance-transactions.md) |
| `payment_method_type` | STRING | Payment Method Type | Payment method family: card, link, sepa_debit, us_bank_account, … |
| `statement_descriptor` | STRING | Statement Descriptor | Text shown on the customer's card statement. |
| `outcome_network_status` | STRING | Outcome Network Status | approved_by_network, declined_by_network, not_sent_to_network or reversed_after_approval. |
| `outcome_seller_message` | STRING | Outcome Seller Message | Human-readable outcome from Stripe. |

# Example Questions

- How many charges failed or were declined this month, and for which reasons?
- What share of volume comes from each card brand and country?
- Which `customers` have refunded or disputed charges?

## Joins

- [Customers](./customers.md) — `customer = id` [N:1] — Who paid.
- [Payment intents](./payment-intents.md) — `payment_intent = id` [N:1] — The payment attempt lifecycle this charge belongs to.
  - [Payment intents Customers](./customers.md)
  - [Payment intents Invoices](./invoices.md)
    - [Payment intents Invoices Customers](./customers.md)
    - [Payment intents Invoices Subscriptions](./subscriptions.md)
      - [Payment intents Invoices Subscriptions Customers](./customers.md)
- [Invoices](./invoices.md) — `invoice = id` [N:1] — Set when the charge paid an invoice.
  - [Invoices Customers](./customers.md)
  - [Invoices Subscriptions](./subscriptions.md)
    - [Invoices Subscriptions Customers](./customers.md)
- [Balance transactions](./balance-transactions.md) — `balance_transaction = id` [N:1] — The fee and net of this charge.
  - [Balance transactions Payouts](./payouts.md)
  - [Balance transactions Refunds](./refunds.md)
