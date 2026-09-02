---
title: "Trials"
description: |
  Every trial and how it ended — converted to paid or not — with when it started and expired,
  where it came from (self-serve, sales-assisted, product-led upsell), and the plan it was
  evaluating. The top of the funnel for new recurring revenue.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-11T08:35:35.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `trial_id` | STRING | Trial ID | PK. Unique trial identifier. |
| `account_id` | STRING | Account ID | Account running the trial. FK to [Account](./account.md) |
| `started_at` | TIMESTAMP | Started At | When the trial began. |
| `ends_at` | TIMESTAMP | Ends At | Scheduled trial expiry. |
| `converted_at` | TIMESTAMP | Converted At | When the trial converted to a paid plan, if it did. |
| `is_converted` | BOOLEAN | Is Converted | Trial-to-paid outcome flag. |
| `trial_source` | STRING | Trial Source | Where the trial came from (self-serve, sales-assisted, PLG upsell). |
| `requested_plan` | STRING | Requested Plan | Plan tier the trial is evaluating. |

# Example Questions

- What is the trial-to-paid conversion rate, and how does it differ by trial source?
- How long do trials take to convert, and does evaluating a higher tier change the odds?
- Which trial sources bring in the `accounts` that go on to be worth the most?

## Joins

- [Account](./account.md) — `account_id = account_id` — The account that ran the trial.
