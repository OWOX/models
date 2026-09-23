---
title: "Treatment"
description: |
  The step between a clinician saying yes and the practice being paid. Once a
  consultation qualifies someone a date is agreed and the treatment is booked, the
  patient's copay is collected before it starts, and the claim goes to the insurer after
  it. Every bill and every payment in this model is raised against one of these rows:
  before this record the model describes demand, after it money.

  **Being qualified and being treated are two different things.** Someone can be cleared
  and still decide not to go ahead, a drop-off that stays invisible unless bookings are
  counted separately from verdicts. `booked_at` and `scheduled_date` are deliberately
  separate too: one is when the appointment was agreed, the other the day it was set for,
  and the distance between them is the practice's waiting time.

  A treatment points back at the
  [consultation](./consultation.md) that cleared it, forward at the
  [patient](./customer-patient.md) receiving it and at the [clinician](./employee.md)
  delivering it — the same staff list the screenings point at — so a clinician's verdict
  and the money that followed sit on one chain, and advertising can be read against
  treatments delivered, not only enquiries taken.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `treatment_id` | STRING | Treatment ID | PK. Unique identifier for one booked treatment, which is what every invoice and every payment in this model is ultimately raised against. |
| `consultation_id` | STRING | Consultation ID | The assessment that cleared this treatment to go ahead. It is the step that carries a clinician's verdict forward into the money, and the enquiry and its advertising can be reached through it. FK to [Consultation](./consultation.md) |
| `customer_id` | STRING | Customer ID | The patient being treated, as the billing side of the practice knows them. FK to [Customer (Patient)](./customer-patient.md) |
| `employee_id` | STRING | Employee ID | The clinician delivering the treatment, drawn from the same staff list that holds the screening. It allows one person's assessments and their delivered work to be compared. FK to [Employee](./employee.md) |
| `booked_at` | TIMESTAMP | Booked At | When the appointment was agreed, not when it happens. Measured against the consultation, it is how long the practice took to convert a yes into a booking. |
| `scheduled_date` | DATE | Scheduled Date | The day the treatment is set for. The distance from `booked_at` is the waiting time a patient is asked to accept. |
| `completed_date` | DATE | Completed Date | The day the treatment actually happened. Empty while it is still in the diary or was cancelled, which is what separates delivered work from booked work. |
| `treatment_name` | STRING | Treatment Name | What is being done. It is what makes a channel's demand readable as a case mix rather than as a single count. |
| `status` | STRING | Treatment Status | Where the booking stands: `booked` while it is ahead, `completed` once delivered, `cancelled` when it will not happen. Cancellations are qualified patients who did not get treated, so they belong in a funnel count rather than being dropped. |

# Example Questions

- How many qualified `consultations` turn into booked treatments, and how does that differ by the channel the enquiry came from?
- How long do patients wait between being cleared and being treated, and how many bookings are cancelled before they happen?
- Which treatments do our paid enquiries end up having, and how does that mix differ from the enquiries that arrive without advertising?

## Joins

- [Consultation](./consultation.md) — `consultation_id = consultation_id` [N:1] — The assessment that cleared this treatment to go ahead.
  - [Consultation Employee](./employee.md) — Who held the assessment that cleared this treatment, rather than the clinician delivering it.
  - [Consultation Lead](./lead.md) — The CRM enquiry the clearing assessment was held against.
    - [Consultation Lead Person](./person.md) — The human behind that enquiry, which is this treatment's route back to the first visit.
- [Customer (Patient)](./customer-patient.md) — `customer_id = customer_id` [N:1] — Who is being treated.
  - [Customer (Patient) Person](./person.md) — The human behind the patient being treated, back to their first anonymous visit.
- [Employee](./employee.md) — `employee_id = employee_id` [N:1] — The clinician delivering it.
