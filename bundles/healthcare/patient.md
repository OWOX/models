---
type: "OWOX Data Mart"
title: "Patient"
description: |
  One row per patient, the demographic and coverage anchor for every appointment, encounter
  and claim in the system. Each patient carries a birth year and gender for age-banded analysis,
  a postal code for geographic reach, an insurance type (commercial, Medicare, Medicaid or
  self-pay) that determines how their care gets billed, a risk-stratification tier used by care
  management to flag patients who need closer follow-up, and the date they first registered
  with the system.
tags: ["owox"]
timestamp: 2026-07-23T17:34:11.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `patient_id` | STRING | PK. Unique de-identified patient identifier. |
| `birth_year` | INTEGER | Year of birth, used for age banding. |
| `gender` | STRING | Patient gender. |
| `postal_code` | STRING | Patient postal/ZIP code for geographic analysis. |
| `insurance_type` | STRING | commercial / Medicare / Medicaid / self-pay. |
| `risk_tier` | STRING | Risk-stratification band for care management. |
| `registered_at` | DATE | Date the patient was first registered. |

# Example Questions

- How is the patient population split across insurance types, and how has that mix shifted as new patients register?
- What share of patients fall into higher-risk tiers, and how does that skew by age band?
- Which postal codes or regions are driving the most new patient registrations?
