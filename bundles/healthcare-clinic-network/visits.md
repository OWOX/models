---
title: "Visits"
description: |
  Where the network earns: one row per appointment, from the moment it is put in the diary to
  whatever became of it — attended, cancelled in advance, or simply not turned up to. Keeping
  cancellations and no-shows apart is deliberate, because they are different problems with different
  fixes: one gives the clinic a chance to refill the slot and the other does not. Each visit records
  the clinician who delivered it and the service they delivered, the location and its currency, what
  it billed both locally and converted, how the patient paid, and where the wider treatment plan
  stood at the time. It is the only mart that carries revenue, so every question about money starts
  here.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T13:43:27.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `visit_id` | STRING | Visit ID | PK. Unique identifier for this appointment. |
| `patient_id` | STRING | Patient ID | Patient the appointment is for. FK to [Patients](./patients.md) |
| `lead_id` | STRING | Lead ID | Enquiry that produced this appointment. NULL for established patients who booked without a fresh enquiry. FK to [Leads](./leads.md) |
| `provider_id` | STRING | Provider ID | Clinician delivering the appointment. FK to [Provider](./provider.md) |
| `clinic_id` | STRING | Clinic ID | Location the appointment takes place at. FK to [Clinic](./clinic.md) |
| `visit_date` | DATE | Visit Date | Date the appointment is scheduled for. |
| `visit_time` | TIME | Visit Time | Time of day the appointment is scheduled for. |
| `visit_type` | STRING | Visit Type | `new_patient_visit` for a patient's first appointment, `follow_up` for a subsequent one. |
| `status` | STRING | Status | What became of the appointment: `scheduled`, `completed`, `cancelled` (called off in advance) or `no_show` (not attended, no notice). The last two are distinct because only a cancellation lets the slot be refilled. |
| `service_name` | STRING | Service | Service delivered at the appointment. |
| `treatment_plan_status` | STRING | Treatment Plan Status | Where the patient's wider course of treatment stood: `none`, `active`, `partial`, `completed`, `unused`. |
| `revenue_local` | NUMERIC | Revenue (Local) | Revenue billed, in the location's own currency. Only attended visits carry revenue. |
| `currency` | STRING | Local Currency | Currency `revenue_local` is denominated in: `USD` or `CAD`. |
| `revenue_normalized` | NUMERIC | Revenue (USD) | Revenue converted to USD. Use this for any figure spanning both markets. |
| `fx_rate_to_usd` | NUMERIC | FX Rate to USD | Rate used to convert `revenue_local` into `revenue_normalized`. |
| `payment_method` | STRING | Payment Method | How the visit was settled: `insurance`, `card`, `cash`, `online`, `payment_plan`. |
| `created_at` | TIMESTAMP | Created At | When the appointment was booked. Compare against `visit_date` for booking lead time. |
| `is_first_visit` | BOOLEAN | Is First Visit | True when this is the patient's first ever attendance at the network. |
| `count_visits` | INTEGER | Visit Count | Always `1` on every row; SUM to count appointments. |

# Example Questions

- What is our no-show rate by location, specialty and clinician, and what revenue does the missed capacity represent over the period?
- Which service lines earn most per attended visit, and how does that ranking change once cancellations and no-shows are counted against them?
- Do `patients` paying through insurance attend more reliably than those paying out of pocket, and does that hold across both markets?

## Joins

- [Clinic](./clinic.md) — `clinic_id = clinic_id`
- [Leads](./leads.md) — `lead_id = lead_id`
- [Patients](./patients.md) — `patient_id = patient_id`
- [Provider](./provider.md) — `provider_id = provider_id`
