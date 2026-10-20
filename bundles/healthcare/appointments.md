---
title: "Appointments"
description: |
  One row per scheduled appointment, capturing how a visit was booked and whether the patient
  actually showed up. Each row links a patient, a provider and a department, records the
  scheduled date and time, how far in advance it was booked (lead time), how long the patient
  waited past that time, whether they were a no-show, and the appointment's final status. This
  is the front door of the clinical and revenue cycle — every [encounter](./encounters.md) and
  [claim](./claims.md) downstream starts as a booked appointment here.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T08:48:42.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `appointment_id` | STRING | Appointment ID | PK. Unique appointment identifier. |
| `patient_id` | STRING | Patient ID | Patient who booked the appointment. FK to [Patient](./patient.md) |
| `provider_id` | STRING | Provider ID | Provider seeing the patient. FK to [Provider](./provider.md) |
| `scheduled_at` | TIMESTAMP | Scheduled At | Scheduled date and time of the appointment. |
| `department_id` | STRING | Department ID | Department where the appointment takes place. FK to [Department](./department.md) |
| `status` | STRING | Status | Appointment status (e.g. booked, completed, cancelled). |
| `is_no_show` | BOOLEAN | Is No-Show | Whether the patient failed to show up. |
| `wait_minutes` | INTEGER | Wait Minutes | Door-to-provider wait. |
| `lead_time_days` | INTEGER | Lead Time Days | Booking-to-visit lead time — no-show driver. |

## Calculated fields

### `no_show_rate` · FLOAT · Metric

- **Alias:** No-Show Rate

Share of attended-or-missed appointments the patient missed: no-shows divided by completed plus no-show visits. Cancelled and still-booked appointments are left out of both sides.

```sql
SAFE_DIVIDE(COUNTIF(is_no_show), COUNTIF(status IN ('completed', 'no-show')))
```

### `lead_time_band` · STRING · Column

- **Alias:** Booking Lead Time Band

How far ahead the visit was booked: 0-3 days, 4-14 days, 15-30 days or 31+ days. A row-level formula that behaves as a dimension: group and filter by it.

```sql
CASE WHEN lead_time_days <= 3 THEN '0-3 days' WHEN lead_time_days <= 14 THEN '4-14 days' WHEN lead_time_days <= 30 THEN '15-30 days' ELSE '31+ days' END
```

# Example Questions

- How does no-show rate change with booking lead time, and which lead-time windows should scheduling policy target first?
- Which `departments` or `providers` have the longest `patient` wait times, and is that linked to no-show behavior?
- What share of scheduled appointments convert to completed visits versus cancellations and no-shows?

## Joins

- [Department](./department.md) — `department_id = department_id` [N:1] — The department the appointment was booked into.
- [Patient](./patient.md) — `patient_id = patient_id` [N:1] — The patient the appointment was booked for.
- [Provider](./provider.md) — `provider_id = provider_id` [N:1] — The clinician the appointment was booked with.
