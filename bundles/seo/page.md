---
title: "Page"
description: |
  One page of the site being optimised: the unit that gets crawled, indexed, ranked and
  arrived at. A page is what content sits on, and the level at which what a site asks a
  search engine for — index this — can be compared with what happened to it.
  `is_in_sitemap` is a column here and not a link to the [page list](./sitemap-xml.md):
  the list is optional, and being named in it is simply true or false about a page.

  It carries its own behaviour numbers because Google reads user signals per page *and*
  for the site as a whole, as an average. A hack turns on that arithmetic: removing
  content that does not work lifts the averages of what is left, which Google reads as
  an improvement in quality. Whether a dead page should be removed, redirected or
  rewritten is not settled, and depends heavily on how spoilt Google is for content on
  that topic: where it has plenty, such pages should not be on the site at all; where it
  has little, it will show even weak ones for want of anything better. Pages kept for
  regulatory or documentation reasons can be held quite safely.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `page_id` | STRING | Page ID | PK. The identifier of this page. |
| `website_id` | STRING | Website ID | The site this page belongs to, which is what separates the pages of the site being optimised from anyone else's. FK to [Website](./website.md) |
| `url` | STRING | Page URL | Where the page is published. |
| `page_type` | STRING | Page Type | What kind of page it is: `home`, `service`, `contact`, `case_study` or `blog`. |
| `is_indexable` | BOOLEAN | Is Indexable | Whether the page is telling search engines it wants to be indexed. |
| `is_indexed` | BOOLEAN | Is Indexed | Whether the page is actually in the index. It can differ from what the page asks for. |
| `is_in_sitemap` | BOOLEAN | Is In Sitemap | Whether the site's page list names this page. The list itself is optional — a site with none is still crawled. |
| `last_crawled_at` | TIMESTAMP | Last Crawled At | When a search robot last fetched this page. |
| `avg_time_on_page` | FLOAT | Average Time on Page | How long visitors stay on this page — a user signal Google reads per page as well as averaged over the site. |
| `avg_depth_of_scroll` | FLOAT | Average Depth of Scroll | How far down this page visitors get before they stop. |
| `bounce_rate` | FLOAT | Bounce Rate | The share of visitors who arrive on this page and leave straight away. |
| `has_organic_traffic` | BOOLEAN | Has Organic Traffic | Whether the page earns any traffic from search at all. Pages that earn none are the ones a removal experiment is aimed at, and the ones that move the site's averages down. |

# Example Questions

- Which of our pages earn nothing from search, and what are they doing to the site's average time on page and depth of scroll?
- Where are we telling search engines a page should be indexed while it is not indexed — and are those the pages missing from the site's page list?
- Which pages were last crawled before the `content` on them went live, and how do their behaviour numbers compare with the pages that have been refetched since?

## Joins

- [Website](./website.md) — `website_id = website_id` [N:1] — The site this page belongs to, which is what separates the pages of the site being optimised from anyone else's.
  - [Website robots.txt](./robots-txt.md) — The crawling rules of the site this page sits on.
  - [Website sitemap.xml](./sitemap-xml.md) — The page list of the site this page sits on — whether this page itself is listed is `is_in_sitemap` here.
