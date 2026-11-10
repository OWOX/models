---
title: "Refunds"
description: |
  Money returned to customers: how much, on which charge, why, and the balance transaction that reversed it.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/refunds"
    title: "Stripe API reference — Refunds"
---

## Connector endpoint

- **Endpoint:** Stripe · `refunds`
- **Default destination table:** `stripe_refunds`
- **Unique keys:** `id`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `amount` | INTEGER | Amount | Refunded amount in the smallest currency unit (cents for USD). |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `charge` | STRING | Charge | FK to [Charges](./charges.md). Charge id (ch_) refunded. Join to charges. |
| `payment_intent` | STRING | Payment Intent | Payment intent id (pi_) refunded. |
| `balance_transaction` | STRING | Balance Transaction | FK to [Balance transactions](./balance-transactions.md). Balance transaction id (txn_) of the refund. Join to balance_transactions. |
| `reason` | STRING | Reason | duplicate, fraudulent, requested_by_customer or expired_uncaptured_charge; null when not given. |
| `status` | STRING | Status | pending, requires_action, succeeded, failed or canceled. |
| `receipt_number` | STRING | Receipt Number | Receipt number shown to the customer. |
| `description` | STRING | Description | Optional description. |

# Example Questions

- How much was refunded this month, by reason?
- Which `products` (through the invoice lines of the refunded charge) are refunded most?

## Joins

- [Charges](./charges.md) — `charge = id` [N:1]
- [Balance transactions](./balance-transactions.md) — `balance_transaction = id` [N:1] — The money leaving the balance.
