---
title: "Repayments"
description: |
  The repayment schedule for every funded [loan](./loans.md) and how each installment actually
  played out — paid on time, paid late, or missed. Tracks how far behind each loan falls, the
  principal still outstanding, and the point at which a loan is written off. This is where the
  health of the loan book, and the losses building in it, become visible. What was done to
  recover a loan that fell behind is in [Collections](./collections.md).
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T12:55:11.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `repayment_id` | STRING | Repayment ID | PK. Unique repayment identifier. |
| `loan_id` | STRING | Loan ID | Loan this repayment belongs to. FK to [Loans](./loans.md) |
| `due_date` | DATE | Due Date | Date the payment is due. The full set of rows amortizes the loan's `funded_amount` at its `apr` over `term_months`. |
| `paid_date` | DATE | Paid Date | Date the payment was made; null if unpaid. |
| `due_amount` | NUMERIC | Due Amount | Scheduled principal + interest for the installment (from the amortization schedule). |
| `paid_amount` | NUMERIC | Paid Amount | Amount actually paid (0 / partial / full). |
| `days_past_due` | INTEGER | Days Past Due | DPD; progresses through the 0 / 30 / 60 / 90 / 120+ ladder per loan (roll-rate mechanics), not an independent draw. Conditioned on `risk_band`. |
| `outstanding_principal` | NUMERIC | Outstanding Principal | Remaining principal after this installment — enables dollar-weighted roll-rate and vintage analysis. |
| `is_charged_off` | BOOLEAN | Is Charged Off | True only once cumulative DPD crosses the charge-off threshold (FFIEC: 120 days installment / 180 days revolving). |

## Calculated fields

### `on_time_payment_rate` · FLOAT · Metric

- **Alias:** On-Time Payment Rate

Share of due instalments paid in full on time, as a fraction (0.97 = 97%). Instalment products only (BNPL, instalment loans); credit cards carry no schedule. Counts instalments due by today paid in full on or before the due date; a partial payment counts as not on time.

```sql
SAFE_DIVIDE(COUNTIF(due_date <= CURRENT_DATE() AND paid_date <= due_date AND paid_amount >= due_amount), COUNTIF(due_date <= CURRENT_DATE()))
```

### `delinquency_rate_30` · FLOAT · Metric

- **Alias:** 30+ DPD Rate (loans)

Share of loans that went 30+ days past due, as a fraction (0.05 = 5%). Instalment products only (BNPL, instalment loans); credit cards carry no schedule. Counted per loan, not per instalment: a loan with several late instalments counts once; loans with nothing due yet are left out.

```sql
SAFE_DIVIDE(COUNT(DISTINCT IF(days_past_due >= 30, loan_id, NULL)), COUNT(DISTINCT IF(due_date <= CURRENT_DATE(), loan_id, NULL)))
```

### `dpd_bucket` · STRING · Column

- **Alias:** DPD Bucket

Delinquency bucket of the instalment: Not yet due, Current, 30-59, 60-89 or 90+ days past due. Instalment products only (BNPL, instalment loans); credit cards carry no schedule. A row-level formula that behaves as a dimension: group and filter by it.

```sql
CASE WHEN due_date > CURRENT_DATE() THEN 'Not yet due' WHEN days_past_due >= 90 THEN '90+ DPD' WHEN days_past_due >= 60 THEN '60-89 DPD' WHEN days_past_due >= 30 THEN '30-59 DPD' ELSE 'Current' END
```

# Example Questions

- How does the rate of `loans` falling 90+ days behind differ across risk tiers?
- What share of lent principal ends up written off, and how does that build over the life of a `loan`?
- How many delinquent `loans` recover and return to good standing versus rolling into write-off?

## Joins

- [Loans](./loans.md) — `loan_id = loan_id` [N:1] — The loan this instalment is scheduled against.
  - [Loans Customer](./customer.md) — The borrower who owes this instalment.
  - [Loans Product](./product.md) — The lending product being repaid.
