---
title: "Opportunities"
description: |
  One row per sales opportunity — the deal object, keyed to the account rather than a single
  lead, since real B2B buying committees involve multiple people. Each row carries the pipeline
  stage, the deal size (ACV), the sourcing [lead](./lead.md) and [campaign](./campaign.md), and the win/loss outcome with
  close date and sales-cycle length. Each deal's path through the stages is recorded in
  [Stage Transitions](./stage-transitions.md). This is where marketing-sourced pipeline turns into — or
  fails to turn into — closed revenue.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T10:17:02.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `opportunity_id` | STRING | Opportunity ID | PK. Unique identifier for each sales opportunity. |
| `account_id` | STRING | Account ID | Account the deal belongs to — the primary spine. FK to [Account](./account.md) |
| `lead_id` | STRING | Lead ID | Sourcing/converting lead the opportunity originated from; nullable. FK to [Lead](./lead.md) |
| `primary_campaign_id` | STRING | Primary Campaign ID | Primary Campaign Source (single-touch sourcing); nullable. Equals the campaign of the sourcing lead's `is_lead_create` touchpoint. FK to [Campaign](./campaign.md) |
| `created_at` | TIMESTAMP | Created At | When the opportunity was created. |
| `stage` | STRING | Stage | Current pipeline stage. One of: `discovery`, `demo`, `proposal`, `negotiation`, `closed_won`, `closed_lost`. |
| `amount` | NUMERIC | Amount | ACV / deal size (USD). Correlates with the account's `employee_band`. |
| `close_date` | DATE | Close Date | Date the opportunity was won or lost; null while open. |
| `is_won` | BOOLEAN | Is Won | True iff `stage = closed_won` (then `close_date` is set); false with a `close_date` means `closed_lost`. |
| `sales_cycle_days` | INTEGER | Sales Cycle Days | `DATE_DIFF(close_date, created_at, DAY)` for closed deals; null while open. |
| `owner` | STRING | Owner | Sales rep who owns the opportunity (drawn from a small stable roster). |

## Calculated fields

### `opp_to_won_rate` · FLOAT · Metric

- **Alias:** Opp-to-Won Rate

Share of opportunities won, per opportunity created — open deals stay in the base. Cut by Created At for a cohort. About half of every cohort, old or new, is still open, so even old cohorts never mature. Not won ÷ closed.

```sql
SAFE_DIVIDE(COUNTIF(is_won), COUNT(opportunity_id))
```

### `won_revenue` · NUMERIC · Metric

- **Alias:** Closed-Won Revenue

Deal amount on won opportunities, USD, summed; open and lost deals add nothing. Cut by Close Date for bookings by month or quarter.

```sql
SUM(IF(is_won, amount, 0))
```

### `deal_size_band` · STRING · Column

- **Alias:** Deal Size Band

Small (<$15K), Mid ($15-50K), Large ($50-100K) or Enterprise ($100K+), by deal amount. A row-level formula that behaves as a dimension: group and filter by it.

```sql
CASE WHEN amount < 15000 THEN 'Small (<$15K)' WHEN amount < 50000 THEN 'Mid ($15-50K)' WHEN amount < 100000 THEN 'Large ($50-100K)' WHEN amount >= 100000 THEN 'Enterprise ($100K+)' END
```

# Example Questions

- What is the win rate and average sales cycle by deal size, industry or `account` segment?
- Which `accounts`, `campaigns` or reps are driving the most pipeline and revenue?
- Do target (ABM) `accounts` close bigger and faster deals than non-target accounts?

## Joins

- [Account](./account.md) — `account_id = account_id` [N:1] — The company the deal is with.
- [Campaign](./campaign.md) — `primary_campaign_id = campaign_id` [N:1] — The campaign credited with sourcing the deal.
- [Lead](./lead.md) — `lead_id = lead_id` [N:1] — The lead the deal grew out of.
  - [Lead Account](./account.md) — The lead's own company, which can differ from the account the deal is booked to.
