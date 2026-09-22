---
title: "Search Performance"
description: |
  Where one page stood for one query on one day, and what that standing earned. A page
  can hold quite different positions for two queries on the same day, so the key is all
  three.

  The distinction this model turns on lives here: a position is not traffic. Coming from
  nowhere into the top 20 is a very noticeable result, and there is no traffic yet.
  Getting from the top 20 into the top five is another three or four months of work: 90%
  of traffic is concentrated in Google's first five lines, because people do not scroll
  down when the first five answer them. Searches made by AI land here beside the ones
  people typed, and a position averaged over both puts the two kinds into one figure.

  Because every row is dated, the two clocks of SEO can be told apart here. Work done
  fundamentally — strong content, good links, and no competitor whose own work starts
  pushing a site off the top places — can stay stable for as much as five years. A hack
  can be closed off by an algorithm update, after which it stops giving what it was
  giving.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day these figures were measured for, which is what makes a position readable as movement rather than as a single snapshot. |
| `search_query_id` | STRING | Search Query ID | PK. The query this row's impressions and position were measured for. FK to [Search Query](./search-query.md) |
| `page_id` | STRING | Page ID | PK. The page that appeared in the results for that query. FK to [Page](./page.md) |
| `impressions` | INTEGER | Impressions | How many times the page was shown in the results for this query on this day. |
| `clicks` | INTEGER | Clicks | How many times someone went from the results to the page. |
| `ctr` | FLOAT | Click-Through Rate | The share of impressions that became clicks. |
| `avg_position` | FLOAT | Average Position | Where the page stood in the results that day, averaged over its impressions. It is not traffic: a page in the top 20 has a real result and no visits yet, while 90% of traffic sits in the first five lines. |

# Example Questions

- Which `queries` did we move from nowhere into the top 20, and which of those have gone on into the first five lines?
- Where are we collecting impressions in quantity and almost no clicks — which `pages` are sitting below the first five for `queries` that get plenty of impressions?
- Which of our positions have held for years, and which fell away across many `queries` at once around a single date?

## Joins

- [Search Query](./search-query.md) — `search_query_id = search_query_id` [N:1] — The query this row's impressions and position were measured for.
  - [Search Query Keyword](./keyword.md) — The term the practice targets behind this measured query.
    - [Search Query Keyword Context](./context.md) — The topic this measured query belongs to.
- [Page](./page.md) — `page_id = page_id` [N:1] — The page that appeared in the results for it.
  - [Page Website](./website.md) — The site whose page held this position.
    - [Page Website robots.txt](./robots-txt.md) — The crawling rules of the site whose page held this position.
    - [Page Website sitemap.xml](./sitemap-xml.md) — The page list of the site whose page held this position.
