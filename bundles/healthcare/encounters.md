---
title: "Encounters"
description: |
  One row per clinical encounter — the actual visit that followed a scheduled appointment.
  Each encounter records its type (outpatient, inpatient or emergency department), the primary
  diagnosis, admission and discharge timestamps, the resulting length of stay, and whether it
  was an unplanned readmission within 30 days. This is where the clinical story lives: what
  patients are being treated for, how long they stay, and how often they come back
  unexpectedly. What each insured encounter was billed and paid is in [Claims](./claims.md).
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T08:48:44.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `encounter_id` | STRING | Encounter ID | PK. Unique clinical encounter identifier. |
| `appointment_id` | STRING | Appointment ID | Appointment that led to this encounter. FK to [Appointments](./appointments.md) |
| `patient_id` | STRING | Patient ID | Patient seen in the encounter. FK to [Patient](./patient.md) |
| `provider_id` | STRING | Provider ID | Provider who delivered care. |
| `admit_ts` | TIMESTAMP | Admit Time | Admission date and time. |
| `discharge_ts` | TIMESTAMP | Discharge Time | Discharge date and time. |
| `encounter_type` | STRING | Encounter Type | outpatient / inpatient / ED. |
| `primary_diagnosis` | STRING | Primary Diagnosis | Primary ICD-10 code. |
| `length_of_stay_days` | FLOAT | Length of Stay (Days) | Length of stay in days. |
| `is_readmission_30d` | BOOLEAN | Is 30-Day Readmission | Unplanned readmission within 30 days. |

## Calculated fields

### `inpatient_days` · FLOAT · Metric

- **Alias:** Inpatient Days

Inpatient stay-days from encounter records: length of stay summed over inpatient encounters only. Not bed-days: Bed Census counts about ten times more occupied bed-days. The numerator of Average Length of Stay.

```sql
SUM(IF(encounter_type = 'inpatient', length_of_stay_days, 0))
```

### `avg_length_of_stay` · FLOAT · Metric

- **Alias:** Average Length of Stay (inpatient)

Days per inpatient stay: Inpatient Days divided by inpatient encounters. Outpatient and ED visits are excluded. For the standard monthly ALOS, cut by discharge month (Discharge Time, `discharge_ts`). NULL where there is no inpatient stay.

```sql
SAFE_DIVIDE(inpatient_days, COUNTIF(encounter_type = 'inpatient'))
```

# Example Questions

- What is the 30-day readmission rate for inpatient stays, and which diagnoses show the highest recurrence?
- How does average length of stay differ across outpatient, inpatient and ED encounters?
- Which primary diagnoses account for the most encounter volume, and how does that mix differ between outpatient and inpatient care?

## Joins

- [Appointments](./appointments.md) — `appointment_id = appointment_id` [N:1] — The booking that brought the patient in.
  - [Appointments Department](./department.md) — The department the visit was booked into.
  - [Appointments Patient](./patient.md) — The patient as recorded on the booking.
  - [Appointments Provider](./provider.md) — The clinician the visit was booked with.
- [Patient](./patient.md) — `patient_id = patient_id` [N:1] — The patient treated in this encounter.
