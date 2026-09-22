---
title: "Page View"
description: |
  Every page a visitor actually opened, in the order they opened it. Where the page record
  describes a page once and for all, a page view is one reading of it by one person at one
  moment — which is what turns a site map into a record of behaviour.

  This is the mart that makes "what did they read before they got in touch" answerable. A
  practice can see whether the people who eventually book treatment passed a pricing page,
  how deep into the site an enquiry comes from, and which pages are where visitors
  quietly leave.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Page View

One row per page opened, keyed by `page_view_id`. A page view belongs to the
[visit](./session.md) it happened in, to the [person](./person.md) who made it, and to
the [page](./page.md) that was read — and it is this
mart that holds all three, not the other way round. One page is read many times, so the
view is what carries `page_id`; a page record carries nothing about who saw it.

The very first page view in the practice's records is where a person's identity is minted,
which is why this mart reaches further back than anything else in the model: it exists
before a name, before an email, before a phone call, and before anyone at the practice
knows a prospective patient is there at all.

`sequence_in_session` is what makes a journey readable as a sequence rather than a pile of
URLs — first page, second page, third — and `is_entrance` and `is_exit` mark the two ends
of it. Entrances say which pages are doing the work of bringing people in; exits say where
attention is lost, which is a different list.

`time_on_page_seconds` is measured from when the next page was opened, so it cannot be
known for the last page of a visit — that value is empty rather than zero, and treating it
as zero understates how long the site was read for.

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `page_view_id` | STRING | Page View ID | PK. Unique identifier for this one reading of a page by one person at one moment. |
| `session_id` | STRING | Session ID | The visit this reading happened in, which is what puts it in order next to everything else seen during the same visit. FK to [Session](./session.md) |
| `person_id` | STRING | Person ID | The human who read the page. Carried here as well as on the visit, so a person's whole reading history can be assembled without walking through sessions. FK to [Person](./person.md) |
| `page_id` | STRING | Page ID | Which page was read. The view holds this, because one page is read many times. FK to [Page](./page.md) |
| `viewed_at` | TIMESTAMP | Viewed At | When the page was opened. On a person's earliest page view, this is also the moment their identity was minted. |
| `sequence_in_session` | INTEGER | Position In Visit | Where this page sat in the visit, counting from 1 — what makes a journey readable as an order rather than a set of URLs. |
| `time_on_page_seconds` | INTEGER | Time On Page (sec) | Seconds until the next page was opened. Empty for the last page of a visit, where there is no next page to measure against — not zero. |
| `is_entrance` | BOOLEAN | Is Entrance | TRUE when this was the first page of the visit: the page that had to earn the visitor's attention. |
| `is_exit` | BOOLEAN | Is Exit | TRUE when this was the last page of the visit — where the visitor stopped, whether satisfied or not. |

# Example Questions

- What did the people whose enquiries a clinician later qualified read on the site, and how does that differ from the people who were turned away?
- Which `pages` do visitors leave from most often, and are those pages on the path to an enquiry or off it?
- How many `pages`, and how much reading, does a visit usually take before someone gives us their contact details?

## Joins

- [Session](./session.md) — `session_id = session_id` [N:1] — The visit this page was seen during.
  - [Session Person](./person.md) — The human behind the visit this reading happened in, which the view itself already carries directly.
- [Person](./person.md) — `person_id = person_id` [N:1] — The human who viewed it.
- [Page](./page.md) — `page_id = page_id` [N:1] — Which page was viewed.
