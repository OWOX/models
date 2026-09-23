---
title: "Person"
description: |
  The human behind everything else in this model. The identity is minted at the very
  first page view — before anyone has given a name, an email or a phone number — and is
  never reissued, so a phone at lunchtime, a laptop weeks later and a call months after
  that all belong to one person. It keeps the source, medium and campaign of that first arrival
  frozen, so the ad that started a journey is still attached when the money arrives,
  whether that takes two weeks or twenty years.

  Two levels of identity sit here, and keeping them apart is what makes attribution
  honest. `visitor_id`, carried on the [session](./session.md), is browser-level — the
  Google Analytics `client_id` — and changes with a new device, a cleared cookie or a
  different browser. `person_id` sits above it: several of those resolved to one human.
  Grouping by `visitor_id` counts devices; grouping by `person_id` counts people, and a
  practice's patient numbers only mean anything at the second level. This way of
  stitching a person together across devices and years is the one
  [APAS® Cloud](https://www.apascloud.com/) uses, described for this model by its
  co-founder.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

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
