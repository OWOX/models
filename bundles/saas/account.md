---
title: "Account"
description: |
  Every customer account (a company), with the signals that frame the whole relationship:
  industry, size and region, the plan tier they are on, a revenue size band, the channel
  that acquired them, their success-manager owner, a product-health score, and where they
  sit in the lifecycle (trial, active, at-risk, churned). The dimension you slice the entire
  business by.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-23T12:51:25.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `account_id` | STRING | Account ID | PK. Unique account identifier. |
| `name` | STRING | Name | Company/account name. |
| `industry` | STRING | Industry | Industry vertical of the account. |
| `employee_band` | STRING | Employee Band | Company-size bucket by headcount. |
| `plan_tier` | STRING | Plan Tier | Subscription plan tier. |
| `mrr_band` | STRING | MRR Band | Monthly-recurring-revenue size bucket. |
| `region` | STRING | Region | Sales/geographic region. |
| `acquisition_channel` | STRING | Acquisition Channel | Marketing channel that sourced the account — blended-CAC join key. |
| `signup_date` | DATE | Signup Date | Date the account first signed up. |
| `csm_owner` | STRING | CSM Owner | Customer success manager who owns the account. |
| `health_score` | INTEGER | Health Score | 0–100 product-health composite. |
| `lifecycle_stage` | STRING | Lifecycle Stage | trial / active / at-risk / churned. |

# Example Questions

- Which industries and company sizes carry the healthiest accounts and the highest revenue bands?
- How does the mix of at-risk versus healthy accounts differ across acquisition channels?
- Do accounts with a dedicated success manager show better health and lifecycle outcomes?
