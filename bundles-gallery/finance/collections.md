---
type: "OWOX Data Mart"
title: "Collections"
description: |
  Every action taken to recover money from loans that have fallen behind — reminders, calls,
  restructures, and hand-offs to agencies — and what came of each. Tracks how much is
  recovered and how effective different approaches are once a loan is delinquent or written
  off. This is the last line of defense on losses.
tags: ["owox"]
timestamp: 2026-07-23T13:16:47.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `action_id` | STRING | PK. Unique identifier for the collections action. |
| `loan_id` | STRING | Delinquent loan being worked; rows exist only for loans that reached ≥30 DPD or `is_charged_off`. FK to [Loans](./loans.md) |
| `action_ts` | TIMESTAMP | When the action was taken. |
| `action_type` | STRING | One of `reminder` / `call` / `restructure` / `agency_handoff`. Early-stage (reminder/call) at low DPD; late-stage (restructure/agency_handoff) once charged off. |
| `outcome` | STRING | One of `promise_to_pay` / `paid` / `no_contact` / `dispute`. |
| `amount_recovered` | NUMERIC | Money recovered by this action; bounded by remaining balance. Cumulative recovery per charged-off loan stays well under 100% and decays with time since charge-off. |

# Example Questions

- Which collections actions recover the most money relative to how often they are used?
- After a loan is written off, how much is typically recovered, and how quickly does recovery taper off?
- Do earlier interventions (reminders and calls) reduce how many loans end up handed to an agency?

## Joins

- [Loans](./loans.md) — `loan_id = loan_id`
