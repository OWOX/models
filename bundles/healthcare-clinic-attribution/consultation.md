---
title: "Consultation"
description: |
  Where an enquiry is judged. A practice screens in two steps: first a phone conversation
  with a receptionist or a practice manager, then — only for those who get that far — an
  appointment with a clinician. Both are held here, told apart by `type` and by who
  conducted them, because they differ in who does the screening and not in what is recorded.

  This is the mart that turns advertising from a volume report into a quality report. Every
  screened enquiry ends up here as a verdict and, when the answer is no, as a reason. That
  is what lets a practice say which campaigns bring people it can actually treat, rather
  than which campaigns bring the most enquiries.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Consultation

One row per screening step, keyed by `consultation_id`. An [enquiry](./lead.md) can be
screened more than once, so a single enquiry may have several rows here, and they should be
read in order rather than collapsed to one.

**The two steps.** A `Pre-Consultation` is a telephone conversation held by someone who is
not a clinician — a receptionist or a practice manager. They ask a few
questions about what the person is struggling with and decide whether the practice is a
plausible fit and whether the person should be brought in at all. A `Consultation` is the
appointment that follows: a clinician sees the person, examines them or runs tests, and
decides whether treatment can go ahead.

The first step exists because the second one is expensive. Without a phone screen, every
enquiry would go straight to a clinician, and no practice has the clinical hours to see
everyone who gets in touch. The screen is what makes the clinic's diary affordable, and it
is where the enquiries that are not a good fit for the practice are filtered out —
invisibly, unless the step is recorded in its own right. Both steps point at the same
[staff list](./employee.md), so the same question — who held it, and how did it end — can
be asked of either.

**Qualification is decided here, and only here.** `is_qualified` is the verdict of this
particular screen: true when the person moves forward, false when they do not. The enquiry
record carries a field of the same name, but it is empty, because at the moment
someone fills in a form or rings the practice nobody has yet formed a view. Anyone asking
whether an enquiry was accepted should ask it of this mart.

**`disqualification_reason` is what makes a refusal useful.** Without it, a channel that
brings poor enquiries shows up only as a lower acceptance rate — a number that says
something is wrong and nothing about what. With it, each refusal carries the practice's
own account of why the person was not taken forward, so a channel can be read by the
reasons it produces and not only by the share it loses. That is the difference between a
count and a diagnosis, and the reasons are the clinic's own to record.

A qualifying consultation is what a booked [treatment](./treatment.md) is arranged from,
which is how a
clinician's verdict eventually connects to money received.

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `consultation_id` | STRING | Consultation ID | PK. Unique identifier for this one screening, not for the enquiry — an enquiry can be screened more than once. |
| `lead_id` | INTEGER | Lead ID | The enquiry being screened. Several rows here share one value, which is what makes this a sequence of steps rather than a single verdict. FK to [Lead](./lead.md) |
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

- [Lead](./lead.md) — `lead_id = lead_id` [N:1] — The enquiry being screened; one lead can have several screenings.
  - [Lead Person](./person.md) — The human behind the enquiry being screened, back to the browsing and advertising that preceded it.
- [Employee](./employee.md) — `employee_id = employee_id` [N:1] — Who held it, which is what separates a phone screen from a clinician's assessment.
