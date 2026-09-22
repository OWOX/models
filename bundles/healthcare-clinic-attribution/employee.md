---
title: "Employee"
description: |
  Everyone at the practice who takes part in turning an enquiry into a booked treatment —
  clinicians, receptionists and practice managers alike — kept as one list and told apart by
  `type`. Both screening steps are staffed from here: the phone call that decides whether an
  enquiry is worth an appointment, and the appointment itself, where a clinician decides
  whether treatment can go ahead. Holding them in one place is what lets a practice see where
  in that chain its enquiries are actually lost, and to whom.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Employee

One row per member of staff involved in the path from enquiry to treatment, keyed by
`employee_id`. Doctors, receptionists and practice managers are held in one list rather
than three, for a plain reason: they carry exactly the same properties — a name, a
position, a place in the practice — and differ only in what they do. `type` is that
difference, and it takes the values `Doctor`, `Receptionist` and `Manager`. Splitting them
into separate objects would duplicate the same five fields three times and make every
question about staff a question that has to be asked three times.

Keeping them together is also what makes the screening step legible. An
[enquiry](./lead.md) is first taken over the phone by someone who is not a clinician — a
receptionist or a manager — who asks a few questions and decides whether the person is a
plausible candidate for the practice. Only then does a clinician see them in the room and
decide whether treatment can go ahead. Those are two [consultations](./consultation.md) of
different types, held by people of different types, and because both point at this one mart the same question —
who held it, and how did it end — answers for either step. Without that, every enquiry
would appear to go straight to the doctor, and the practice would lose sight of the screen
that turns away the enquiries it is not a fit for.

`specialty` is meaningful only for clinicians and is left empty for reception and
management staff; `position` is the practice's own job title, finer than `type`.

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
