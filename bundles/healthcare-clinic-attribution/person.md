---
title: "Person"
description: |
  The human behind everything else in this model, recognised from their very first page view
  and never renumbered afterwards. A patient's arrival need not be one sitting: someone reads
  about a treatment on a phone, comes back on a laptop weeks later, rings the practice, and
  books months after that. Person is what holds those fragments together, and it keeps the source,
  medium and campaign of that first arrival frozen on the record — so the ad that started a
  journey is still attached to it when the money finally arrives, whether that takes two
  weeks or twenty years.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Person

One row per human known to the practice, keyed by `person_id`. The identity is minted on
the very first page view — before anyone has given a name, an email or a phone number —
and it is never reissued. Everything later in the model hangs off it:
[sessions](./session.md), [page views](./page-view.md), [ad clicks](./click.md),
[enquiries](./lead.md), [consultations](./consultation.md),
[treatments](./treatment.md) and the money.

There are two levels of identity here, and keeping them apart is what makes attribution
honest. `visitor_id`, carried on the session, is a browser-level identifier — the
equivalent of the Google Analytics `client_id`. It changes when someone switches from
their phone to a laptop, clears their cookies, or returns in a different browser.
`person_id` sits above it: several `visitor_id` values, several devices and several years
of visits resolved to one human. Grouping by `visitor_id` counts devices; grouping by
`person_id` counts people, and a practice's patient numbers only mean anything at the
second level.

This way of stitching a person together across devices and years is the one used by
[APAS® Cloud](https://www.apascloud.com/), whose co-founder described it for this model.

Because the identity is minted at the first page view and survives indefinitely, a patient
who first clicked an ad years ago still resolves to their original source. That is what
`first_source`, `first_medium` and `first_campaign` record: the first touch, frozen at the
moment the practice was found, and never overwritten by whatever brought the person back
later. It is what answers "which advertising produced this patient" in a business where the
click and the treatment can be years apart.

`identified_at` is NULL for as long as the person is still anonymous — the state everyone
is in before they first give contact details; it fills in the moment those details
are given. `first_landing_page_url` is kept as plain text rather than as a link to a
page record, because a site gets rewritten and the page that brought someone in years ago
may no longer exist.

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `person_id` | STRING | Person ID | PK. Unique identifier for the human, minted at their first page view and never reissued — one person across every device and browser they use. |
| `first_seen_at` | TIMESTAMP | First Seen At | When the practice first saw this person: the moment of the first page view, which is also when the identity was minted. |
| `first_source` | STRING | First Source | Where the person came from on that very first visit, such as `google`, `facebook` or `direct`. Frozen on the person, so it still describes a patient treated years later. |
| `first_medium` | STRING | First Medium | How that first visit arrived, such as `cpc`, `organic` or `referral` — the split between paid and earned traffic at first touch. |
| `first_campaign` | STRING | First Campaign | Campaign that brought the person in the first time. NULL when the first visit came from somewhere that carries no campaign, such as direct or organic search. |
| `first_landing_page_url` | STRING | First Landing Page | Address of the page the person first landed on. Plain text rather than a link to a page record, because a site gets rewritten and that page may no longer exist. |
| `identified_at` | TIMESTAMP | Identified At | When the person first gave contact details and stopped being anonymous. NULL for someone who has only ever browsed. |

# Example Questions

- How long does it take people to go from their first `page view` to giving us their contact details, and does that gap differ by the channel they first arrived through?
- What share of the people who first found us this year are still anonymous, and what does that unworked audience amount to?
- Which first-touch campaigns bring people who eventually identify themselves and enquire, rather than people who read once and never come back?
