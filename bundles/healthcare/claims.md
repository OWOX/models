---
type: "OWOX Data Mart"
title: "Claims"
description: |
  One row per claim submitted to a payer for a clinical encounter — the revenue-cycle record
  that turns care into cash. Each claim tracks the billed, payer-allowed and actually paid
  amounts, its submission and payment dates, current status, the denial reason when one
  applies, and the number of days it has sat in accounts receivable. This is the mart that
  answers how well the health system gets paid for the care it delivers, and how quickly.
tags: ["owox"]
timestamp: 2026-07-23T17:34:13.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `claim_id` | STRING | PK. Unique claim identifier. |
| `encounter_id` | STRING | Encounter the claim is billed for. FK to [Encounters](./encounters.md) |
| `payer_id` | STRING | Payer responsible for the claim. FK to [Payer](./payer.md) |
| `submitted_at` | DATE | Date the claim was submitted. |
| `paid_at` | DATE | Date the claim was paid. |
| `billed_amount` | NUMERIC | Amount billed to the payer. |
| `allowed_amount` | NUMERIC | Payer-allowed amount. |
| `paid_amount` | NUMERIC | Amount actually paid. |
| `status` | STRING | Claim status (e.g. submitted, paid, denied). |
| `denial_code` | STRING | CARC/RARC denial reason, when denied. |
| `ar_days` | INTEGER | Days in accounts receivable — revenue-cycle speed. |

# Example Questions

- What is the claim denial rate, and which denial reasons account for the most lost revenue?
- How much longer do denied claims spend in accounts receivable than clean, paid claims?
- How does the gap between billed and paid amounts vary by payer?

## Joins

- [Encounters](./encounters.md) — `encounter_id = encounter_id`
- [Payer](./payer.md) — `payer_id = payer_id`
