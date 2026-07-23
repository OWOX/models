---
type: "OWOX Data Mart"
title: "Account"
description: |
  One row per target company, the firmographic backbone the rest of the model hangs off. Every
  account carries an industry, an employee-count band and a region, plus a flag marking whether
  it sits on the account-based marketing (ABM) target list. Because real B2B deals belong to
  accounts rather than to whichever individual filled out a form, this mart is the join point
  that lets leads, opportunities and touchpoints be rolled up to "who is this company, and how
  big an opportunity is it."
tags: ["owox"]
timestamp: 2026-07-23T17:34:31.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `account_id` | STRING | PK. Unique identifier for the target company. |
| `name` | STRING | Company name. |
| `industry` | STRING | Industry the company operates in. |
| `employee_band` | STRING | Company-size bucket — the mid-market segmentation axis. Vocabulary: `1-50` / `51-200` / `201-1000` / `1000+`. |
| `region` | STRING | Geographic region of the company. |
| `is_target_account` | BOOLEAN | Whether the company is on the ABM target list. ~10–20% of accounts, skewed toward larger `employee_band`; target accounts show higher engagement, pipeline and win rate. |

# Example Questions

- How is the account base distributed across industries, company sizes and regions?
- Do target accounts on the ABM list actually generate more pipeline and win more often than the rest of the book?
- Which industries or employee bands should the target-account list be expanded into?
