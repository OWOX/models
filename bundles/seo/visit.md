---
title: "Visit"
description: |
  Somebody — or something — arriving on one of a site's pages. This is the event the
  whole model points at: most practitioners do treat the visit as their target event,
  and it is where this model stops. What happens past the arrival belongs to a different
  model.

  There is no key from a visit to the query that produced it, and that is deliberate
  rather than missing. What an arrival brings with it is how it arrived — the channel
  and the source — and not the words somebody typed to get there. Demand and behaviour
  therefore meet in the daily aggregate in [Search
  Performance](./search-performance.md), which is keyed by query and page, and nowhere
  else.

  A visit is also the raw material of the user signals that decide whether a position
  survives: of the sites somebody opens for one query, the one they spent three minutes
  on and the one they left at once are read differently, and the one they left at once
  is thrown out of the top five so the next site can have its chance.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `visit_id` | STRING | Visit ID | PK. The identifier of this arrival. |
| `page_id` | STRING | Page ID | The page that was landed on. FK to [Page](./page.md) |
| `channel_id` | STRING | Channel ID | How the visitor arrived, as an analytics tool classifies it. FK to [Channel](./channel.md) |
| `occurred_at` | TIMESTAMP | Occurred At | When the arrival happened. |
| `user_agent` | STRING | User Agent | How the visitor introduced itself. Anyone requesting a page on the internet is obliged to state a user agent. |
| `is_bot` | BOOLEAN | Is Bot | Whether this was a robot rather than a person, read off the user agent — usually more than enough to tell the two apart. |
| `pages_viewed` | INTEGER | Pages Viewed | How many pages the visitor opened on the site during this arrival. |
| `duration_seconds` | INTEGER | Duration in Seconds | How long the arrival lasted. |
| `bounced` | BOOLEAN | Bounced | Whether the visitor left straight away instead of going any further into the site. |
| `is_qualified` | BOOLEAN | Is Qualified | Whether this arrival met the practice's own definition of a visit worth having. It is the last thing the model says about a visit. |

# Example Questions

- How much of what we are counting as traffic to a `page` is robots, and which pages look different once they are taken out?
- Which of our `pages` are arrived at and left immediately, and how do their positions compare with the pages people stay and click through?
- Does traffic arriving from search behave differently on the same `pages` from traffic arriving through the sites that link to us?

## Joins

- [Page](./page.md) — `page_id = page_id` [N:1] — The page the visit landed on.
  - [Page Website](./website.md) — The site this visit landed on.
    - [Page Website robots.txt](./robots-txt.md) — The crawling rules of the site this visit landed on.
    - [Page Website sitemap.xml](./sitemap-xml.md) — The page list of the site this visit landed on.
- [Channel](./channel.md) — `channel_id = channel_id` [N:1] — How the visitor arrived.
