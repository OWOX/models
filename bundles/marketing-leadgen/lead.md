---
type: "OWOX Data Mart"
title: "Lead"
description: |
  One row per lead or contact captured by marketing, carrying where they came from, their
  fit-and-engagement score, the dated milestones marking when they became marketing-qualified
  (MQL) and sales-qualified (SQL), and firmographics that mirror the account they belong to.
  Because the qualification milestones are dated rather than just a current-state label, leads
  can be grouped into cohorts — "leads created in March" — and tracked through the funnel over
  time, not just counted at a single point.
tags: ["owox"]
timestamp: 2026-07-23T17:34:32.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `lead_id` | STRING | PK. Unique identifier for each lead or contact. |
| `account_id` | STRING | Company the lead belongs to; null for a lead not yet matched to an account. FK to [Account](./account.md) |
| `created_at` | TIMESTAMP | When the lead first entered the system (coincides with the `is_lead_create` touchpoint). |
| `source_channel` | STRING | Channel that first brought in the lead. Equals the channel of the lead's `is_lead_create` touchpoint. Same controlled vocabulary as [Campaign](./campaign.md)`.channel`. |
| `lead_score` | INTEGER | Fit + engagement score for MQL gating. |
| `became_mql_at` | TIMESTAMP | When the lead reached marketing-qualified status; null if never MQL. `created_at ≤ became_mql_at`. |
| `became_sql_at` | TIMESTAMP | When the lead reached sales-qualified status; null if never SQL. `became_mql_at ≤ became_sql_at`. |
| `employee_band` | STRING | Company-size bucket. Same vocabulary as [Account](./account.md)`.employee_band`: `1-50` / `51-200` / `201-1000` / `1000+`. For matched leads, agrees with the account. |
| `industry` | STRING | Industry the lead's company operates in. For matched leads, agrees with the account. |
| `country` | STRING | Country where the lead is located; consistent with the account's `region`. |
| `lifecycle_stage` | STRING | `subscriber` / `lead` / `MQL` / `SQL` / `opportunity` / `customer`. Consistent with the `became_*_at` timestamps and with the existence of an [Opportunities](./opportunities.md) row. |

# Example Questions

- What is the lead-to-MQL and MQL-to-SQL conversion rate, and how many days does each stage typically take?
- Which source channels and industries produce the highest-scoring, fastest-qualifying leads?
- How much of the funnel is unmatched to an account, and does that share differ by source channel?

## Joins

- [Account](./account.md) — `account_id = account_id`
