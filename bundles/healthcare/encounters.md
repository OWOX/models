---
type: "OWOX Data Mart"
title: "Encounters"
description: |
  One row per clinical encounter — the actual visit that followed a scheduled appointment.
  Each encounter records its type (outpatient, inpatient or emergency department), the primary
  diagnosis, admission and discharge timestamps, the resulting length of stay, and whether it
  was an unplanned readmission within 30 days. This is where the clinical story lives: what
  patients are being treated for, how long they stay, and how often they come back
  unexpectedly.
tags: ["owox"]
timestamp: 2026-07-23T17:34:13.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `encounter_id` | STRING | PK. Unique clinical encounter identifier. |
| `appointment_id` | STRING | Appointment that led to this encounter. FK to [Appointments](./appointments.md) |
| `patient_id` | STRING | Patient seen in the encounter. FK to [Patient](./patient.md) |
| `provider_id` | STRING | Provider who delivered care. |
| `admit_ts` | TIMESTAMP | Admission date and time. |
| `discharge_ts` | TIMESTAMP | Discharge date and time. |
| `encounter_type` | STRING | outpatient / inpatient / ED. |
| `primary_diagnosis` | STRING | Primary ICD-10 code. |
| `length_of_stay_days` | FLOAT | Length of stay in days. |
| `is_readmission_30d` | BOOLEAN | Unplanned readmission within 30 days. |

# Example Questions

- What is the 30-day readmission rate for inpatient stays, and which diagnoses show the highest recurrence?
- How does average length of stay differ across outpatient, inpatient and ED encounters?
- Which primary diagnoses account for the most encounter volume, and how does that mix differ between outpatient and inpatient care?

## Joins

- [Appointments](./appointments.md) — `appointment_id = appointment_id`
- [Patient](./patient.md) — `patient_id = patient_id`
