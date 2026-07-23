---
type: "OWOX Data Mart"
title: "Department"
description: |
  Reference list of the clinical departments that make up the health system, each with the
  clinical specialty it serves and its staffed-bed capacity. Departments are the organizational
  unit behind appointments, provider assignments and daily bed census — staffed beds is the
  denominator for every occupancy and capacity calculation in the model.
tags: ["owox"]
timestamp: 2026-07-23T17:34:11.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `department_id` | STRING | PK. Unique department identifier. |
| `name` | STRING | Department name. |
| `specialty` | STRING | Clinical specialty the department serves. |
| `staffed_beds` | INTEGER | Number of staffed beds — the utilization denominator. |

# Example Questions

- Which departments carry the most staffed-bed capacity, and how does that compare to their appointment and patient volume?
- How is clinical specialty distributed across departments?
- Which departments are capacity-constrained relative to peers with a similar specialty?
