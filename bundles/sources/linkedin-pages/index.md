---
title: "LinkedIn Pages"
description: |
  What the OWOX Data Marts LinkedIn Pages connector loads about the followers of a LinkedIn organization page, in two tables built from the same follower statistics API. Follower Statistics is a lifetime snapshot of followers split into segments (seniority, industry, function, company size, country, region and association type). Time-Bound Follower Statistics counts the followers gained in each day, split into organic and paid.

  Both tables carry the page's `organization_urn`, but neither is unique on it, so they are not joined: joining on the page alone would multiply rows. Combine them in a query by choosing the one you need, a snapshot to describe the audience or the time-bound table to chart its growth.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`d5df95935`](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339), on LinkedIn Community Management API 202607.
tags: ["owox", "index", "connector", "linkedin-pages"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInPages"
    title: "OWOX Data Marts — LinkedIn Pages connector source"
    last_modified: 2026-05-21
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Ievgen Krasovytskyi](https://github.com/ikrasovytskyi)

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Follower Statistics](./follower-statistics.md) | 6 | 2026-05-21 | The page's lifetime followers, split by one segment at a time. |
| [Time-Bound Follower Statistics](./time-bound-follower-statistics.md) | 12 | 2026-05-21 | Followers gained in each time range: `time_range_start` and `time_range_end`, `organic_follower_gain` and `paid_follower_gain`, one row per page and range. |

# Example Questions

- Which seniority levels, industries and countries do the page's followers come from?
- How many followers does the page gain per week, organic and paid?
- How does the follower mix change over time as the page grows?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/linkedin-pages)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->
