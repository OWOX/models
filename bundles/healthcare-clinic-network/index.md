---
title: "Healthcare Clinic Network"
description: |
  A network of multi-specialty outpatient clinics across the United States and Canada, modelled from
  the first advertising impression through to the revenue a clinician bills at the chair. Budget
  bought by keyword and creative brings visits to the website; a fraction of those visits ask for an
  appointment, most of them by picking up the phone; a small contact-centre team works those
  enquiries until they are booked or given up on; and the appointments that follow are either
  attended, cancelled in advance or simply not turned up to. Patients accumulate a visit history,
  a lifetime value and a recency segment on top of that, along with the treatment that was planned
  for them and never delivered. Locations bill in their own currency and every revenue figure is
  also carried converted, so a network spanning two countries reads as one business.

  **Scope:** this model covers demand generation, intake and delivered care — what it costs to
  acquire a patient, whether the contact centre reaches them, whether they attend, and what the
  visit bills. The payer side is out of scope: insurance appears only as how a visit was settled,
  and there are no insurance plans, claims, reimbursements or denial rates here, so payer mix and
  revenue-cycle questions have no answer in this model. Nor does it model the schedule as
  capacity — there are appointments, but no slots or clinician availability — or a coded procedure
  catalogue. What it answers well is the whole path from spend to attended, billed care.

  **How this business is managed**
  - **Marketing** — brings in new patients from search, social and referral traffic at an acquisition cost the clinics can carry.
  - **Patient Access** — reaches every enquiry and turns as many as possible into a booked patient.
  - **Clinic Operations** — keeps clinicians' diaries filled with visits that actually happen.

  **Key metrics**
  - New patients — [Attribution · New Patients](./attribution.md?field=new_patients) by [Attribution · Date](./attribution.md?field=date).
  - Ad spend — [Attribution · Normalized Cost](./attribution.md?field=cost_normalized), in USD across both countries; per new patient, [Attribution · Cost per New Patient (Paid)](./attribution.md?field=cost_per_new_patient).
  - Enquiry close rate — [Leads · Enquiry Close Rate](./leads.md?field=close_rate), a 0–1 share, by [Leads · Lead Submitted At](./leads.md?field=lead_submitted_at).
  - No-show rate and what an attended visit bills — [Visits · No-Show Rate](./visits.md?field=no_show_rate) (a 0–1 share) and [Visits · Revenue per Attended Visit](./visits.md?field=revenue_per_visit), by [Visits · Visit Date](./visits.md?field=visit_date).

  **Key Data Marts**
  - [Attribution](./attribution.md) — spend and its outcomes on one row per day, channel, campaign and country.
  - [Leads](./leads.md) — every enquiry, and whether it became a patient.
  - [Visits](./visits.md) — every appointment, what became of it and what it billed.
  - [Patients](./patients.md) — each patient's visit history, lifetime value and unused planned treatment.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-10-20T20:05:06Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Vlad Flaks](https://github.com/vladflaks), [Rus Obolonsky](https://github.com/Obolrus)

| Data Mart | Fields |
|-----------|--------|
| [Ad Spend](./ad-spend.md) | 11 |
| [Attribution](./attribution.md) | 16 |
| [Clinic](./clinic.md) | 10 |
| [Communications](./communications.md) | 16 |
| [Leads](./leads.md) | 13 |
| [Patient Access Agent](./patient-access-agent.md) | 7 |
| [Patients](./patients.md) | 28 |
| [Provider](./provider.md) | 7 |
| [Sessions](./sessions.md) | 23 |
| [Visits](./visits.md) | 19 |

# Example Questions

- Which channels buy `patients` worth keeping rather than merely cheap ones — do the campaigns with the lowest cost per enquiry produce patients who return and accumulate real lifetime value, or ones who attend once and lapse?
- Does the contact centre change the outcome — do enquiries someone actually reached get booked and attended more often than the ones that went unanswered, and how many attempts is that worth?
- Where is capacity being lost, and what is it worth — how much revenue sits in no-shows and cancellations by location and specialty, and how much more sits in treatment that was planned and never delivered?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/healthcare-clinic-network)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Healthcare Clinic Network model diagram](../res/screens/healthcare-clinic-network.svg)
