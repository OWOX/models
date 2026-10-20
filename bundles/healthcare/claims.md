---
title: "Claims"
description: |
  One row per claim submitted to a [payer](./payer.md) for a clinical
  [encounter](./encounters.md) — the revenue-cycle record that turns care into cash. Each claim
  tracks the billed, payer-allowed and actually paid amounts, its submission and payment dates,
  current status, the denial reason when one applies, and the number of days it has sat in
  accounts receivable. This is the mart that
  answers how well the health system gets paid for the care it delivers, and how quickly.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T08:48:47.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `claim_id` | STRING | Claim ID | PK. Unique claim identifier. |
| `encounter_id` | STRING | Encounter ID | Encounter the claim is billed for. FK to [Encounters](./encounters.md) |
| `payer_id` | STRING | Payer ID | Payer responsible for the claim. FK to [Payer](./payer.md) |
| `submitted_at` | DATE | Submitted At | Date the claim was submitted. |
| `paid_at` | DATE | Paid At | Date the claim was paid. |
| `billed_amount` | NUMERIC | Billed Amount | Amount billed to the payer. |
| `allowed_amount` | NUMERIC | Allowed Amount | Payer-allowed amount. |
| `paid_amount` | NUMERIC | Paid Amount | Amount actually paid. |
| `status` | STRING | Status | Claim status (e.g. submitted, paid, denied). |
| `denial_code` | STRING | Denial Code | CARC/RARC denial reason, when denied. |
| `ar_days` | INTEGER | AR Days | Days in accounts receivable — revenue-cycle speed. |

## Calculated fields

### `denial_rate` · FLOAT · Metric

- **Alias:** Claim Denial Rate

Share of adjudicated claims the payer denied: denied divided by paid plus denied. Pending (submitted) claims are left out of both sides, so recent submission months read high until their payments post.

```sql
SAFE_DIVIDE(COUNTIF(status = 'denied'), COUNTIF(status IN ('paid', 'denied')))
```

### `net_collection_rate` · FLOAT · Metric

- **Alias:** Paid-to-Allowed Rate (paid claims)

Cash collected per allowed dollar, on paid claims only: paid divided by allowed amount. Denial loss is not in it, so it is not a full net collection rate; read it with Claim Denial Rate.

```sql
SAFE_DIVIDE(SUM(IF(status = 'paid', paid_amount, 0)), SUM(IF(status = 'paid', allowed_amount, 0)))
```

### `revenue_per_encounter` · FLOAT · Metric

- **Alias:** Payment per Paid Encounter

Dollars received per encounter whose claim is paid: paid amount divided by distinct paid encounters. Denied and pending claims are left out of both sides, so denials do not pull it down.

```sql
SAFE_DIVIDE(SUM(IF(status = 'paid', paid_amount, 0)), COUNT(DISTINCT IF(status = 'paid', encounter_id, NULL)))
```

# Example Questions

- What is the claim denial rate, and which denial reasons account for the most lost revenue?
- How much longer do denied claims spend in accounts receivable than clean, paid claims?
- How does the gap between billed and paid amounts vary by `payer`?

## Joins

- [Encounters](./encounters.md) — `encounter_id = encounter_id` [N:1] — The encounter being billed.
  - [Encounters Appointments](./appointments.md) — The booking behind the billed encounter.
    - [Encounters Appointments Department](./department.md) — The department that delivered the billed care.
    - [Encounters Appointments Patient](./patient.md) — The patient as recorded on the booking, not on the encounter.
    - [Encounters Appointments Provider](./provider.md) — The clinician who delivered the billed care.
  - [Encounters Patient](./patient.md) — The patient treated in the billed encounter.
- [Payer](./payer.md) — `payer_id = payer_id` [N:1] — The insurer billed for this claim.
