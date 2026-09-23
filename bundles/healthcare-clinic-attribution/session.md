---
title: "Session"
description: |
  One visit to the practice's website, from the moment someone arrives to the moment they
  go quiet; everything seen or clicked in between belongs to it. A session carries the
  channel that brought this particular visit, the device it happened on and where in the
  world it came from, so it answers "what was this trip for", while the
  [person](./person.md) record answers "who was this and what first brought them here".

  `visitor_id` is browser-level — the Google Analytics `client_id` — lost when someone
  switches device, clears cookies or changes browser; `person_id` sits above it. Counting
  distinct visitors counts browsers, counting distinct people counts prospective
  patients, and only the second means anything for a practice's own numbers.

  The UTM fields describe *this* visit and are deliberately not the first-touch source
  frozen on the person: someone who arrived through an ad and returned through a branded
  search has one record of each, which separates the channel that creates demand from the
  channel that merely collects it. `campaign`, `term` and `content` are empty for visits
  that carry no campaign at all, the normal state for direct and organic arrivals.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `session_id` | STRING | Session ID | PK. Unique identifier for this visit. Every page view and every ad click that landed in the visit carries it. |
| `person_id` | STRING | Person ID | The human this visit belongs to, which is how visits made months apart and on different devices add up to one journey. FK to [Person](./person.md) |
| `visitor_id` | STRING | Visitor ID | Browser-level identifier the visit was recorded under — one browser on one device. Several of these belong to one person, so counting them counts devices, not patients. |
| `started_at` | TIMESTAMP | Started At | When the visit began, which is the moment of its first page view. |
| `ended_at` | TIMESTAMP | Ended At | When the visit was closed off after the visitor went quiet. The gap from `started_at` is the time spent on site. |
| `source` | STRING | Source | Where this particular visit came from, such as `google`, `facebook` or `direct` — the source of this trip, not of the person's first ever arrival. |
| `medium` | STRING | Medium | How the visit arrived, such as `cpc`, `organic` or `referral` — the line between traffic that was paid for and traffic that was not. |
| `campaign` | STRING | Campaign | Campaign behind this visit. Empty for arrivals that carry no campaign, such as direct traffic or unpaid search. |
| `term` | STRING | Search Term | Keyword the visit was bought or found under, where the channel supplies one. |
| `content` | STRING | Creative | Which creative or link variant brought this visit, matching the creative identifier carried on the ad click. |
| `landing_page_url` | STRING | Landing Page | Address of the first page seen in this visit — the page that had to do the persuading. |
| `device_type` | STRING | Device Type | What the visit happened on: `mobile`, `desktop` or `tablet`. One person's visits can be spread across several devices, which is why this sits on the visit rather than on the person. |
| `browser` | STRING | Browser | Browser the visit was made in. Useful for spotting tracking that has broken in one browser and not the others. |
| `country` | STRING | Country | Country the visit came from, which is what separates local demand from traffic a single-site practice can never treat. |
| `is_first_session` | BOOLEAN | Is First Session | TRUE for the one visit during which this person's identity was minted, and FALSE for every return. Splits new prospects from returning ones without recomputing the journey. |

# Example Questions

- How many visits does someone make, and over how many weeks, before they give us their contact details?
- Which channels bring back people who already know us, rather than paying again for visitors who arrived through another route first?
- Do visits on a phone behave differently from visits on a desktop — shorter, earlier in the journey, less likely to end in an enquiry?

## Joins

- [Person](./person.md) — `person_id = person_id` [N:1] — The human this visit belongs to, across every device they use.
