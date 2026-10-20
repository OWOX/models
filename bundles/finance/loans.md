---
title: "Loans"
description: |
  Every loan application and what happened to it — approved, declined, or withdrawn —
  through to how much was actually funded and at what rate. Captures the full underwriting
  funnel, the reasons applications are turned down, and the pricing applied to each borrower
  based on their risk. This is the origination story of the loan book.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T12:55:11.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `loan_id` | STRING | Loan ID | PK. Unique loan identifier. |
| `customer_id` | STRING | Customer ID | Borrowing customer. FK to [Customer](./customer.md) |
| `product_id` | STRING | Product ID | Loan product applied for. FK to [Product](./product.md) |
| `applied_at` | DATE | Applied At | Date the loan was applied for. |
| `decision` | STRING | Decision | `approved` / `declined` / `withdrawn`. Approval odds conditioned on the customer's `risk_band`. |
| `approved_amount` | NUMERIC | Approved Amount | Amount approved at underwriting; null unless `decision = approved`. |
| `funded_amount` | NUMERIC | Funded Amount | Amount actually funded; `≤ approved_amount`; null unless funded. Approved → funded is the pull-through rate. |
| `apr` | FLOAT | APR | APR on the loan. Seeded from the product's rate-card `apr` and adjusted by a risk-based spread (higher for riskier bands). |
| `term_months` | INTEGER | Term (months) | Loan term; selected from the product's stated term, not drawn independently. |
| `funded_at` | DATE | Funded At | Date funded; `≥ applied_at`; null unless funded. |
| `status` | STRING | Status | Current loan status. One of `current` / `delinquent` / `charged_off` / `paid_off`; null for an application that was never funded. |
| `decline_reason` | STRING | Decline Reason | Adverse-action reason (ECOA/Reg B); populated only when `decision = declined`. One of `insufficient_credit_history` / `debt_to_income_too_high` / `delinquent_credit_obligations` / `income_verification_failed` / `fraud_flag`. Weighted by `risk_band`. |

## Calculated fields

### `funded_loans` · INTEGER · Metric

- **Alias:** Funded Loans

Number of loans actually funded (money paid out). Approved applications the borrower never drew down are not counted.

```sql
COUNTIF(funded_amount IS NOT NULL)
```

### `approval_rate` · FLOAT · Metric

- **Alias:** Approval Rate

Share of decided applications approved, as a fraction (0.74 = 74%): approved over approved plus declined. Withdrawn applications never got a decision and are left out of both sides.

```sql
SAFE_DIVIDE(COUNTIF(decision = 'approved'), COUNTIF(decision IN ('approved', 'declined')))
```

### `avg_loan_size` · FLOAT · Metric

- **Alias:** Average Loan Size

Average funded amount per funded loan, in dollars. Total funded over Funded Loans; applications that were declined, withdrawn or never drawn down do not dilute it.

```sql
SAFE_DIVIDE(SUM(funded_amount), funded_loans)
```

### `weighted_avg_apr` · FLOAT · Metric

- **Alias:** Weighted Avg APR (funded)

APR weighted by funded dollars, as a fraction (0.17 = 17%) — the contract rate at funding, before losses. Covers every loan ever funded, including paid-off and charged-off ones; it is not interest earned over average balance. Declined and unfunded applications carry a quoted APR but no dollars, so they do not move it; a plain average of APR would count them.

```sql
SAFE_DIVIDE(SUM(apr * funded_amount), SUM(funded_amount))
```

# Example Questions

- How do approval rates and interest rates vary across borrower risk tiers?
- Of the loans approved, what share actually gets funded, and where does the funnel leak?
- What are the most common reasons applications are declined, and how does that differ by risk tier?

## Joins

- [Customer](./customer.md) — `customer_id = customer_id` [N:1] — The customer who applied for this loan.
- [Product](./product.md) — `product_id = product_id` [N:1] — The lending product applied for.
