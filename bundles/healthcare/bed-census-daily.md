---
title: "Bed Census (daily)"
description: |
  One row per department per day, tracking inpatient bed capacity and patient flow over time.
  Each row records how many beds were staffed and how many were occupied that day, alongside
  the day's admissions and discharges. This is the operational pulse of capacity management
  across the health system.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T08:49:42.000Z
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

## Calculated fields

### `occupancy_rate` · FLOAT · Metric

- **Alias:** Bed Occupancy Rate

Share of staffed beds occupied: occupied beds summed over staffed beds summed, so a larger unit weighs more. Hospital-wide it includes the Emergency Department's 30 beds; filter the ED out for inpatient units only.

```sql
SAFE_DIVIDE(SUM(occupied_beds), SUM(staffed_beds))
```

### `average_daily_census` · FLOAT · Metric

- **Alias:** Average Daily Census

Patients in a bed on an average day: occupied beds summed, divided by distinct census days. Per department, its own daily census; across departments, the hospital's total census per day.

```sql
SAFE_DIVIDE(SUM(occupied_beds), COUNT(DISTINCT census_date))
```

# Example Questions

- Which `departments` run at the highest occupancy, and how close are they to their staffed-bed capacity?
- How does daily occupancy move through the week and across the year?
- Are there `departments` where staffed beds are consistently underused relative to demand?

## Joins

- [Department](./department.md) — `department_id = department_id` [N:1] — The department these staffed beds belong to.
