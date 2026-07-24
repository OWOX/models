---
type: "OWOX Data Mart"
title: "Loans"
description: |
  Every loan application and what happened to it — approved, declined, or withdrawn —
  through to how much was actually funded and at what rate. Captures the full underwriting
  funnel, the reasons applications are turned down, and the pricing applied to each borrower
  based on their risk. This is the origination story of the loan book.
tags: ["owox"]
timestamp: 2026-07-23T12:02:48.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `loan_id` | STRING | PK. Unique loan identifier. |
| `customer_id` | STRING | Borrowing customer. FK to [Customer](./customer.md) |
| `product_id` | STRING | Loan product applied for. FK to [Product](./product.md) |
| `applied_at` | DATE | Date the loan was applied for. |
| `decision` | STRING | `approved` / `declined` / `withdrawn`. Approval odds conditioned on the customer's `risk_band`. |
| `approved_amount` | NUMERIC | Amount approved at underwriting; null unless `decision = approved`. |
| `funded_amount` | NUMERIC | Amount actually funded; `≤ approved_amount`; null unless funded. Approved → funded is the pull-through rate. |
| `apr` | FLOAT | APR on the loan. Seeded from the product's rate-card `apr` and adjusted by a risk-based spread (higher for riskier bands). |
| `term_months` | INTEGER | Loan term; selected from the product's stated term, not drawn independently. |
| `funded_at` | DATE | Date funded; `≥ applied_at`; null unless funded. |
| `status` | STRING | Current loan status. One of `current` / `delinquent` / `charged_off` / `paid_off`. |
| `decline_reason` | STRING | Adverse-action reason (ECOA/Reg B); populated only when `decision = declined`. One of `insufficient_credit_history` / `debt_to_income_too_high` / `delinquent_credit_obligations` / `income_verification_failed` / `fraud_flag`. Weighted by `risk_band`. |

# Example Questions

- How do approval rates and interest rates vary across borrower risk tiers?
- Of the loans approved, what share actually gets funded, and where does the funnel leak?
- What are the most common reasons applications are declined, and how does that differ by risk tier?

## Joins

- [Customer](./customer.md) — `customer_id = customer_id`
- [Product](./product.md) — `product_id = product_id`
