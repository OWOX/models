---
type: "OWOX Data Mart"
title: "Payer"
description: |
  Reference list of the insurance payers and plans that reimburse the health system for care,
  each identified by name and plan type — HMO, PPO, EPO or government (Medicare/Medicaid). Every
  claim is billed to one of these payers, so this mart is the lookup behind any payer-mix or
  reimbursement analysis.
tags: ["owox"]
timestamp: 2026-07-23T17:34:12.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `payer_id` | STRING | PK. Unique payer identifier. |
| `name` | STRING | Payer / insurance plan name. |
| `plan_type` | STRING | HMO / PPO / EPO / government. |

# Example Questions

- What is the split between government and commercial plan types among the payers the system bills?
- Which payers make up the largest share of billed claim volume?
- How does reimbursement performance differ between HMO, PPO and EPO plans?
