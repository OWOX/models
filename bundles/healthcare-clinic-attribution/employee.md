---
title: "Employee"
description: |
  Everyone at the practice who takes part in turning an enquiry into a booked treatment —
  clinicians, receptionists and practice managers alike — kept as one list and told apart
  by `type`: `Doctor`, `Receptionist`, `Manager`. They are one mart rather than three
  because they carry the same properties and differ only in what they do; splitting them
  would duplicate the same five fields three times and make every question about staff a
  question asked three times.

  Both screening steps are staffed from here: the phone call that decides whether an
  enquiry is worth an appointment, and the appointment itself, where a clinician decides
  whether treatment can go ahead. Because both [consultations](./consultation.md) point
  at this one mart, the same question — who held it, and how did it end — answers for
  either step, which is what lets a practice see where its enquiries are actually lost,
  and to whom. Without it every enquiry would appear to go straight to the doctor, and
  the screen that turns away a poor fit would be invisible.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `employee_id` | STRING | Employee ID | PK. Unique identifier for this member of staff. |
| `type` | STRING | Employee Type | What the person does in the funnel: `Doctor` sees patients in the room and decides whether treatment goes ahead, while `Receptionist` and `Manager` take the first screening call. |
| `first_name` | STRING | First Name | Given name, as the practice records it. |
| `last_name` | STRING | Last Name | Family name, as the practice records it. |
| `position` | STRING | Position | Job title at the practice — finer than `type`, and the wording a rota or a staff list would use. |
| `specialty` | STRING | Specialty | Clinical field the person practises in. Empty for reception and management staff, for whom it has no meaning. |

# Example Questions

- Which clinicians qualify the highest share of the enquiries they see, and does the difference follow the specialty rather than the individual?
- How much of the funnel's loss happens on the phone screen versus in the room, and who is holding each of those steps?
- Do the enquiries screened by one member of reception reach the clinician in better shape than those screened by another?
