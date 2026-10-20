---
title: "Lead"
description: |
  One row per lead or contact captured by marketing, carrying where they came from, their
  fit-and-engagement score, the dated milestones marking when they became marketing-qualified
  (MQL) and sales-qualified (SQL), and firmographics that mirror the [account](./account.md) they belong to.
  Because the qualification milestones are dated rather than just a current-state label, leads
  can be grouped into cohorts — "leads created in March" — and tracked through the funnel over
  time, not just counted at a single point.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T10:17:02.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `lead_id` | STRING | Lead ID | PK. Unique identifier for each lead or contact. |
| `account_id` | STRING | Account ID | Company the lead belongs to; null for a lead not yet matched to an account. FK to [Account](./account.md) |
| `created_at` | TIMESTAMP | Created At | When the lead first entered the system (coincides with the `is_lead_create` touchpoint). |
| `source_channel` | STRING | Source Channel | Channel that first brought in the lead. Equals the channel of the lead's `is_lead_create` touchpoint. Same controlled vocabulary as [Campaign](./campaign.md)`.channel`. |
| `lead_score` | INTEGER | Lead Score | Fit + engagement score for MQL gating. |
| `became_mql_at` | TIMESTAMP | Became MQL At | When the lead reached marketing-qualified status; null if never MQL. `created_at ≤ became_mql_at`. |
| `became_sql_at` | TIMESTAMP | Became SQL At | When the lead reached sales-qualified status; null if never SQL. `became_mql_at ≤ became_sql_at`. |
| `employee_band` | STRING | Employee Band | Company-size bucket. Same vocabulary as [Account](./account.md)`.employee_band`: `1-50` / `51-200` / `201-1000` / `1000+`. For matched leads, agrees with the account. |
| `industry` | STRING | Industry | Industry the lead's company operates in. For matched leads, agrees with the account. |
| `country` | STRING | Country | Country where the lead is located; consistent with the account's `region`. |
| `lifecycle_stage` | STRING | Lifecycle Stage | `subscriber` / `lead` / `MQL` / `SQL` / `opportunity` / `customer`. Consistent with the `became_*_at` timestamps and with the existence of an [Opportunities](./opportunities.md) row. |

## Calculated fields

### `mqls` · INTEGER · Metric

- **Alias:** MQLs

Leads that reached marketing-qualified status, counted once each. Cut by Became MQL At for MQLs per month; by Created At to follow a lead cohort.

```sql
COUNTIF(became_mql_at IS NOT NULL)
```

### `sqls` · INTEGER · Metric

- **Alias:** SQLs

Leads that reached sales-qualified status, counted once each; every SQL was an MQL first. Cut by Became SQL At for SQLs per month.

```sql
COUNTIF(became_sql_at IS NOT NULL)
```

### `lead_to_mql_rate` · FLOAT · Metric

- **Alias:** Lead-to-MQL Rate

Share of leads that became MQLs, per lead created. Cut by Created At, never by Became MQL At (that keeps only MQLs and reads 100%). Leads of the last two months are still qualifying.

```sql
SAFE_DIVIDE(mqls, COUNT(lead_id))
```

### `mql_to_sql_rate` · FLOAT · Metric

- **Alias:** MQL-to-SQL Rate

Share of MQLs that became SQLs, per MQL. Reads MQLs and SQLs, so the three always agree. Cut by Became MQL At or Created At; MQLs of the last two months are still being worked.

```sql
SAFE_DIVIDE(sqls, mqls)
```

### `sql_to_opp_rate` · FLOAT · Metric

- **Alias:** SQL-to-Opportunity Rate

Share of SQLs that became opportunities, per SQL; a lead at opportunity or customer stage counts. Reads SQLs. Cut by Became SQL At or Created At; SQLs of the last month are still converting.

```sql
SAFE_DIVIDE(COUNTIF(lifecycle_stage IN ('opportunity', 'customer')), sqls)
```

# Example Questions

- What is the lead-to-MQL and MQL-to-SQL conversion rate, and how many days does each `stage` typically take?
- Which source channels and industries produce the highest-scoring, fastest-qualifying leads?
- How much of the funnel is unmatched to an `account`, and does that share differ by source channel?

## Joins

- [Account](./account.md) — `account_id = account_id` [N:1] — The company the lead works for.
