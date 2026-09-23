---
title: "Healthcare Clinic Attribution"
description: |
  A single healthcare practice — one clinic, one patient list — that advertises for patients,
  screens the enquiries that come back, treats the people a clinician accepts, and is paid in two
  parts: the patient's copay before treatment, and the insurer's share once the claim has
  been processed. The model follows that one chain end to end, from an anonymous ad click to money
  received.

  What makes it more than a funnel report is the person identity at its centre. It is minted on
  someone's very first page view — before a name, an email or a phone number — and it is never
  reissued, so a patient paying today still resolves to the advertising that first brought them,
  whether that was weeks or years earlier.

  That stitching — one identity held across devices, browsers and years — is the pattern used by
  APAS® Cloud, whose co-founder described it for this model.

  Two distinctions inside it are expensive to lose. An enquiry is not a qualified enquiry:
  qualification is a clinician's decision, taken at a consultation, and the field is empty on the
  enquiry record until then — so a report that counts empty as "not qualified" misreads its own
  funnel. And an invoice is not revenue: a copay is money, a claim is a promise, and a practice
  that reads its bills as income believes it has been paid when it has not.

  **Scope:** there is no advertising cost anywhere in this model. Clicks, visits, enquiries,
  consultations, treatments, bills and payments are all here; what the practice paid the ad
  platforms for them is not, so cost per acquisition, return on ad spend and budget allocation
  have no answer in it. What it does answer is which advertising brings enquiries a clinician
  will accept, and what those enquiries are worth once they have been treated and paid for. Also
  absent, and worth naming so that nobody looks for them: insurance claims as objects — only
  their trace on an invoice and a payment — multiple clinic locations, clinician capacity and
  scheduling, and a coded procedure catalogue.

  **Three healthcare bundles, and which is which.** `healthcare` models a hospital system:
  appointments, clinical encounters, bed census and the insurance claims that pay for them.
  `healthcare-clinic-network` models a multi-location outpatient operation, with advertising
  spend, clinics, providers and no-shows. This one models a single practice, and its subject is
  the identity and attribution chain: one person, followed from the click that found them to
  the payment that settled their treatment.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-09-23T16:03:30Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Lesley van de Mortel](https://www.linkedin.com/in/lezvandemortel/), [Vlad Flaks](https://github.com/vladflaks)

| Data Mart | Fields |
|-----------|--------|
| [Call](./call.md) | 13 |
| [Click](./click.md) | 12 |
| [Consultation](./consultation.md) | 7 |
| [Customer (Patient)](./customer-patient.md) | 6 |
| [Employee](./employee.md) | 6 |
| [Form Submission](./form-submission.md) | 17 |
| [Invoice](./invoice.md) | 8 |
| [Lead](./lead.md) | 10 |
| [Page](./page.md) | 5 |
| [Page View](./page-view.md) | 9 |
| [Person](./person.md) | 7 |
| [Revenue](./revenue.md) | 8 |
| [Session](./session.md) | 15 |
| [Treatment](./treatment.md) | 9 |

# Example Questions

- Which `pages` and which creatives bring the enquiries a clinician goes on to qualify, rather than the ones that bring `clicks` and stop there?
- Which advertising brings enquiries that look right all the way to the `consultation` and are then refused by the clinician, and what reason is recorded for the refusal?
- How long does money take to arrive once a `treatment` is booked, split between the copay the patient pays before treatment and the insurer's reimbursement afterwards?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/healthcare-clinic-attribution)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Healthcare Clinic Attribution model diagram](../res/screens/healthcare-clinic-attribution.svg)
