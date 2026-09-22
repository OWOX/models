---
title: "Form Submission"
description: |
  Every web form the practice receives — a consultation request, a callback request, an
  enquiry about a treatment — held as its own record with the advertising that produced it
  attached to it. A form submission is one of the two ways an enquiry begins; ringing the
  practice is the other, and the two are the same step in the funnel.

  This is where the trail from advertising to a named person is actually made. The campaign,
  the keyword, the creative and the platform's own click identifier are all carried on the
  submission and copied onto the CRM record it creates, so an enquiry can still be traced to
  the ad that produced it long after the visit has ended.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Form Submission

One row per web form received, keyed by `form_submission_id`. A submission is the first
engagement with the practice: it creates a [CRM record](./lead.md) if the person has not enquired
before, and attaches to the existing one if they have. One enquiry can produce several
submissions — someone fills in a form, hears nothing quickly enough, and fills in another —
so counting rows here counts contact attempts, not prospective patients.

A submission carries two families of advertising identifiers, and they are worth keeping
apart. The five `utm_*` fields are what the link itself declared, set by hand when the ad
was built. The four click identifiers — `gclid`, `fbclid`, `msclkid`, `ttclid` — are what
the advertising platform attached, and they are the harder evidence of the two. In
practice a channel is best segmented on both at once: the platform identifier present and
long enough to be genuine, agreeing with a `utm_source` and `utm_medium` that name the same
channel. As on the [ad click](./click.md), **a platform click identifier shorter than ten characters
should be treated as absent** — below that length what turns up is placeholder text and
truncated debris rather than a click, and counting it inflates whichever channel is being
judged.

An empty attribution field here is normal rather than broken. Someone who found the
practice through unpaid search or typed the address in carries no campaign and no click
identifier at all, and the identifiers belonging to the platforms a person did not arrive
through are empty as well. What is not empty is what flows onward
into the enquiry record, which is how a campaign stays attached to a name through months
of follow-up.

`click_id` is the practice's own link back to the paid click, and it is empty for organic
and direct arrivals. `session_id` ties the submission to the [visit](./session.md) it
happened in, which is what allows the pages read before the form was sent to be counted as part of the same
decision.

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `form_submission_id` | STRING | Form Submission ID | PK. Unique identifier for this one form, separate from the enquiry it belongs to — one enquiry can produce several. |
| `lead_id` | INTEGER | Lead ID | The enquiry record this submission opened or added to; repeat submissions from the same person all carry the same value. FK to [Lead](./lead.md) |
| `person_id` | STRING | Person ID | The human who submitted it. Reach them through the [enquiry](./lead.md) this submission opened or through the [visit](./session.md) it was sent during, both of which carry the same identifier back to the anonymous browsing and advertising that came before. |
| `session_id` | STRING | Session ID | The visit the form was sent during, which is how the pages read beforehand can be counted as part of the same decision. FK to [Session](./session.md) |
| `click_id` | STRING | Click ID | The paid click that brought this person to the site. Empty for organic and direct arrivals, which is the normal state rather than missing data. FK to [Click](./click.md) |
| `submitted_at` | TIMESTAMP | Submitted At | When the form was sent. Measured back to the person's first page view, it is how long the journey to an enquiry took. |
| `form_name` | STRING | Form Name | Which form on the site was used — a consultation request asks for more commitment than a callback request, and they should not be counted as one. |
| `page_url` | STRING | Form Page | Address of the page the form was sent from, which is the page whose argument actually persuaded the person to get in touch. |
| `utm_source` | STRING | Submission Source | Source declared by the link that brought this person, such as `google` or `tiktok`. Set by hand in the ad, so worth checking against the platform's own click identifier. |
| `utm_medium` | STRING | Submission Medium | Medium declared by the link, such as `cpc` or `paid_social` — the tag that marks this enquiry as bought rather than earned. |
| `utm_campaign` | STRING | Submission Campaign | Campaign the enquiry is credited to, as named in the ad account. Empty for arrivals that carry no campaign at all. |
| `utm_term` | STRING | Submission Search Term | Keyword behind the enquiry, where the channel sells keywords. Empty on platforms that sell audiences instead. |
| `utm_content` | STRING | Submission Creative | Which creative the person came through — the image, video or headline. This is the level at which advertising is actually changed, so it is the level worth judging enquiries at. |
| `gclid` | STRING | Google Click ID | Google's own identifier for the click behind this submission. Treat a value shorter than ten characters as absent. |
| `fbclid` | STRING | Meta Click ID | Meta's own identifier for the click behind this submission, covering Facebook and Instagram. Treat a value shorter than ten characters as absent. |
| `msclkid` | STRING | Microsoft Click ID | Microsoft's own identifier for the click behind this submission. Treat a value shorter than ten characters as absent. |
| `ttclid` | STRING | TikTok Click ID | TikTok's own identifier for the click behind this submission. Treat a value shorter than ten characters as absent. |

# Example Questions

- Which forms on the site produce enquiries a clinician goes on to accept, and which merely produce volume?
- Which creatives are behind our web enquiries, rather than only which campaigns — and does the ranking change between the two?
- How many forms does one enquiry take before the practice gets back to them, and does that repeat-submission rate differ by channel?

## Joins

- [Lead](./lead.md) — `lead_id = lead_id` [N:1] — The CRM record this submission produced or added to; one lead may submit several forms.
  - [Lead Person](./person.md) — The human the CRM enquiry is filed under, which can gather several submissions under one record.
- [Session](./session.md) — `session_id = session_id` [N:1] — The visit it was submitted during.
  - [Session Person](./person.md) — The human behind the visit this form was sent during.
- [Click](./click.md) — `click_id = click_id` [N:1] — The paid click that brought them; absent for organic and direct visits.
  - [Click Person](./person.md) — The human the paid click that brought this person was attributed to.
  - [Click Session](./session.md) — The visit the ad click produced, which need not be the visit this form was sent during.
    - [Click Session Person](./person.md) — The human behind the visit that ad click produced.
