---
title: "Invoice"
description: |
  A bill the practice has issued, raised against one treatment and one patient. An
  invoice is a claim on money, not money: it records what is owed and to whom, and
  nothing here says any of it has arrived. Money actually received is recorded on
  [Revenue](./revenue.md), joined by `invoice_id`: a report on invoices answers "what
  have we billed", one on revenue "what have we been paid". Read as income they
  overstate, carrying the full value of work billed, including the part an insurer has
  not settled and the part that may never be paid at all.

  A treatment is billed in two parts. In the United States, where this pattern was
  described, the patient's copay can be billed as soon as the treatment is booked, is
  collected before it starts, and is money straight away, though a small share of the
  total. The rest is claimed from the insurer after the treatment and becomes money only
  when the insurer pays, with a lag. `payer_type` tells the two apart. A `written_off`
  invoice is delivered work that earned nothing, so it belongs in any honest reading of
  what a channel produced.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `invoice_id` | STRING | Invoice ID | PK. Unique identifier for one bill. The patient's part and the insurer's part are billed separately, so one treatment can produce more than one row here. |
| `customer_id` | STRING | Customer ID | The patient being billed. In healthcare this is the same human being treated, so no separate payer record is needed. FK to [Customer (Patient)](./customer-patient.md) |
| `treatment_id` | STRING | Treatment ID | The treatment this bill is for, which is how a charge connects back to the clinician's decision and, through it, to the advertising that produced the enquiry. FK to [Treatment](./treatment.md) |
| `issued_at` | TIMESTAMP | Issued At | When the bill was sent. For a copay this can be as early as the booking; for an insurance claim it follows the treatment. It is the start of the clock that `Days to Payment` measures. |
| `amount` | NUMERIC | Invoiced Amount | What this bill asks for. It is not income — the amount actually received against it is recorded on [Revenue](./revenue.md), and it can be smaller, arrive in pieces, or never arrive. |
| `currency` | STRING | Invoice Currency | Currency the bill was raised in, such as `USD`. Needed before amounts from different bills can be added together. |
| `payer_type` | STRING | Payer Type | Who is being asked to pay: `patient_copay` for the part the patient settles before treatment, `insurance_claim` for the part claimed from the insurer afterwards. One is settled before the treatment, the other after the claim is processed. |
| `status` | STRING | Invoice Status | Where the claim stands: `issued`, `partially_paid`, `paid`, or `written_off` when the practice has given up on it. Written-off bills are delivered work that earned nothing and should not be dropped from a channel's result. |

# Example Questions

- How much of what we have billed this quarter is still outstanding, and how much of that is sitting with insurers rather than with patients?
- What is the split between patient copays and insurance claims on the `treatments` we deliver, in value rather than in count?
- Which `treatments` end up written off, and do they concentrate in one part of our demand?

## Joins

- [Customer (Patient)](./customer-patient.md) — `customer_id = customer_id` [N:1] — Who is being billed.
  - [Customer (Patient) Person](./person.md) — The human behind the patient being billed, back to their first anonymous visit.
- [Treatment](./treatment.md) — `treatment_id = treatment_id` [N:1] — What is being billed for.
  - [Treatment Consultation](./consultation.md) — The assessment that cleared the treatment being billed for.
    - [Treatment Consultation Employee](./employee.md) — Who held the assessment that cleared this treatment, who need not be the one who delivered it.
    - [Treatment Consultation Lead](./lead.md) — The enquiry that was screened into the treatment being billed for.
      - [Treatment Consultation Lead Person](./person.md) — The human behind that enquiry, which is this bill's route back to the first visit.
  - [Treatment Customer (Patient)](./customer-patient.md) — The patient the treatment was booked for, reached through the treatment rather than off this bill.
    - [Treatment Customer (Patient) Person](./person.md) — The human behind the patient the treatment was booked for.
  - [Treatment Employee](./employee.md) — Who delivered the treatment being billed for.
