---
title: "Lead"
description: |
  The enquiry as the practice's CRM holds it: a named person with contact details, created
  the moment someone first gets in touch — by web form or by phone — and worked from there.
  This is the record a receptionist opens, the one a marketing report counts, and the one the
  advertising identifiers are copied onto when the enquiry arrives, which is what keeps a
  campaign attached to a name long after the visit that produced it has ended.

  One lead is one person's enquiry, not one contact attempt. The same lead may submit five
  forms and make ten calls, and be screened more than once; all of that hangs off this single
  record. Read `is_qualified` with care: it is empty here, because at the enquiry
  stage nobody has decided yet.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Lead

One row per enquiry, keyed by `lead_id`, as the practice's CRM — Salesforce, HubSpot or
whichever system the clinic runs on — records it. The lead comes into being *after* the
first engagement: someone submits a web form or rings the practice, and that contact
creates the CRM record. It does not exist beforehand, which is why the
[form submission](./form-submission.md) and the [call](./call.md) each point at the lead
rather than the other way round.

The lead is also the point at which an anonymous journey acquires a name. Everything before
it — [visits](./session.md), [page views](./page-view.md), [ad clicks](./click.md) —
belongs to a [person](./person.md) the practice cannot yet address.
`person_id` is the link between the two, and it is what allows an enquiry to be traced back
to the advertising that started it months or years earlier.

**`is_qualified` is empty on this mart, and that is by design, not by omission.** The CRM carries the field from the very start, because it is a standard part of
the record, but at the enquiry stage nobody at the practice has yet spoken to the person or
formed a view. The decision is taken later, at a [consultation](./consultation.md), and it is stored
there.
A report that counts unqualified enquiries as `is_qualified = false` will therefore
undercount them: the enquiries that were never accepted are not false, they are
empty. To judge an enquiry's outcome, look at the consultations attached to it, not at this
field.

One lead holds many engagements. A person who fills in a form, does not hear back quickly
enough and then telephones has produced one lead, one form submission and one call — not
two or three enquiries. Counting rows on the engagement marts counts contact attempts;
counting rows here counts prospective patients, and the two numbers can be far apart in a
practice that follows up by phone.

`first_engagement_type` records which of the two started it, and it is the cheapest way to
split a channel's telephone demand from its web demand without joining anything. The
contact details are the practice's own working copy, held on the record the staff actually
use.

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `lead_id` | INTEGER | Lead ID | PK. The CRM's own numeric identifier for the enquiry, issued when the first form or call arrives. |
| `person_id` | STRING | Person ID | The human this enquiry belongs to, which is what ties a named enquiry back to the anonymous browsing and advertising that preceded it. FK to [Person](./person.md) |
| `first_name` | STRING | Lead First Name | Given name as the enquirer supplied it, which is what the practice has to work with — it need not match any later clinical record. |
| `last_name` | STRING | Lead Last Name | Family name as the enquirer supplied it. |
| `email` | STRING | Email | Email address given at the enquiry. Empty when the person only ever telephoned and left no address. |
| `phone` | STRING | Phone | Telephone number given at the enquiry, and the one reception will call back on for the first screen. |
| `crm_contact_id` | STRING | CRM Contact ID | The contact's identifier in the practice's CRM, which is what a marketing team uses to reconcile this record against the system staff work in day to day. |
| `created_at` | TIMESTAMP | Created At | When the CRM record was opened, which is the moment of the first form submission or call rather than of any earlier visit. |
| `first_engagement_type` | STRING | First Engagement Type | Which contact created the record: `form` or `call`. The two are the same funnel step, so this is what separates a channel's telephone demand from its web demand. |
| `is_qualified` | BOOLEAN | Qualified on the Lead Record | Empty at this stage. The CRM carries the field from the start, but nobody has decided at this stage — the verdict is taken at a consultation and stored there. Counting empty as `false` will undercount the enquiries that were not accepted. |

# Example Questions

- How many enquiries does a channel produce, and how many of them survive the first phone screen rather than merely arriving?
- Do enquiries that start with a phone `call` behave differently from those that start with a web form — faster to screen, more likely to be accepted?
- How long does it take from the first enquiry to a booked appointment, and which campaigns produce the enquiries that move quickest?

## Joins

- [Person](./person.md) — `person_id = person_id` [N:1] — The human behind the enquiry, which is how a lead connects to anything that happened before it.
