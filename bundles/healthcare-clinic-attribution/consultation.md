---
title: "Consultation"
description: |
  Where an enquiry is judged. A practice screens in two steps, both held here, told
  apart by `type` and by who conducted them: they differ in who screens, not in what
  is recorded. A `Pre-Consultation` is a telephone conversation held by a receptionist or
  a practice manager — not a clinician — who decides whether the practice is a plausible
  fit. A `Consultation` is the appointment that follows: a clinician examines the person
  and decides whether treatment can go ahead. The first step exists because the second is
  expensive: without it every enquiry would go straight to a clinician, and no practice
  has the hours for that.

  **Qualification is decided here, and only here.** The [enquiry](./lead.md) record
  carries a field of the same name, but it is empty: at the moment of a form or a call
  nobody has yet formed a view. One enquiry can be screened more than once, so it may
  have several rows here, to be read in order. `disqualification_reason` carries the
  practice's own account of a refusal, which turns a low acceptance rate from a count
  into a diagnosis and shows which campaigns bring people the practice can actually
  treat.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-23T14:19:58.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `consultation_id` | STRING | Consultation ID | PK. Unique identifier for this one screening, not for the enquiry — an enquiry can be screened more than once. |
| `lead_id` | STRING | Lead ID | The enquiry being screened. Several rows here share one value, which is what makes this a sequence of steps rather than a single verdict. FK to [Lead](./lead.md) |
| `employee_id` | STRING | Employee ID | Who conducted it. This is what distinguishes a receptionist's phone screen from a clinician's assessment in practice, and it lets acceptance rates be compared between staff. FK to [Employee](./employee.md) |
| `consultation_date` | DATE | Consultation Date | The day it took place. Measured against the enquiry's creation time, it is how long the practice took to respond; measured against the previous screen, how long the person waited between steps. |
| `type` | STRING | Consultation Type | Which of the two screens this is: `Pre-Consultation` for the phone conversation with reception or a manager, `Consultation` for the appointment with a clinician. |
| `is_qualified` | BOOLEAN | Is Qualified | The verdict of this screen: TRUE when the person moves forward, FALSE when they do not. This is where qualification is actually decided; the same field on the enquiry record is empty. |
| `disqualification_reason` | STRING | Disqualification Reason | Why the person was not taken forward. Empty when they were. This is what turns a low acceptance rate from a count into a diagnosis, because the fix is different for each reason. |

# Example Questions

- Which campaigns bring enquiries that a clinician accepts, and which bring enquiries that fail the phone screen?
- Where do we lose more people — on the phone or in the room — and has that shifted since we changed our advertising?
- What are we turning enquiries away for, and does one reason concentrate in one channel enough to be fixed in the ad rather than at reception?

## Joins

- [Employee](./employee.md) — `employee_id = employee_id` [N:1] — Who held it, which is what separates a phone screen from a clinician's assessment.
- [Lead](./lead.md) — `lead_id = lead_id` [N:1] — The enquiry being screened; one lead can have several screenings.
  - [Lead Person](./person.md) — The human behind the enquiry being screened, back to the browsing and advertising that preceded it.
