---
title: "Initiate Index"
description: |
  The moment a site or one of its pages enters the queue to be indexed. The name is the
  one coined on the call this model was drawn from rather than a phrase used elsewhere
  in the trade.

  A run arrives here by one of three routes. A site can be entered into Google's [Search
  Console](./google-search-console.md) directly, as a claim of ownership and a request
  that it be crawled. A [sitemap](./sitemap-xml.md) can offer the structured list of
  pages to be indexed. Or a crawler already working somewhere else can find a link to a
  page it did not know, and go and crawl that page. The sitemap route is optional: a
  sitemap helps, but if there is none, Google will crawl the site anyway, as long as the
  robots.txt is in order.

  The date here is when the asking happened, not when a robot turned up, and the gap to
  the [fetches](./crawl.md) that followed is what shows how long a site waited.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `initiate_index_id` | STRING | Indexing Request ID | PK. The identifier of this run. |
| `robots_txt_id` | STRING | Robots File ID | The crawl rules the arriving crawler reads on the way in, whichever route asked for the run. FK to [robots.txt](./robots-txt.md) |
| `requested_at` | TIMESTAMP | Requested At | When the site or page was put into the queue, which is not when a robot arrived. |
| `trigger` | STRING | Trigger | Which route started the run: `search_console` for a request made directly in the registered property, `sitemap` for the page list being offered, `external_link` for a crawler that met a link to a page it did not know. |

# Example Questions

- Which of our sites do we have to ask to be crawled, and which are found on their own through a link somebody else published?
- How long after a request went in did a robot actually arrive, and did it get past the crawl rules when it did?
- Are the runs that arrive through a `sitemap` reading rules that were valid at the time, or are we asking for `crawls` of sites whose `robots.txt` does not parse?

## Joins

- [robots.txt](./robots-txt.md) — `robots_txt_id = robots_txt_id` [N:1] — The rules the run read before fetching anything.
