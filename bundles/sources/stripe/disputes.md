---
title: "Disputes"
description: |
  Chargebacks: disputed amount, reason, status and the evidence deadline. A dispute debits the amount plus a fee from the balance.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/disputes"
    title: "Stripe API reference — Disputes"
---

## Connector endpoint

- **Endpoint:** Stripe · `disputes`
- **Default destination table:** `stripe_disputes`
- **Unique keys:** `id`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `amount` | INTEGER | Amount | Disputed amount in the smallest currency unit (cents for USD). |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `charge` | STRING | Charge | FK to [Charges](./charges.md). Charge id (ch_) disputed. Join to charges. |
| `payment_intent` | STRING | Payment Intent | FK to [Payment intents](./payment-intents.md). Payment intent id (pi_) disputed. |
| `reason` | STRING | Reason | fraudulent, product_not_received, duplicate, subscription_canceled, credit_not_processed, general, … |
| `status` | STRING | Status | warning_needs_response, warning_under_review, warning_closed, needs_response, under_review, won or lost. |
| `is_charge_refundable` | BOOLEAN | Is Charge Refundable | Whether the charge can still be refunded instead of fought. |
| `evidence_due_by` | TIMESTAMP | Evidence Due By | Deadline to submit evidence. |
| `evidence_has_evidence` | BOOLEAN | Evidence Has Evidence | Whether evidence has been submitted. |
| `balance_transactions` | JSON | Balance Transactions | JSON list of the balance transactions (debit and, if won, credit) tied to the dispute. |

# Example Questions

- How many disputes are open, how much is at stake, and when is evidence due?
- What is our dispute rate (disputes per hundred charges) by month?

## Joins

- [Charges](./charges.md) — `charge = id` [N:1]
- [Payment intents](./payment-intents.md) — `payment_intent = id` [N:1]
