---
title: "GA 360 Standard Data Model"
description: |
  A ready-made reporting layer over the Google Analytics 360 export to BigQuery. It turns
  the daily `ga_sessions_*` tables into ten analytics-ready tables: sessions, page views,
  events and purchases, plus the locations, devices, traffic sources, users, pages and
  event details they point at by hash. Two staging tables sit between the export and most
  tables: `_temp_objects` feeds page views, events, pages and event details, and
  `_temp_transactions` feeds purchases, on Transactions and on Sessions.

  The SQL that builds the tables is part of the model, in
  [references/sql-transformation](./references/sql-transformation/index.md), with a runbook
  for the first load and the daily run. It is written for the
  [OWOX Transformations plugin](https://github.com/OWOX/transformations-plugin) in the
  BigQuery (GoogleSQL) dialect, and you can adapt it to your needs.

  Sessions are the hub, one row per session of the export. Page views, events and
  purchases join them on `date` and `sessionId` together. **The dimension tables carry no
  date**: each run appends the same hashes again, so deduplicate them before joining in
  your own SQL. **Revenue is in millionths**, as Google's export stores it: divide by
  1,000,000.
tags: ["owox", "index", "ga360"]
type: "index"
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Devices](./devices.md) | 6 | The device a session ran on: category, browser and its version, operating system and its version, one row per combination, as the GA 360 export records them. |
| [Event Info](./event-info.md) | 4 | The category, action and label behind event hits, one row per combination, as the site sent them. |
| [Events](./events.md) | 6 | Every event hit of the GA 360 export, one row each, tied to the session it fell in. |
| [Geo](./geo.md) | 4 | Where a session came from: country, region and city, one row per combination, as the GA 360 export records them. |
| [Pages](./pages.md) | 4 | The pages behind page views: host name, path and title, one row per combination. |
| [Pageviews](./pageviews.md) | 6 | Every page view hit of the GA 360 export, one row each, tied to the session it fell in. |
| [Sessions](./sessions.md) | 22 | One row per session of the GA 360 export, with its landing page, engagement, purchases and the keys to its location, device, traffic source and user. |
| [Traffic Sources](./traffic-sources.md) | 6 | The source, medium, campaign, keyword and ad content Google Analytics attributed a session to, one row per combination. |
| [Transactions](./transactions.md) | 6 | One row per purchase, deduplicated by transaction ID: when the export records the same ID more than once within the deduplication window (7 days in the runbook's setup), only the earliest is kept, so there is at most one row per ID per deduplication window. |
| [Users](./users.md) | 7 | The visitors behind sessions, one row per client ID: the identifier Google Analytics gives a browser, not a person. |

**SQL Transformation:** [the SQL that builds these tables, and how to run it](./references/sql-transformation/index.md)

# Example Questions

- Which sources and campaigns bring the `sessions` that end in a purchase?
- Which landing pages bring the most purchase revenue on mobile?
- Which `pages` do visitors from each country view most?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/ga360-standard)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![GA 360 Standard Data Model diagram](../res/screens/ga360-standard.svg)
