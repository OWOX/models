---
type: "OWOX Data Mart"
title: "Opportunities"
description: |
  One row per sales opportunity — the deal object, keyed to the account rather than a single
  lead, since real B2B buying committees involve multiple people. Each row carries the pipeline
  stage, the deal size (ACV), the sourcing lead and campaign, and the win/loss outcome with
  close date and sales-cycle length. This is where marketing-sourced pipeline turns into — or
  fails to turn into — closed revenue.
tags: ["owox"]
timestamp: 2026-07-23T17:34:32.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `opportunity_id` | STRING | PK. Unique identifier for each sales opportunity. |
| `account_id` | STRING | Account the deal belongs to — the primary spine. FK to [Account](./account.md) |
| `lead_id` | STRING | Sourcing/converting lead the opportunity originated from; nullable. FK to [Lead](./lead.md) |
| `primary_campaign_id` | STRING | Primary Campaign Source (single-touch sourcing); nullable. Equals the campaign of the sourcing lead's `is_lead_create` touchpoint. FK to [Campaign](./campaign.md) |
| `created_at` | TIMESTAMP | When the opportunity was created. |
| `stage` | STRING | Current pipeline stage. One of: `discovery`, `demo`, `proposal`, `negotiation`, `closed_won`, `closed_lost`. |
| `amount` | NUMERIC | ACV / deal size (USD). Correlates with the account's `employee_band`. |
| `close_date` | DATE | Date the opportunity was won or lost; null while open. |
| `is_won` | BOOLEAN | True iff `stage = closed_won` (then `close_date` is set); false with a `close_date` means `closed_lost`. |
| `sales_cycle_days` | INTEGER | `DATE_DIFF(close_date, created_at, DAY)` for closed deals; null while open. |
| `owner` | STRING | Sales rep who owns the opportunity (drawn from a small stable roster). |

# Example Questions

- What is the win rate and average sales cycle by deal size, industry or account segment?
- Which accounts, campaigns or reps are driving the most pipeline and revenue?
- Do target (ABM) accounts close bigger and faster deals than non-target accounts?

## Joins

- [Account](./account.md) — `account_id = account_id`
- [Campaign](./campaign.md) — `primary_campaign_id = campaign_id`
- [Lead](./lead.md) — `lead_id = lead_id`
