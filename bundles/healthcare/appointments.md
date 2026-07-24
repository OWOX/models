---
type: "OWOX Data Mart"
title: "Appointments"
description: |
  One row per scheduled appointment, capturing how a visit was booked and whether the patient
  actually showed up. Each row links a patient, a provider and a department, records the
  scheduled date and time, how far in advance it was booked (lead time), how long the patient
  waited past that time, whether they were a no-show, and the appointment's final status. This
  is the front door of the clinical and revenue cycle — every encounter and claim downstream
  starts as a booked appointment here.
tags: ["owox"]
timestamp: 2026-07-23T17:34:12.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `appointment_id` | STRING | PK. Unique appointment identifier. |
| `patient_id` | STRING | Patient who booked the appointment. FK to [Patient](./patient.md) |
| `provider_id` | STRING | Provider seeing the patient. FK to [Provider](./provider.md) |
| `scheduled_at` | TIMESTAMP | Scheduled date and time of the appointment. |
| `department_id` | STRING | Department where the appointment takes place. FK to [Department](./department.md) |
| `status` | STRING | Appointment status (e.g. booked, completed, cancelled). |
| `is_no_show` | BOOLEAN | Whether the patient failed to show up. |
| `wait_minutes` | INTEGER | Door-to-provider wait. |
| `lead_time_days` | INTEGER | Booking-to-visit lead time — no-show driver. |

# Example Questions

- How does no-show rate change with booking lead time, and which lead-time windows should scheduling policy target first?
- Which departments or providers have the longest patient wait times, and is that linked to no-show behavior?
- What share of scheduled appointments convert to completed visits versus cancellations and no-shows?

## Joins

- [Department](./department.md) — `department_id = department_id`
- [Patient](./patient.md) — `patient_id = patient_id`
- [Provider](./provider.md) — `provider_id = provider_id`
