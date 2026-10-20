---
title: "Department"
description: |
  Reference list of the clinical departments that make up the health system, each with the
  clinical specialty it serves and its staffed-bed capacity. Departments are the organizational
  unit behind appointments, provider assignments and daily bed census. Staffed beds here is
  each unit's standing capacity; the day-by-day count, net of beds taken out of service, and
  the occupancy it supports are in [Bed Census (daily)](./bed-census-daily.md).
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T08:48:41.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `department_id` | STRING | Department ID | PK. Unique department identifier. |
| `name` | STRING | Name | Department name. |
| `specialty` | STRING | Specialty | Clinical specialty the department serves. |
| `staffed_beds` | INTEGER | Staffed Beds | Standing staffed-bed capacity of the unit; the day's actual count is in [Bed Census (daily)](./bed-census-daily.md). |

# Example Questions

- Which departments carry the most staffed-bed capacity, and how does that compare to their `appointment` and `patient volume`?
- How is clinical specialty distributed across departments?
- Which departments are capacity-constrained relative to peers with a similar specialty?
