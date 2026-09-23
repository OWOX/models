---
title: "Call"
description: |
  Every telephone conversation between the practice and someone enquiring. A phone call
  and a web form are the same step in the funnel, not two funnels: both are the first
  engagement, both create the same [CRM record](./lead.md), and both carry the same
  advertising identifiers when the caller was on the website. A report built on web forms
  alone leaves telephone enquiries out and credits the wrong channels.

  **Those identifiers are empty for a caller with no web history, and that is the record
  being accurate rather than a tracking defect.** Someone rings a number from a leaflet,
  a sign or a recommendation, having never opened the site; there is no visit to match
  them to and no [click](./click.md) to credit. Dropping unattributed calls makes the
  measurable channels look better than they are, so they are kept and reported as demand
  the practice knows it has and cannot yet trace.

  `direction` separates calls received from calls placed: a first screen can begin with
  the practice ringing back, and treating a returned call as a fresh enquiry would
  double-count demand.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-23T14:19:59.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `call_id` | STRING | Call ID | PK. Unique identifier for this one call, separate from the enquiry it belongs to — one enquiry can run to several calls. |
| `lead_id` | STRING | Lead ID | The enquiry record this call opened or added to; every later call about the same enquiry carries the same value. FK to [Lead](./lead.md) |
| `person_id` | STRING | Person ID | The human on the other end, where they can be recognised from the website — reachable through the [enquiry](./lead.md) this call opened or through the [visit](./session.md) it was placed from. Empty for a caller never seen online, which is a fact about the call rather than missing data. |
| `session_id` | STRING | Session ID | The visit the call was placed from, where there was one. Empty for a caller who dialled a number they saw somewhere other than the site. FK to [Session](./session.md) |
| `click_id` | STRING | Click ID | The paid click behind the call. Empty for organic callers and for anyone who never visited the site at all. FK to [Click](./click.md) |
| `called_at` | TIMESTAMP | Called At | When the call took place. Compared with the enquiry's creation time, it separates the first contact from the follow-ups. |
| `direction` | STRING | Direction | Who placed it: `inbound` when the person rang the practice, `outbound` when reception rang them. A returned call is not a second enquiry. |
| `duration_seconds` | INTEGER | Call Length (Seconds) | How long the conversation lasted, in seconds — the difference between a call that was merely picked up and one in which the practice actually spoke to someone. |
| `answered` | BOOLEAN | Answered | Whether anyone picked up. A call nobody answered is an enquiry that never reached a person, and it appears in no report built on web forms. |
| `tracking_number` | STRING | Tracking Number | The number the caller dialled. When a practice publishes a different number per place — site, ad, print — this is what attributes a call that has no web history at all. |
| `utm_source` | STRING | Call Source | Source declared by the link that brought this caller to the site, where there was one, such as `google` or `facebook`. Empty for a caller with no web visit behind them. |
| `utm_medium` | STRING | Call Medium | Medium declared by that link, such as `cpc` or `paid_social` — the tag that marks this call as bought rather than earned. |
| `utm_campaign` | STRING | Call Campaign | Campaign the call is credited to, as named in the ad account. Empty both for unattributed callers and for arrivals that carry no campaign. |

# Example Questions

- What share of our enquiries arrive by phone rather than by form, and does that split differ by campaign?
- How many calls go unanswered, at what times of day, and what does that cost us in enquiries that never became appointments?
- Do callers we can attribute to advertising behave differently from callers with no web history — longer calls, better acceptance at the screen?

## Joins

- [Click](./click.md) — `click_id = click_id` [N:1] — The paid click behind the call; absent for organic and offline callers.
  - [Click Person](./person.md) — The human the paid click behind this call was attributed to.
  - [Click Session](./session.md) — The visit the ad click produced, which need not be the visit this call was placed from.
    - [Click Session Person](./person.md) — The human behind the visit that ad click produced.
- [Lead](./lead.md) — `lead_id = lead_id` [N:1] — The CRM record this call produced or added to.
  - [Lead Person](./person.md) — The human the CRM enquiry is filed under, which gathers every call about the same enquiry.
- [Session](./session.md) — `session_id = session_id` [N:1] — The visit the call was placed from; absent for a caller with no web history.
  - [Session Person](./person.md) — The human behind the visit this call was placed from.
