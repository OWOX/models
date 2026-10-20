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
timestamp: 2026-10-19T16:01:09.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `invoice_id` | STRING | Invoice ID | PK. Unique invoice identifier. |
| `account_id` | STRING | Account ID | Account billed. FK to [Account](./account.md) |
| `subscription_id` | STRING | Subscription ID | Subscription being billed. FK to [Subscription](./subscription.md) |
| `issued_at` | DATE | Issued At | Date the invoice was issued — a billing anniversary of the subscription: monthly or yearly by its interval. No invoice is issued after cancellation or between a churn and its win-back. |
| `period_start` | DATE | Period Start | Start of the billing period. |
| `period_end` | DATE | Period End | End of the billing period. |
| `amount` | NUMERIC | Amount | Invoice amount before tax, in USD: the subscription's MRR in force on the billing day, times twelve for an annual subscription. Booked on every status, including void and write-off — see `net_amount` for the recognised figure. |
| `net_amount` | NUMERIC | Net Amount | Recognised revenue: `0` when the invoice is void or written off, otherwise equal to `amount`. Sum this for revenue totals, not `amount`. |
| `tax` | NUMERIC | Tax | Tax charged on the invoice, at the account region's rate. |
| `status` | STRING | Status | Payment status of the invoice. |
| `currency` | STRING | Currency | Currency the customer is billed in, aligned to the account's region. The amounts are stated in USD. |
| `discount_amount` | NUMERIC | Discount Amount | List price the subscription's negotiated discount took off this invoice, if any. `amount` is already net of it. |
| `credit_applied` | NUMERIC | Credit Applied | Account credit applied to the invoice, if any. |
| `dunning_stage` | STRING | Dunning Stage | Collections stage: none / retry_1 / retry_2 / final_notice / write_off. |
| `paid_at` | DATE | Paid At | Date the invoice was paid. Set if and only if `status = 'paid'`. |
| `is_failed` | BOOLEAN | Is Failed | Failed payment — involuntary-churn signal. Never true on a `paid` invoice. |
| `is_write_off` | BOOLEAN | Is Write Off | Uncollectible invoice, exactly `dunning_stage = 'write_off'`. Use this to gate money rather than string-matching the dunning label. |

## Calculated fields

### `failed_payment_rate` · FLOAT · Metric

- **Alias:** Failed Payment Rate

Share of invoices whose payment failed — the leading signal of involuntary churn. A conditional count over all invoices issued in the selected rows.

```sql
SAFE_DIVIDE(COUNTIF(is_failed), COUNT(invoice_id))
```

# Example Questions

- How much recognised revenue did we collect last quarter, and how much billed revenue never
- How much revenue is lost to failed payments, and how much does dunning recover before write-off?
- Which `accounts` are slipping through the collections stages toward involuntary churn?
- How much do discounts and applied credits reduce collected revenue versus billed revenue?

## Joins

- [Account](./account.md) — `account_id = account_id` [N:1] — The account billed on this invoice.
- [Subscription](./subscription.md) — `subscription_id = subscription_id` [N:1] — The subscription this invoice bills.
  - [Subscription Account](./account.md) — The account behind the billed subscription.
  - [Subscription Plan](./plan.md) — The plan the billed subscription is on.
