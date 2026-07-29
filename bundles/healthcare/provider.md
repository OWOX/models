---
title: "Provider"
description: |
  One row per clinician, the roster behind every appointment and encounter. Each provider is
  identified by name, clinical specialty, home department, and National Provider Identifier
  (NPI) — the standard identifier used to credential and bill for a clinician's services. This
  is the lens for looking at care delivery by clinician: who is seeing patients, in what
  specialty, and out of which department.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-29T14:32:44.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `provider_id` | STRING | Provider ID | PK. Unique provider identifier. |
| `full_name` | STRING | Full Name | Provider's full name. |
| `specialty` | STRING | Specialty | Clinical specialty of the provider. |
| `department` | STRING | Department | Department the provider belongs to. |
| `npi` | STRING | NPI | National Provider Identifier. |

# Example Questions

- How many providers does each specialty and `department` have, and does that staffing match `patient` demand?
- Which providers or specialties carry the highest `appointment` and `encounter` volume?
- Are certain specialties concentrated in a handful of `departments`, or spread thinly across the system?
