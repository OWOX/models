---
title: "GA4 Standard Data Model"
description: |
  A ready-made reporting layer over the Google Analytics 4 export to BigQuery. It turns the
  raw `events_*` tables into ten analytics-ready tables: sessions, events, page views and
  purchases, plus the traffic sources, devices, locations and users they point at by hash.
  Every table is built from a staging table of sessions, and sessions are cut at the day
  boundary.

  The SQL that builds the tables is part of the model, in
  [references/sql-transformation](./references/sql-transformation/index.md), with a runbook
  for the first load and the daily run. It is written for the
  [OWOX Transformations plugin](https://github.com/OWOX/transformations-plugin) in the
  BigQuery (GoogleSQL) dialect, and you can adapt it to your needs.

  Sessions are the hub. Events, page views and purchases join them on `date` and the session
  key together, because the session number restarts every day. **A session row is often a
  fragment of a GA4 session**: the model breaks a visit after 30 idle minutes in the
  runbook's setup, at midnight, and on every event that carries a source, medium or gclid.
  So Sessions can hold several times more rows than GA4 counts sessions; on Google's sample,
  about six times. Count sessions with the sum of the `sessions` field, which tracks GA4's
  count closely, and do not compare a bounce rate built per row with GA4's. And **the
  dimension tables carry no date**: each run appends the same hashes again, so deduplicate
  them before joining in your own SQL.
tags: ["owox", "index", "ga4"]
type: "index"
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Devices](./devices.md) | 6 | The device a session ran on: category, operating system and its version, browser and its version, one row per combination. |
| [Event Traffic Sources](./event-traffic-sources.md) | 6 | The traffic source GA4 records on a single event or page view, from its `source`, `medium`, `campaign`, `term` and `content` parameters: UTM tags, or GA4's own attribution such as `organic` or `referral`. |
| [Events](./events.md) | 7 | Every GA4 event other than a page view, one row each, tied to the session it fell in. |
| [Geo](./geo.md) | 4 | Where a session came from, as GA4 resolves it from the visitor's IP address: country, region and city, one row per combination. |
| [Pageviews](./pageviews.md) | 7 | Every GA4 `page_view` event, one row each, tied to the session it fell in. |
| [Sessions](./sessions.md) | 25 | One row per session as this model cuts it, with its landing page, engagement, purchases and keys to its source, device, location and user. |
| [Traffic Sources](./traffic-sources.md) | 6 | The source, medium, campaign, keyword and ad content a session is attributed to, one row per combination. |
| [Transactions](./transactions.md) | 6 | One row per purchase, deduplicated by its transaction ID: when GA4 records the same order more than once within the deduplication window (7 days in the runbook's setup), only the first is kept. |
| [User Traffic Sources](./user-traffic-sources.md) | 4 | How each user was first acquired: the source, medium and campaign GA4 records for the user's first visit, not for any later session. |
| [Users](./users.md) | 7 | The visitors behind sessions, one row per GA4 pseudo user ID: the identifier GA4 gives a browser or app instance, not a person. |

**SQL Transformation:** [the SQL that builds these tables, and how to run it](./references/sql-transformation/index.md)

# Example Questions

- Which sources and campaigns bring the `sessions` that end in a purchase?
- How does revenue per `session` differ between mobile and desktop, by country?
- On which visit do `users` make their first purchase?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/ga4-standard)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![GA4 Standard Data Model diagram](../res/screens/ga4-standard.svg)
