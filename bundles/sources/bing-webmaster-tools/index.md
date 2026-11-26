---
title: "Bing Webmaster Tools"
description: |
  What the OWOX Data Marts Bing Webmaster Tools connector loads for one site verified in Bing Webmaster Tools, and how the tables fit together.
  Bing's search performance comes in two grains. [Site Daily](./site-daily.md) is the whole site per day, every Bing vertical together.
  [Query Stats](./query-stats.md) and [Page Stats](./page-stats.md) are weekly and list only Bing's top queries and top pages for each week,
  and [Page Query Stats](./page-query-stats.md) gives the queries of each top page by week. A query or page with no row was not in that week's top list:
  it does not mean zero impressions, so the weekly tables never add up to Site Daily.

  The API takes no date range. Every call returns Bing's whole window, about 16 months, so each run re-reads it and updates rows by key,
  and weeks that leave Bing's window stay in the tables. `date` is the parsed UTC day; `date_raw` keeps Bing's `/Date(epoch ms)/` string
  and is part of every primary key, so the weekly tables join on it. Copilot citations (Bing's AI Performance report) are not in the API.

  Definitions follow the connector manifest Bing Webmaster Tools v1.0 on the Bing Webmaster JSON API.
tags: ["owox", "index", "connector", "bing-webmaster-tools"]
type: "index"
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Page Query Stats](./page-query-stats.md) | 8 | The queries of each top page by week, from GetPageQueryStats: impressions, clicks and average positions per page and query. |
| [Page Stats](./page-stats.md) | 7 | Bing's top pages of the site by week, from GetPageStats: impressions, clicks and average positions per page URL. |
| [Query Stats](./query-stats.md) | 7 | Bing's top search queries for the site by week, from GetQueryStats: impressions, clicks and average positions. |
| [Site Daily](./site-daily.md) | 4 | Daily clicks and impressions of the whole site in Bing, across every Bing vertical, from GetRankAndTrafficStats. |

# Example Questions

- Which pages gained or lost the most Bing clicks week over week, and which of their queries moved?
- Which queries bring impressions but almost no clicks, and on which pages does Bing show them?
- How do Bing's daily site clicks and impressions trend over the last 16 months?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/bing-webmaster-tools)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->
