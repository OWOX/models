---
type: "OWOX Data Mart"
title: "Product"
description: |
  The catalog of products the business offers — deposits, cards, loans, and
  buy-now-pay-later — each with its headline rate and standard term. For deposits the rate
  is what the business pays the customer; for credit products it is what the customer is
  charged. This is the lookup that gives every account and loan its pricing context.
tags: ["owox"]
timestamp: 2026-07-23T12:02:47.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `product_id` | STRING | PK. Unique product identifier. |
| `name` | STRING | Product display name. |
| `product_type` | STRING | `deposit` / `card` / `loan` / `BNPL`. |
| `apr` | FLOAT | Rate-card reference rate. Meaning depends on `product_type`: for `deposit` it is the APY *paid to* the customer (low, ~0.5–4%); for `card` / `loan` / `BNPL` it is the rate *charged to* the customer. `Loans.apr` is seeded from this and adjusted by risk-based spread. |
| `term_months` | INTEGER | Stated product term in months. (BNPL "Pay in 4" is modeled here as a short months-denominated term — a deliberate simplification, not real biweekly installments.) |

# Example Questions

- How does the rate charged on lending products compare with the rate paid out on deposits?
- Which product types carry the longest terms, and how does that shape the revenue they generate?
- How is the customer base split between savings products and credit products?
