---
title: "Clinic"
description: |
  The network's footprint: one row per clinic location, with where it is, what currency it bills
  in and which practice-management system its records come from. Locations span the United States
  and Canada, so a clinic carries both its own billing currency and the state or province it sits
  in — the cut every regional comparison starts from. `is_active` separates locations that are
  open and taking patients from ones that have closed or not yet opened, which matters whenever a
  per-location average would otherwise be dragged down by a site that was dark for part of the
  period. This is the dimension that turns any patient, visit or enquiry number into a
  location-level one.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T11:02:27.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `clinic_id` | STRING | Clinic ID | PK. Unique identifier for this clinic location. |
| `clinic_name` | STRING | Clinic Name | Public-facing name of the location, as patients see it. |
| `country` | STRING | Country | Two-letter country code the location operates in: `US` or `CA`. |
| `state_province` | STRING | State / Province | State (US) or province (Canada) the location sits in, e.g. `TX`, `CO`, `ON`. The standard regional cut for comparing locations. |
| `city` | STRING | City | City the location operates in. |
| `address` | STRING | Street Address | Street address of the location. |
| `phone` | STRING | Phone Number | Primary contact number patients call to reach this location. |
| `currency` | STRING | Local Currency | Currency this location bills patients in: `USD` or `CAD`. Revenue is also carried normalised to USD wherever it appears. |
| `ehr_system` | STRING | EHR System | Practice-management / electronic health record system the location's records originate from. Check this first when one clinic's data looks structurally unlike another's. |
| `is_active` | BOOLEAN | Is Active | True while the location is open and accepting patients. Exclude inactive locations before comparing per-location averages. |

# Example Questions

- Which locations bill in Canadian dollars, and how much of the network's revenue sits outside the US once everything is converted to a single currency?
- Do clinics running one practice-management system show different data completeness than those on the other, and is that a reporting artefact rather than a real difference?
- How does performance per location vary across states and provinces once closed sites are excluded from the comparison?
