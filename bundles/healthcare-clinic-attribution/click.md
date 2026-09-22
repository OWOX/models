---
title: "Click"
description: |
  Every click on one of the practice's ads, held as its own record rather than as a few
  columns on whatever happened next. This is the paid end of the journey: the moment money
  was spent on a particular person, on a particular platform, through a particular creative
  — before anyone knows whether that person will ever become a patient.

  Keeping clicks separate is what lets a practice ask an honest question about advertising.
  A click that produced no visit still cost money; a person who clicked four ads over five
  months is not four people; and a creative that draws clicks cheaply is not necessarily the
  one that draws patients a clinician will accept.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Click

One row per ad click, keyed by `click_id` — an identifier the practice controls, minted the
same way whatever platform the click came from, so clicks across Google, Meta, Microsoft
and TikTok can be counted in one place without translating between four sets of rules.

A click belongs to a [person](./person.md) and, when it produced one, to a
[visit](./session.md). `session_id` is empty
when the click never produced one: the person tapped and immediately went back, the page
failed to load, or tracking was blocked. Those clicks are still paid for, and dropping them
because they have no visit is how advertising quietly looks better than it was.

`platform_click_id` holds the raw value the ad platform itself attached — the `gclid` from
Google, the `fbclid` from Meta, the `msclkid` from Microsoft, the `ttclid` from TikTok.
These values are the evidence that a person genuinely came through paid advertising, and
they need one guard before they can be trusted: **a platform click identifier shorter than
ten characters should be treated as absent.** What turns up below that threshold is the
debris of tracking — the literal text `undefined`, `null`, empty strings and truncated
fragments picked up along the way. Counting those as clicks inflates whichever channel they
were recorded against. Lesley van de Mortel, who described this model, uses that
ten-character minimum in her own SQL, and pairs it with
a check on `utm_source` and `utm_medium` so that a claimed channel has to agree with itself
from two directions.

`utm_content` is where the creative identifier lives. That single convention is what makes
"which ad actually works" an answerable question rather than a guess: without it a practice
can compare platforms and campaigns but never the individual image, video or headline
inside them, which is the level at which advertising is actually changed. When a clinic is
running several variations of the same promise, this is the field that tells them which
promise brought the patient.

The UTM fields here also travel onward: whatever is set on the click is carried into the
[enquiry](./lead.md) that follows — the [web form](./form-submission.md) or the
[phone call](./call.md) — and from there into the CRM record,
which is what keeps a click attached to money collected months later.

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `click_id` | STRING | Click ID | PK. The practice's own identifier for the click, minted the same way on every platform so clicks can be counted in one place. |
| `person_id` | STRING | Person ID | The human who clicked, which is what lets several clicks over months be recognised as one person's journey rather than several prospects. FK to [Person](./person.md) |
| `session_id` | STRING | Session ID | The visit the click produced. Empty when it produced none — the click was still paid for, and excluding those flatters the channel. FK to [Session](./session.md) |
| `clicked_at` | TIMESTAMP | Clicked At | When the ad was clicked. The gap between here and any money that follows can run from weeks to years in this business, so a same-month comparison will miss it. |
| `ad_platform` | STRING | Ad Platform | Which advertising platform the click came from: `google_ads`, `meta`, `microsoft` or `tiktok`. |
| `platform_click_id` | STRING | Platform Click ID | The raw identifier the platform attached — `gclid`, `fbclid`, `msclkid` or `ttclid`. Treat anything shorter than ten characters as absent: below that it is placeholder text, not a click. |
| `utm_source` | STRING | UTM Source | Source the ad link declared, such as `google` or `tiktok`. Worth checking against `ad_platform` rather than trusting alone, because it is set by hand in the ad. |
| `utm_medium` | STRING | UTM Medium | Medium the ad link declared, such as `cpc` or `paid_social` — the tag that marks this traffic as bought. |
| `utm_campaign` | STRING | UTM Campaign | Campaign the click was bought under, as named in the ad account. |
| `utm_term` | STRING | UTM Term | Keyword the click was bought under, where the platform works that way. Empty on platforms that sell audiences rather than search terms. |
| `utm_content` | STRING | Ad Creative | Which creative was clicked — the image, video or headline. This is the field that makes "which ad works" answerable at all, rather than only "which campaign works". |
| `landing_page_url` | STRING | Ad Landing Page | Address the ad sent the person to, which is what the click's promise has to be judged against. This is the ad's side of a pair: the visit records its own landing page separately. |

# Example Questions

- Which creatives bring the people who go on to be qualified by a clinician, rather than the ones who merely click cheaply?
- What share of our ad clicks never turn into a visit at all, and does that differ between platforms?
- How many ad clicks does a patient typically take, and over how long, before they get in touch?

## Joins

- [Person](./person.md) — `person_id = person_id` [N:1] — The human who clicked the ad.
- [Session](./session.md) — `session_id = session_id` [N:1] — The visit the click landed in; absent when the click never produced one.
  - [Session Person](./person.md) — The human behind the visit this click produced, reached through the visit rather than off the click.
