---
title: "Provider"
description: |
  The clinicians patients actually see: one row per provider, with the specialty they practise and
  the location they practise at. "Provider" is the collective the industry uses for the physicians,
  nurse practitioners and physician assistants who deliver care, and `specialty` is what makes this
  mart load-bearing — it is the only place the model says whether a visit was primary care,
  dermatology, orthopedics or behavioral health, and those service lines behave nothing alike on
  revenue per visit or on how often patients fail to turn up. `is_active` distinguishes clinicians
  currently practising from those who have left, so a provider who worked two months of the year is
  not compared against one who worked twelve.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T11:02:24.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `provider_id` | STRING | Provider ID | PK. Unique identifier for this clinician. |
| `clinic_id` | STRING | Clinic ID | Location this clinician practises at. FK to [Clinic](./clinic.md) |
| `first_name` | STRING | First Name | Clinician's given name. |
| `last_name` | STRING | Last Name | Clinician's family name. |
| `specialty` | STRING | Specialty | Service line this clinician practises: `primary_care`, `dermatology`, `orthopedics`, `cardiology`, `pediatrics`, `physiotherapy`, `behavioral_health`. The only path from a visit to its service line. |
| `email` | STRING | Email Address | Work email address for the clinician. |
| `is_active` | BOOLEAN | Is Active | True while the clinician is still practising at the network. Filter on it before comparing providers, so a mid-period joiner is not read as underproductive. |

# Example Questions

- Which specialties carry the network's revenue, and which ones fill their schedules but bill little per `visit`?
- Do no-show rates differ more between specialties or between locations — that is, is missed capacity a service-line problem or a site problem?
- Are any locations relying on a single clinician within a specialty, so that one departure would remove that service line from that site entirely?

## Joins

- [Clinic](./clinic.md) — `clinic_id = clinic_id`
