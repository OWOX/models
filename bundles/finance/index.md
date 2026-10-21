---
title: "Finance"
description: |
  A consumer-lending business modeled end to end — from how customers are acquired and
  verified, through account funding and loan origination, to repayments, missed payments,
  and collections. Each customer carries an internal risk tier that shapes their whole
  journey: who gets approved, at what interest rate, how likely they are to fall behind,
  and how much the business ultimately writes off. Together the tables let you follow both
  the money and the risk across the entire loan book: [Loans](./loans.md) holds every
  application and what was funded, and [Repayments](./repayments.md) shows how each funded loan
  is being paid back.

  **How this business is managed**
  - **Credit Risk** — approves applicants in line with their risk and keeps missed payments and write-offs within appetite.
  - **Finance** — keeps what lending earns well above what deposits cost, and grows new lending to plan.
  - **Product** — turns sign-ups into funded customers who use their accounts every month.

  **Key metrics**
  - On-time payments — [Repayments · On-Time Payment Rate](./repayments.md?field=on_time_payment_rate) by [Repayments · Due Date](./repayments.md?field=due_date).
  - Delinquency — [Repayments · 30+ DPD Rate (loans)](./repayments.md?field=delinquency_rate_30).
  - Net interest — [Balances (monthly) · Interest Earned](./balances-monthly.md?field=interest_earned) less [Balances (monthly) · Interest Paid](./balances-monthly.md?field=interest_paid), by [Balances (monthly) · Month](./balances-monthly.md?field=month).
  - Origination — [Loans · Funded Loans](./loans.md?field=funded_loans) and [Loans · Funded Amount](./loans.md?field=funded_amount) by [Loans · Funded At](./loans.md?field=funded_at).

  **Key Data Marts**
  - [Loans](./loans.md) — every application, the decision, the amount funded and its APR.
  - [Repayments](./repayments.md) — every instalment, and how late it was paid.
  - [Balances (monthly)](./balances-monthly.md) — what each account earns or costs the business, month by month.
  - [Customer](./customer.md) — who the borrowers are, where they came from and their risk band.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-10-20T20:04:40Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Vlad Flaks](https://github.com/vladflaks), [Rus Obolonsky](https://github.com/Obolrus)

| Data Mart | Fields |
|-----------|--------|
| [Accounts](./accounts.md) | 8 |
| [Balances (monthly)](./balances-monthly.md) | 7 |
| [Collections](./collections.md) | 6 |
| [Customer](./customer.md) | 8 |
| [Loans](./loans.md) | 12 |
| [Product](./product.md) | 5 |
| [Repayments](./repayments.md) | 9 |
| [Transactions](./transactions.md) | 11 |

# Example Questions

- Which acquisition channels bring in the most profitable borrowers once `late payments` and write-offs are taken into account?
- How much of the money lent out is the business likely to lose, and is that improving or worsening for recent `loans`?
- Do higher-risk `customers` who pay on time make up for the ones who default — is the pricing worth the risk?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/finance)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Finance model diagram](../res/screens/finance.svg)
