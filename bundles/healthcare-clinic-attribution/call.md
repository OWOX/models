---
title: "Call"
description: |
  Every telephone conversation between the practice and someone enquiring — the call they
  make and the call reception makes back. A phone call and a web form are the same step in
  the funnel, not two different funnels: both are the first engagement, both create the same
  CRM record, and both carry the same advertising identifiers when the caller can be
  recognised from the website.

  Treating the phone as a lesser channel is how a clinic misreads its own advertising.
  People want to speak to someone at the practice before committing to an appointment, and
  a report built on web forms alone leaves every one of those enquiries out of the count.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Call

One row per telephone call, keyed by `call_id`. A call sits at exactly the same level as a
[web form](./form-submission.md): someone rings the practice or reception rings them, and
that contact opens a [CRM record](./lead.md) if there is not one already. This is where a
funnel built only on web forms goes wrong — form submissions are easy to count, calls are not, and leaving the calls out
quietly credits the wrong channels.

Because a call and a form are the same step, this mart carries the same attribution
columns a form submission does. When the caller has been on the website, `person_id`,
`session_id` and `click_id` resolve their [visit](./session.md) and the advertising behind
it, and the `utm_*` fields record what that link declared.

**Those columns are empty for a caller with no web history, and that is the record being
accurate rather than a tracking defect.** Someone rings a number from a
printed leaflet, a sign, a directory or a recommendation, having never opened the site at
all; there is no visit to match them to and no [click](./click.md) to credit. The number
they dialled is what is left to say where they came from. Dropping unattributed calls makes the
measurable channels look better than they are, so they are kept, counted, and reported as
what they are: demand the practice knows it has and cannot yet trace.

`tracking_number` is what rescues part of that. A practice that publishes a different
number in each place — on the site, in an ad, on print — can read the channel off the
number dialled even when the caller was never seen online.

`direction` separates the calls the practice receives from the ones it places. Both belong
here, because a first screen can begin with the practice ringing the person back rather
than with an inbound call, and treating a returned call as a fresh enquiry would
double-count demand.

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `call_id` | STRING | Call ID | PK. Unique identifier for this one call, separate from the enquiry it belongs to — one enquiry can run to several calls. |
| `lead_id` | INTEGER | Lead ID | The enquiry record this call opened or added to; every later call about the same enquiry carries the same value. FK to [Lead](./lead.md) |
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

- [Lead](./lead.md) — `lead_id = lead_id` [N:1] — The CRM record this call produced or added to.
  - [Lead Person](./person.md) — The human the CRM enquiry is filed under, which gathers every call about the same enquiry.
- [Session](./session.md) — `session_id = session_id` [N:1] — The visit the call was placed from; absent for a caller with no web history.
  - [Session Person](./person.md) — The human behind the visit this call was placed from.
- [Click](./click.md) — `click_id = click_id` [N:1] — The paid click behind the call; absent for organic and offline callers.
  - [Click Person](./person.md) — The human the paid click behind this call was attributed to.
  - [Click Session](./session.md) — The visit the ad click produced, which need not be the visit this call was placed from.
    - [Click Session Person](./person.md) — The human behind the visit that ad click produced.
