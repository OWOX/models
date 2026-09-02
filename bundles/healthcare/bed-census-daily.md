---
title: "Bed Census (daily)"
description: |
  One row per department per day, tracking inpatient bed capacity and patient flow over time.
  Each row records how many beds were staffed and how many were occupied that day, alongside
  the day's admissions and discharges — the numbers that drive occupancy rate and reveal
  whether a department is filling up or emptying out. This is the operational pulse of
  capacity management across the health system.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-23T17:34:11.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `census_id` | STRING | Census ID | PK. Unique identifier for the daily census record. |
| `department_id` | STRING | Department ID | Department the census covers. FK to [Department](./department.md) |
| `census_date` | DATE | Census Date | Calendar day of the census. |
| `staffed_beds` | INTEGER | Staffed Beds | Beds staffed and available that day. |
| `occupied_beds` | INTEGER | Occupied Beds | Beds occupied at census time — utilization numerator. |
| `admissions` | INTEGER | Admissions | Admissions during the day. |
| `discharges` | INTEGER | Discharges | Discharges during the day. |

# Example Questions

- Which `departments` run at the highest occupancy, and how close are they to their staffed-bed capacity?
- How does daily occupancy trend over time as admissions and discharges fluctuate?
- Are there `departments` where staffed beds are consistently underused relative to demand?

## Joins

- [Department](./department.md) — `department_id = department_id` — The department these staffed beds belong to.
