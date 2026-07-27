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
tags: ["owox", "index"]
type: "index"
timestamp: 2026-07-27T16:53:04Z
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
- Which `departments` are running closest to `bed capacity`, and how does occupancy relate to admissions and discharges over time?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/healthcare)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

<img width="2510" height="1206" alt="healthcare" src="https://github.com/user-attachments/assets/0bd92b71-ed57-48c7-9ae8-da8ad27f8baf" />
