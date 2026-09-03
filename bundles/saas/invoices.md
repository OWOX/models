---
title: "Invoices"
description: |
  Every invoice and how it was paid — amount, tax, discounts and credits, payment status, and
  where it sits in the dunning cycle when a payment fails. This is where voluntary revenue meets
  involuntary churn: failed payments and collections stages that quietly erode the customer base.

  This is the model's revenue mart, and it carries two figures on purpose: `amount` is what was
  billed on every invoice regardless of outcome, and `net_amount` is what was actually recognised
  — zero for a voided or written-off invoice, equal to `amount` otherwise. Any revenue total
  should sum `net_amount`, never `amount`. The four collection signals — `status`, `dunning_stage`,
  `is_failed` and `paid_at` — always agree with each other: a `paid` invoice always has a
  `paid_at` and never `is_failed` or a write-off, and `is_write_off` is exactly
  `dunning_stage = 'write_off'`.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-02T16:01:57.000Z
owox:
  joins:
    subscription.account: "The account behind the billed subscription."
    subscription.plan: "The plan the billed subscription is on."
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `invoice_id` | STRING | Invoice ID | PK. Unique invoice identifier. |
| `account_id` | STRING | Account ID | Account billed. FK to [Account](./account.md) |
| `subscription_id` | STRING | Subscription ID | Subscription being billed. FK to [Subscription](./subscription.md) |
| `issued_at` | DATE | Issued At | Date the invoice was issued. |
| `period_start` | DATE | Period Start | Start of the billing period. |
| `period_end` | DATE | Period End | End of the billing period. |
| `amount` | NUMERIC | Amount | Invoice amount before tax. Booked on every status, including void and write-off — see `net_amount` for the recognised figure. |
| `net_amount` | NUMERIC | Net Amount | Recognised revenue: `0` when the invoice is void or written off, otherwise equal to `amount`. Sum this for revenue totals, not `amount`. |
| `tax` | NUMERIC | Tax | Tax charged on the invoice. |
| `status` | STRING | Status | Payment status of the invoice. |
| `currency` | STRING | Currency | Invoice currency, aligned to the account's region. |
| `discount_amount` | NUMERIC | Discount Amount | Discount applied to the invoice, if any. Always a fraction of `amount`, never larger than it. |
| `credit_applied` | NUMERIC | Credit Applied | Account credit applied to the invoice, if any. |
| `dunning_stage` | STRING | Dunning Stage | Collections stage: none / retry_1 / retry_2 / final_notice / write_off. |
| `paid_at` | DATE | Paid At | Date the invoice was paid. Set if and only if `status = 'paid'`. |
| `is_failed` | BOOLEAN | Is Failed | Failed payment — involuntary-churn signal. Never true on a `paid` invoice. |
| `is_write_off` | BOOLEAN | Is Write Off | Uncollectible invoice, exactly `dunning_stage = 'write_off'`. Use this to gate money rather than string-matching the dunning label. |

# Example Questions

- How much recognised revenue did we collect last quarter, and how much billed revenue never
- How much revenue is lost to failed payments, and how much does dunning recover before write-off?
- Which `accounts` are slipping through the collections stages toward involuntary churn?
- How much do discounts and applied credits reduce collected revenue versus billed revenue?

## Joins

- [Account](./account.md) — `account_id = account_id` — The account billed on this invoice.
- [Subscription](./subscription.md) — `subscription_id = subscription_id` — The subscription this invoice bills.
