---
title: "Page View"
description: |
  Every page a visitor actually opened, in the order they opened it. Where a
  [page](./page.md) is described once and for all, a page view is one reading of it by
  one person at one moment — which is what turns a site map into a record of behaviour.

  This mart reaches further back than anything else in the model: the very first page
  view is where a person's identity is minted — before a name, before an email, before
  anyone at the practice knows a prospective patient is there. It is also what makes
  "what did they read before they got in touch" answerable. `sequence_in_session` makes a
  journey readable as an order rather than a pile of URLs; `is_entrance` and `is_exit`
  mark its two ends: entrances say which pages bring people in, exits say where
  attention is lost, and those are two different lists.

  `time_on_page_seconds` is measured from when the next page was opened, so it cannot be
  known for the last page of a visit. That value is empty rather than zero, and treating
  it as zero understates how long the site was read for.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

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
