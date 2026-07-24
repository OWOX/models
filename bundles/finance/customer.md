---
type: "OWOX Data Mart"
title: "Customer"
description: |
  Everyone the business has taken on as a borrower, with the details that drive every
  downstream decision: how they were acquired, whether they passed identity and eligibility
  checks, their credit standing at sign-up, an internal risk tier, and whether they went on
  to fund an account. The starting point for understanding who your customers are and where
  they come from.
tags: ["owox"]
timestamp: 2026-07-23T12:02:47.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `customer_id` | STRING | PK. Unique customer identifier. |
| `signup_date` | DATE | Date the customer signed up. |
| `kyc_status` | STRING | `passed` / `pending` / `rejected`. Gates account opening — only `passed` customers get funded accounts. |
| `risk_band` | STRING | Internal risk tier — the model's central conditioning variable. One of `prime` / `near_prime` / `subprime` / `deep_subprime`. Drives loan approval odds, APR, delinquency (DPD) and charge-off downstream. |
| `credit_score` | INTEGER | Credit score at onboarding (~300–850). Consistent with `risk_band` (prime high, deep_subprime low). |
| `acquisition_channel` | STRING | Channel that brought the customer in (e.g. `organic`, `paid_search`, `paid_social`, `referral`, `partner`). |
| `region` | STRING | Customer's geographic region. |
| `is_funded` | BOOLEAN | Activation flag — the source of truth for whether the customer ever funded an account (only KYC-passed customers can be funded). Accounts derives its `activated_at` from this: a customer is funded **iff** they have ≥1 account with a non-null `activated_at` (the two are kept consistent by construction). |

# Example Questions

- Which marketing channels bring in the highest share of low-risk, creditworthy customers?
- How many people pass the initial checks but never open a funded account — and where are they lost?
- Does a customer's credit standing at sign-up line up with whether they become an active, funded borrower?
