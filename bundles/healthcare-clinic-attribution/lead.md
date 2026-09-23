---
title: "Lead"
description: |
  The enquiry as the practice's CRM holds it: a named person with contact details,
  created the moment someone first gets in touch, by web form or by phone. It does not
  exist beforehand, which is why the [form submission](./form-submission.md) and the
  [call](./call.md) point at the lead rather than the other way round. `person_id`
  traces the enquiry back to the [browsing](./person.md) that preceded it by months or
  years, and the advertising identifiers copied onto the record keep a campaign attached
  to that name long afterwards. One lead is one person's enquiry, not one contact
  attempt: the same lead may submit several forms, make several calls, and be screened
  more than once.

  **`is_qualified` is empty on this mart, and that is by design, not by omission.** The
  CRM carries the field from the start, but at the enquiry stage nobody has yet spoken to
  the person; the decision is taken later, at a
  [consultation](./consultation.md), and stored there. A report that counts unqualified
  enquiries as `is_qualified = false` will therefore undercount them: the enquiries that
  were never accepted are not false, they are empty. To judge an enquiry's outcome, look
  at the consultations attached to it, not at this field.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-23T14:19:58.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `lead_id` | STRING | Lead ID | PK. The CRM's own reference for the enquiry, issued when the first form or call arrives. It is a number in the CRM, carried here as a fixed-width string of digits so that sorting by it always follows the order the records were issued. |
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
