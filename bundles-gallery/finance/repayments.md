---
type: "OWOX Data Mart"
title: "Repayments"
description: |
  The repayment schedule for every funded loan and how each installment actually played
  out — paid on time, paid late, or missed. Tracks how far behind each loan falls, the
  principal still outstanding, and the point at which a loan is written off. This is where
  the health of the loan book, and the losses building in it, become visible.
tags: ["owox"]
timestamp: 2026-07-23T12:02:49.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `repayment_id` | STRING | PK. Unique repayment identifier. |
| `loan_id` | STRING | Loan this repayment belongs to. FK to [Loans](./loans.md) |
| `due_date` | DATE | Date the payment is due. The full set of rows amortizes the loan's `funded_amount` at its `apr` over `term_months`. |
| `paid_date` | DATE | Date the payment was made; null if unpaid. |
| `due_amount` | NUMERIC | Scheduled principal + interest for the installment (from the amortization schedule). |
| `paid_amount` | NUMERIC | Amount actually paid (0 / partial / full). |
| `days_past_due` | INTEGER | DPD; progresses through the 0 / 30 / 60 / 90 / 120+ ladder per loan (roll-rate mechanics), not an independent draw. Conditioned on `risk_band`. |
| `outstanding_principal` | NUMERIC | Remaining principal after this installment — enables dollar-weighted roll-rate and vintage analysis. |
| `is_charged_off` | BOOLEAN | True only once cumulative DPD crosses the charge-off threshold (FFIEC: 120 days installment / 180 days revolving). |

# Example Questions

- How does the rate of loans falling 90+ days behind differ across risk tiers?
- What share of lent principal ends up written off, and how does that build over the life of a loan?
- How many delinquent loans recover and return to good standing versus rolling into write-off?

## Joins

- [Loans](./loans.md) — `loan_id = loan_id`
