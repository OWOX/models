---
title: "Click"
description: |
  Every click on one of the practice's ads, held as its own record rather than as columns
  on whatever happened next, and keyed the same way on every platform so clicks across
  Google, Meta, Microsoft and TikTok count in one place. `session_id` is empty when the
  click produced no visit — the person tapped and went straight back, the page failed,
  tracking was blocked — and those clicks were still paid for, so dropping them is how
  advertising quietly looks better than it was.

  `platform_click_id` holds the raw value the ad platform itself attached: the `gclid`,
  `fbclid`, `msclkid` or `ttclid`. It is the harder evidence of a paid arrival, and needs
  one guard: **a value shorter than ten characters should be treated as absent** — below
  that what turns up is `undefined`, `null`, empty strings and truncated fragments, which
  inflate whichever channel they land in. Lesley van de Mortel, who described this model,
  uses that minimum in her own SQL and pairs it with a check on `utm_source` and
  `utm_medium`, so a claimed channel agrees with itself from two directions.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-23T14:19:59.000Z
---

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
