---
type: "OWOX Data Mart"
title: "Trials"
description: |
  Every trial and how it ended — converted to paid or not — with when it started and expired,
  where it came from (self-serve, sales-assisted, product-led upsell), and the plan it was
  evaluating. The top of the funnel for new recurring revenue.
tags: ["owox"]
timestamp: 2026-07-23T12:51:27.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `trial_id` | STRING | PK. Unique trial identifier. |
| `account_id` | STRING | Account running the trial. FK to [Account](./account.md) |
| `started_at` | TIMESTAMP | When the trial began. |
| `ends_at` | TIMESTAMP | Scheduled trial expiry. |
| `converted_at` | TIMESTAMP | When the trial converted to a paid plan, if it did. |
| `is_converted` | BOOLEAN | Trial-to-paid outcome flag. |
| `trial_source` | STRING | Where the trial came from (self-serve, sales-assisted, PLG upsell). |
| `requested_plan` | STRING | Plan tier the trial is evaluating. |

# Example Questions

- What is the trial-to-paid conversion rate, and how does it differ by trial source?
- How long do trials take to convert, and does evaluating a higher tier change the odds?
- Which trial sources bring in the accounts that go on to be worth the most?

## Joins

- [Account](./account.md) — `account_id = account_id`
