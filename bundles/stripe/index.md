---
title: "Stripe"
description: |
  What the OWOX Data Marts Stripe connector loads from one Stripe account, and how the tables fit together.
  Every table carries `id`, Stripe's globally unique object id, and `account_id`, your Stripe account, so several accounts can share one table.
  
  [Balance transactions](./balance-transactions.md) is the spine: every movement of money, with gross `amount`, Stripe's `fee`
  and the `net` that reaches the balance, dated by `created` and by `available_on`. [Charges](./charges.md), [Refunds](./refunds.md),
  [Disputes](./disputes.md) and [Payouts](./payouts.md) are the money side and each points at its balance transaction; a payout's
  transactions sum to its amount, which is how Stripe reconciles to the bank statement. [Customers](./customers.md),
  [Invoices](./invoices.md) with [Invoice line items](./invoice-line-items.md), [Subscriptions](./subscriptions.md) with
  [Subscription items](./subscription-items.md), [Products](./products.md) and [Prices](./prices.md) are the billing side: MRR is
  subscription items × prices, invoiced revenue is line items × prices. [Payment intents](./payment-intents.md) hold the checkouts
  that never became charges, and [Events](./events.md) is the audit trail.
  
  Three amounts, three dates: `charges.amount` with `created` for what was sold, `balance_transactions.net` with `available_on` for what
  reached the balance, `payouts.amount` with `arrival_date` for what reached the bank. Money fields are integers in the smallest currency unit.
  
  In the business model Customers join [Customers](../e-commerce/customers.md) and [Account](../saas/account.md) on the ids and emails you store;
  Charges join Orders through the charge id kept with the order; Payouts join the bank or QuickBooks deposits on arrival date and amount.
  
  Definitions follow connector version 1 (2026-11-06) on Stripe-Version 2024-06-20.
tags: ["owox", "index", "connector", "stripe"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
    last_modified: 2026-11-06
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Balance transactions](./balance-transactions.md) | 16 | Every movement of money through the Stripe balance: charges, refunds, disputes, fees, payouts, adjustments. |
| [Charges](./charges.md) | 33 | One row per charge attempt with amount, outcome, card details and the customer, invoice and payment intent it belongs to. |
| [Refunds](./refunds.md) | 13 | Money returned to customers: how much, on which charge, why, and the balance transaction that reversed it. |
| [Disputes](./disputes.md) | 14 | Chargebacks: disputed amount, reason, status and the evidence deadline. |
| [Payouts](./payouts.md) | 18 | Transfers from the Stripe balance to the bank account with the arrival date. |
| [Customers](./customers.md) | 17 | Every customer: identity, billing country, delinquency and account balance. |
| [Invoices](./invoices.md) | 31 | One row per invoice with amounts, status, period and payment. |
| [Invoice line items](./invoice-line-items.md) | 19 | Every line on every invoice: what was billed, for which price and product, for which period. |
| [Subscriptions](./subscriptions.md) | 23 | One row per subscription in any status with its period, trial and cancellation facts. |
| [Subscription items](./subscription-items.md) | 14 | The lines of every subscription: price and quantity. |
| [Products](./products.md) | 13 | The catalogue: every product, active or not. |
| [Prices](./prices.md) | 17 | Every price (plan) of every product: amount, currency, billing interval, active flag. |
| [Payment intents](./payment-intents.md) | 22 | Every payment attempt lifecycle: amount asked, amount received, status and last error. |
| [Events](./events.md) | 11 | The audit trail: every change Stripe recorded, typed, with the id of the object it concerns. |

# Example Questions

- How much did we net after fees, refunds and disputes last month, and did every `payout` reach the bank for the amount its `balance transactions` add up to?
- What is MRR today from `subscription items` × `prices`, and how did it move: new, expansion, contraction, churn?
- Which `customers` and `invoices` are past due or failing payment, and how much revenue is at risk?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/stripe)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Stripe model diagram](../res/screens/stripe.svg)
