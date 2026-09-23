---
title: "Customer (Patient)"
description: |
  The patient once money is involved. A person exists from the first anonymous visit; a
  customer exists once there is an invoice or revenue against them — not when someone
  enquires, and not when a clinician agrees to treat them — and that is the line between
  an audience and a patient list. In healthcare the two are the same human, so this is
  one record rather than two: `customer_id` is this model's key and `patient_id` the
  clinical system's, so a commercial report and a clinical record reconcile without
  renaming anything. That is not universal — elsewhere an employer or a school pays for
  the people being served, and payer and patient are separate records.

  One customer covers several treatments and several payments, so counting rows here
  counts patients while counting [treatments](./treatment.md), [invoices](./invoice.md)
  or [payments](./revenue.md) counts events, and with returning patients the two are not
  the same. `person_id` resolves a paying patient back to the anonymous first visit, so
  the advertising that started a journey can be credited with the money that ended it,
  however long the gap.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `customer_id` | STRING | Customer ID | PK. Unique identifier for the patient as a paying party, issued when the first invoice or payment appears rather than at the enquiry. |
| `person_id` | STRING | Person ID | The same human at their anonymous stage, which is what ties money received back to the visit and the advertising that started the journey. FK to [Person](./person.md) |
| `patient_id` | STRING | Patient ID | The identifier the clinical system issues for the same human. Held alongside the commercial key so a clinical record and a billing record can be reconciled without renaming either. |
| `first_name` | STRING | Patient First Name | Given name as the practice bills it. The enquiry record holds its own copy of the contact details, on [Lead](./lead.md). |
| `last_name` | STRING | Patient Last Name | Family name as the practice bills it. |
| `became_customer_at` | TIMESTAMP | Became a Customer At | When this human stopped being an enquiry and became a paying patient: the moment of the first invoice or payment. Compared with the person's first visit, it is the full length of the journey from first touch to first money. |

# Example Questions

- How long does it take from a `person`'s first visit to their first `invoice`, and does that gap differ by the channel they first arrived through?
- Which first-touch campaigns produced paying patients this year, rather than enquiries that stopped at a `consultation`?
- How many of our patients have come back for more than one `treatment`, and what were they worth compared with the ones who came once?

## Joins

- [Person](./person.md) — `person_id = person_id` [N:1] — The same human, tracked from their first anonymous visit onward.
