---
title: "Website"
description: |
  The site being optimised — the object the whole technical side of search work is done
  to, and the boundary between what is within a practice's control and what is not.
  Content is placed on it, and its crawl rules and page list belong to it; the part of
  SEO that concerns a site's own condition ends where this record ends.

  Google sees how people behaved after arriving, and it looks at those user signals both
  per page and for the site overall, as an average — so speed, layout and the behaviour
  numbers are properties of the site rather than of any one page. A site need not be
  superfast, but it does have to be reasonably fast, and 80% of its traffic may be
  coming from phones while its layout breaks on them. The two connect: a visitor who
  opens the site on a phone and leaves at once, because the content they came for could
  not be read, earns the site a minus for user signals, and the site slides down in
  search.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `website_id` | STRING | Website ID | PK. The identifier of this site. |
| `domain` | STRING | Domain | The domain the site is published under — the name everything else in the model is claimed and measured against. |
| `robots_txt_id` | STRING | Robots File ID | The crawl-rules file published at the root of this site, which tells an arriving robot where it may go. FK to [robots.txt](./robots-txt.md) |
| `sitemap_id` | STRING | Sitemap ID | The list of its own pages this site offers for indexing. Empty when the site publishes none, which does not stop the site being crawled, as long as its robots.txt is in order. FK to [sitemap.xml](./sitemap-xml.md) |
| `page_speed_score` | FLOAT | Page Speed Score | How quickly the site loads. The bar is not superfast — it is reasonably fast. |
| `mobile_optimization_score` | FLOAT | Mobile Optimization Score | How well the layout holds up across device types, read against how much of the site's traffic arrives from phones. |
| `avg_time_on_page` | FLOAT | Average Time on Page | Time on page averaged across the site — one of the user signals Google reads for the site as a whole and not only per page. |
| `avg_depth_of_scroll` | FLOAT | Average Depth of Scroll | How far down a page visitors get, averaged across the site. |
| `bounce_rate` | FLOAT | Bounce Rate | The share of arrivals that leave straight away, whatever sent them away — being unable to read the content on a phone is one such reason. |
| `development_cost` | NUMERIC | Development Cost | What has been spent on developer work to put the site in technical order and keep it there. |

# Example Questions

- Which of our sites are slow or badly laid out on phones, and are their behaviour numbers worse than the sites that are not?
- How does a site's average time on page and depth of scroll compare with the individual `pages` it publishes — is one part of the site holding the average down?
- What have we spent on developer work per site, and which of those sites still have crawl rules that do not parse or no page list at all?

## Joins

- [robots.txt](./robots-txt.md) — `robots_txt_id = robots_txt_id` [N:1] — The file that tells crawlers where on this site they may go.
- [sitemap.xml](./sitemap-xml.md) — `sitemap_id = sitemap_id` [N:1] — The optional index of the site's pages; empty when the site publishes none.
