---
title: "Invoices"
description: |
  Every invoice and how it was paid — amount, tax, discounts and credits, payment status, and
  where it sits in the dunning cycle when a payment fails. This is where voluntary revenue meets
  involuntary churn: failed payments and collections stages that quietly erode the customer base.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-23T12:51:26.000Z
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
| `amount` | NUMERIC | Amount | Invoice amount before tax. |
| `tax` | NUMERIC | Tax | Tax charged on the invoice. |
| `status` | STRING | Status | Payment status of the invoice. |
| `currency` | STRING | Currency | Invoice currency, aligned to the account's region. |
| `discount_amount` | NUMERIC | Discount Amount | Discount applied to the invoice, if any. |
| `credit_applied` | NUMERIC | Credit Applied | Account credit applied to the invoice, if any. |
| `dunning_stage` | STRING | Dunning Stage | Collections stage: none / retry_1 / retry_2 / final_notice / write_off. |
| `paid_at` | DATE | Paid At | Date the invoice was paid. |
| `is_failed` | BOOLEAN | Is Failed | Failed payment — involuntary-churn signal. |

# Example Questions

- How much revenue is lost to failed payments, and how much does dunning recover before write-off?
- Which `accounts` are slipping through the collections stages toward involuntary churn?
- How much do discounts and applied credits reduce collected revenue versus billed revenue?

## Joins

- [Account](./account.md) — `account_id = account_id`
- [Subscription](./subscription.md) — `subscription_id = subscription_id`
