---
title: "Loans"
description: |
  Every loan application and what happened to it — approved, declined, or withdrawn —
  through to how much was actually funded and at what rate. Captures the full underwriting
  funnel, the reasons applications are turned down, and the pricing applied to each borrower
  based on their risk. This is the origination story of the loan book.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-23T12:02:48.000Z
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
| `apr` | FLOAT | Apr | APR on the loan. Seeded from the product's rate-card `apr` and adjusted by a risk-based spread (higher for riskier bands). |
| `term_months` | INTEGER | Term Months | Loan term; selected from the product's stated term, not drawn independently. |
| `funded_at` | DATE | Funded At | Date funded; `≥ applied_at`; null unless funded. |
| `status` | STRING | Status | Current loan status. One of `current` / `delinquent` / `charged_off` / `paid_off`. |
| `decline_reason` | STRING | Decline Reason | Adverse-action reason (ECOA/Reg B); populated only when `decision = declined`. One of `insufficient_credit_history` / `debt_to_income_too_high` / `delinquent_credit_obligations` / `income_verification_failed` / `fraud_flag`. Weighted by `risk_band`. |

# Example Questions

- How do approval rates and interest rates vary across borrower risk tiers?
- Of the loans approved, what share actually gets funded, and where does the funnel leak?
- What are the most common reasons applications are declined, and how does that differ by risk tier?

## Joins

- [Customer](./customer.md) — `customer_id = customer_id` — The customer who applied for this loan.
- [Product](./product.md) — `product_id = product_id` — The lending product applied for.
