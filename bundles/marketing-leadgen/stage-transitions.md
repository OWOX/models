---
title: "Stage Transitions"
description: |
  One row per pipeline stage change for a sales opportunity, tracing each deal's path through
  discovery, demo, proposal and negotiation on the way to a win or a loss. The time spent in
  each stage before moving to the next is the raw material for bottleneck analysis — where deals
  get stuck, and for how long.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-23T17:34:32.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `transition_id` | STRING | Transition ID | PK. Unique identifier for the stage change. |
| `opportunity_id` | STRING | Opportunity ID | Opportunity that moved stage. FK to [Opportunities](./opportunities.md) |
| `from_stage` | STRING | From Stage | Stage the opportunity left. |
| `to_stage` | STRING | To Stage | Stage the opportunity entered. Contiguous chain: `to_stage` of row n = `from_stage` of row n+1; the last `to_stage` equals `Opportunities.stage`. |
| `transitioned_at` | TIMESTAMP | Transitioned At | When the stage change happened. Within `[Opportunities.created_at, close_date]`. |
| `days_in_from_stage` | INTEGER | Days In From Stage | Days spent in the previous stage — the velocity bottleneck driver. Sums (per opportunity) to the sales cycle for closed deals. |

# Example Questions

- Which pipeline stage is the biggest bottleneck, and does that differ for won versus lost deals?
- How long, on average, does a deal spend in proposal or negotiation before closing?
- How often do `opportunities` move backward a stage, and does that predict a lower win rate?

## Joins

- [Opportunities](./opportunities.md) — `opportunity_id = opportunity_id`
