---
title: "Healthcare"
description: |
  A hospital system modeled end to end — from a patient booking an appointment, through the
  clinical encounter that follows, to the insurance claim that pays for it. Patients, providers,
  payers and departments anchor the model, while appointments capture scheduling and no-show
  behavior, encounters capture diagnoses, length of stay and readmissions, claims capture the
  revenue cycle (billed, allowed and paid amounts, denials, days in accounts receivable), and
  daily bed census tracks capacity and patient flow across inpatient units. Together they tell
  the operational and financial story of running a health system: who is being seen, how care
  converts into cash, and where capacity is tight.

  **How this hospital is managed**
  - **Operations** — keeps inpatient beds available and the appointment book full of visits that actually happen.
  - **Revenue Cycle** — gets the hospital paid in full and on time for the care it delivers.
  - **Clinical** — sends inpatients home well and on time, so they do not come back within a month.

  **Key metrics**
  - Bed occupancy — [Bed Census (daily) · Bed Occupancy Rate](./bed-census-daily.md?field=occupancy_rate), occupied over staffed beds, a 0–1 ratio (0.85 = 85%).
  - No-show rate — [Appointments · No-Show Rate](./appointments.md?field=no_show_rate), missed visits over completed plus missed ones, a 0–1 ratio.
  - Denial rate — [Claims · Claim Denial Rate](./claims.md?field=denial_rate), denied over paid plus denied claims, a 0–1 ratio, by [Claims · Submitted At](./claims.md?field=submitted_at).
  - 30-day readmission rate — inpatient encounters flagged [Encounters · Is 30-Day Readmission](./encounters.md?field=is_readmission_30d).
  - Average length of stay — [Encounters · Average Length of Stay (inpatient)](./encounters.md?field=avg_length_of_stay).

  **Key Data Marts**
  - [Encounters](./encounters.md) — every visit and stay, with its diagnosis, length and readmission flag.
  - [Claims](./claims.md) — every bill sent to a payer, its outcome and how long it took to pay.
  - [Bed Census (daily)](./bed-census-daily.md) — staffed and occupied beds per unit, day by day.
  - [Appointments](./appointments.md) — every booking and whether the patient showed up.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-10-20T17:57:14Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Vlad Flaks](https://github.com/vladflaks), [Rus Obolonsky](https://github.com/Obolrus)

| Data Mart | Fields |
|-----------|--------|
| [Appointments](./appointments.md) | 9 |
| [Bed Census (daily)](./bed-census-daily.md) | 7 |
| [Claims](./claims.md) | 11 |
| [Department](./department.md) | 4 |
| [Encounters](./encounters.md) | 10 |
| [Patient](./patient.md) | 7 |
| [Payer](./payer.md) | 3 |
| [Provider](./provider.md) | 5 |

# Example Questions

- How does no-show rate vary by booking lead time and insurance type, and what would tightening scheduling windows save in lost capacity?
- What is the `claim` denial rate by `payer`, and how much longer do denied claims sit in accounts receivable than clean claims?
- Which `departments` are running closest to `bed capacity`, and how does occupancy move through the week and across the year?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/healthcare)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Healthcare model diagram](../res/screens/healthcare.svg)
