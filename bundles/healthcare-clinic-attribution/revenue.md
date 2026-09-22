---
title: "Revenue"
description: |
  Money the practice has actually received. An invoice is a claim on money; this is the
  claim being settled, and the two are kept apart because a bill and a payment are not the
  same event and do not happen at the same time.

  A treatment is paid for in two pieces. The patient's copay is collected before the
  treatment starts and is revenue straight away, though a small share of the total. The
  remainder comes from the insurer, after the claim has been submitted and with a lag, and
  `days_to_payment` is where the length of that wait is recorded. Read with `payment_source`,
  it tells a practice how long its money takes to arrive and who it is waiting on.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Revenue

One row per payment received, keyed by `revenue_id`. Each names the
[invoice](./invoice.md) it settles and the [patient](./customer-patient.md) it came in for.

**This is money, and the invoice is not.** Issuing a bill creates a claim; only a payment
creates revenue. A single invoice can be settled in more than one payment, or in none, so
this mart is joined to the invoice rather than folded into it. Subtracting what is here from
what was billed is how a practice sees what it is still owed, and by whom.

**Two sources, arriving at two different moments.** `payment_source` tells them apart.
`patient_copay` is the part the patient pays; it is collected before the treatment starts
and is revenue straight away, and it is a small share of the total. `insurance_reimbursement`
is the rest: the practice submits a claim to the insurer after the treatment, and the money
arrives later, once the claim has been processed. That lag is why a practice can be busy and
short of cash at the same time, and why a total taken over the month a treatment happened
is not the same as one taken over the month the money landed.

`days_to_payment` is that wait as a number: the distance between the bill and the money.
Averaged by `payment_source` it separates a copay collected before treatment from an
insurer's reimbursement; tracked over time, it is how a practice sees whether its
insurers have started paying more slowly.

**Revenue resolves to advertising through the patient.** Every row carries `customer_id`,
so payments roll up to one patient, and the patient carries `person_id`, which reaches back
to the first visit and the source, medium and campaign frozen on it. That path is what turns
"which campaigns bring enquiries" into "which campaigns brought money", including money
received long after the click. One patient can have several payments spread over years, so
totals per campaign are sums over a patient's whole history rather than over a single
purchase.

`amount` and `currency` describe this payment alone, not the invoice it belongs to; the
invoice keeps its own figure, and the difference between the two is what is outstanding.

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `revenue_id` | STRING | Revenue ID | PK. Unique identifier for one payment received. It is an event, not a balance: one bill can be settled by several rows here. |
| `customer_id` | STRING | Customer ID | The patient the money came in for. Through them the payment reaches the person record, which is how revenue is credited back to the visit and the advertising that started it. FK to [Customer (Patient)](./customer-patient.md) |
| `invoice_id` | STRING | Invoice ID | The bill this payment settles, in whole or in part. Comparing the two is how a practice sees what is still outstanding. FK to [Invoice](./invoice.md) |
| `received_at` | TIMESTAMP | Received At | When the money arrived. This is the date revenue belongs to, and for an insurer's part it can fall in a later period than the treatment it pays for. |
| `amount` | NUMERIC | Amount Received | How much actually arrived in this payment. It can be less than the bill asked for, and a bill can be settled by several payments. |
| `currency` | STRING | Payment Currency | Currency the money arrived in, such as `USD`. Needed before payments can be summed together. |
| `payment_source` | STRING | Payment Source | Where the money came from: `patient_copay`, collected before the treatment starts and a small share of the total, or `insurance_reimbursement`, paid after the claim is processed. One arrives before the treatment and the other after the claim is processed, so cash-flow questions need this split. |
| `days_to_payment` | INTEGER | Days to Payment | How long this money took to arrive, counted from the bill. It is the reimbursement lag made measurable: read by `payment_source` it separates the copay collected before treatment from the insurer's part, and tracked over time it shows whether insurers are paying more slowly. |

# Example Questions

- How long does our money take to arrive, split between what the patient pays before `treatment` and what the insurer reimburses?
- How much revenue did each first-touch channel produce, once it is resolved through the patient back to the visit that started the journey?
- How much of what we invoiced in a period has actually been received, and where is the rest sitting?

## Joins

- [Customer (Patient)](./customer-patient.md) — `customer_id = customer_id` [N:1] — Who the money came in for.
  - [Customer (Patient) Person](./person.md) — The human behind the patient this money came in for, which is how a payment reaches the campaign that started the journey.
- [Invoice](./invoice.md) — `invoice_id = invoice_id` [N:1] — The bill this payment settles, in whole or in part.
  - [Invoice Customer (Patient)](./customer-patient.md) — The patient the settled bill was raised against.
    - [Invoice Customer (Patient) Person](./person.md) — The human behind the patient the settled bill was raised against.
  - [Invoice Treatment](./treatment.md) — What the settled bill was for.
    - [Invoice Treatment Consultation](./consultation.md) — The assessment that cleared the treatment behind this payment.
      - [Invoice Treatment Consultation Employee](./employee.md) — Who held the assessment that cleared that treatment, who need not be the one who delivered it.
      - [Invoice Treatment Consultation Lead](./lead.md) — The enquiry that was screened into the treatment behind this payment.
        - [Invoice Treatment Consultation Lead Person](./person.md) — The human behind that enquiry, reached through the treatment rather than through the paying patient.
    - [Invoice Treatment Customer (Patient)](./customer-patient.md) — The patient the treatment was booked for, reached through the treatment rather than off the bill.
      - [Invoice Treatment Customer (Patient) Person](./person.md) — The human behind the patient the treatment was booked for.
    - [Invoice Treatment Employee](./employee.md) — Who delivered the treatment behind this payment.
