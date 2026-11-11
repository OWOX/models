---
title: "Invoices"
description: |
  One row per invoice with amounts, status, period and payment. Status moves after creation (draft → open → paid, void, uncollectible).
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/invoices"
    title: "Stripe API reference — Invoices"
---

## Connector endpoint

- **Endpoint:** Stripe · `invoices`
- **Default destination table:** `stripe_invoices`
- **Unique keys:** `id`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `customer` | STRING | Customer | FK to [Customers](./customers.md). Customer id (cus_). Join to customers. |
| `subscription` | STRING | Subscription | FK to [Subscriptions](./subscriptions.md). Subscription id (sub_) when the invoice bills a subscription. Join to subscriptions. |
| `status` | STRING | Status | draft, open, paid, uncollectible or void. |
| `number` | STRING | Number | Invoice number shown to the customer. |
| `billing_reason` | STRING | Billing Reason | subscription_create, subscription_cycle, subscription_update, manual, upcoming, … |
| `collection_method` | STRING | Collection Method | charge_automatically or send_invoice. |
| `currency` | STRING | Currency | Three-letter ISO currency code, lowercase. |
| `period_start` | TIMESTAMP | Period Start | Start of the usage period the invoice covers. |
| `period_end` | TIMESTAMP | Period End | End of the usage period. |
| `due_date` | TIMESTAMP | Due Date | When payment is due (send_invoice collection). |
| `paid_at` | TIMESTAMP | Paid At | When the invoice was paid. |
| `finalized_at` | TIMESTAMP | Finalized At | When the invoice was finalized. |
| `voided_at` | TIMESTAMP | Voided At | When the invoice was voided. |
| `amount_due` | INTEGER | Amount Due | Amount still to collect when finalized in the smallest currency unit (cents for USD). |
| `amount_paid` | INTEGER | Amount Paid | Amount paid in the smallest currency unit (cents for USD). |
| `amount_remaining` | INTEGER | Amount Remaining | Amount outstanding in the smallest currency unit (cents for USD). |
| `subtotal` | INTEGER | Subtotal | Sum of line items before discounts and tax in the smallest currency unit (cents for USD). |
| `total` | INTEGER | Total | Total after discounts and tax in the smallest currency unit (cents for USD). |
| `tax` | INTEGER | Tax | Tax amount in the smallest currency unit (cents for USD). |
| `starting_balance` | INTEGER | Starting Balance | Customer balance applied at creation in the smallest currency unit (cents for USD). |
| `charge` | STRING | Charge | FK to [Charges](./charges.md). Charge id (ch_) that paid it. Join to charges. |
| `payment_intent` | STRING | Payment Intent | Payment intent id (pi_). |
| `attempt_count` | INTEGER | Attempt Count | Number of payment attempts made. |
| `attempted` | BOOLEAN | Attempted | Whether payment was attempted. |
| `paid` | BOOLEAN | Paid | Whether the invoice is paid. |
| `hosted_invoice_url` | STRING | Hosted Invoice URL | Link to the hosted invoice page. |
| `metadata` | JSON | Metadata | Metadata object as a JSON string. |

# Example Questions

- How much is invoiced, paid and still outstanding this month?
- Which invoices are past due and how many payment attempts have been made?
- How much billed revenue was voided or became uncollectible?

## Joins

- [Customers](./customers.md) — `customer = id` [N:1]
- [Subscriptions](./subscriptions.md) — `subscription = id` [N:1] — Set for subscription invoices.
- [Charges](./charges.md) — `charge = id` [N:1] — The charge that paid it.
