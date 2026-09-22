---
title: "Customer (Patient)"
description: |
  The patient once money is involved. A person exists from the first anonymous visit; a
  customer exists once there is an invoice or revenue against them, and that is the line
  between an audience and a patient list. In healthcare the two are the same human — the one
  being treated is the one being billed — so this mart carries both the commercial key and
  the identifier the clinical system issues, and it is the record every treatment, invoice
  and payment hangs from.

  It also carries the link the rest of the model is built for. `person_id` resolves a paying
  patient back to the anonymous first visit, so the advertising that started a journey can be
  credited with the money that ended it, however long the gap was.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Customer (Patient)

One row per patient the practice has billed or taken money from, keyed by `customer_id`.
The record comes into being at the first invoice or the first payment — not when someone
enquires, and not when a clinician agrees to treat them.

**Person and customer are two stages of the same human, and the difference is money.** A
person exists from the first click or form submission: [visits](./session.md),
[page views](./page-view.md), [enquiries](./lead.md) and
[consultations](./consultation.md) all belong to that record long before anything is
billed. A customer exists
once an invoice or revenue is created. `person_id` is what joins the two stages, and it is
the single link that lets the practice ask which advertising produced a paying patient
rather than merely an enquiry — without it the chain from an ad click to money received is
cut at its last step. Because the person identity is minted at the first page view and
never reissued, a patient treated today can still be traced to a visit years earlier.

**In healthcare the customer and the patient are the same human**, and this mart is
deliberately one record rather than two. That is not true everywhere: in other settings the
bill can be paid by a school or an employer on behalf of the people actually being served,
and then the payer and the treated person are separate records. Here they are one, so the
two identifiers on this mart are simply two systems' names for the same human —
`customer_id` is this model's key, `patient_id` is the identifier the clinical system
issues. Keeping both is what lets a commercial report and a clinical record be reconciled
without renaming anything in either system.

**One customer, several treatments, several payments.** Someone can come in for a small
filling in January, a crown later, and another filling in December; all of that sits
under one customer record and one person. Counting rows here counts patients. Counting
[treatments](./treatment.md), [invoices](./invoice.md) or [payments](./revenue.md) counts
events, and in a practice with returning patients the two numbers are not the same.

`became_customer_at` is the boundary itself, recorded as a timestamp: the moment the first
invoice or revenue appeared. Read against the person's first visit it gives the full length
of the journey from first touch to first money; read against the enquiry and the
consultations it shows how much of that time the practice itself controlled.

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
