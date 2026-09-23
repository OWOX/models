---
title: "Crawl"
description: |
  One fetch of one page by one robot. A row is a single arrival, not a robot: a robot
  can fetch the same page more than once, and each fetch is its own row. Keeping the
  grain at the fetch is what lets crawling be read as behaviour over time rather than as
  a list of who is out there.

  A crawler landing on a site learns its content and its links. The internal ones lead
  it to internal pages, which it also visits — each of those visits another row here. An
  external one may send it to a page it did not know, and that page belongs to somebody
  else and has no row in this model, so the fetch names a
  [host](./third-party-websites.md) and no page.

  That is why this mart reaches the [crawl rules](./robots-txt.md) by two routes rather
  than one. A fetch of the site's own page reaches them through the page and its
  [site](./website.md); a fetch of somebody else's page has only the route through the
  [indexing request](./initiate-index.md) — one is the rules of the site whose page was
  fetched, the other the rules the run itself read.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `crawl_id` | STRING | Crawl ID | PK. The identifier of this single fetch. |
| `page_id` | STRING | Page ID | The page that was fetched, when the fetch was of this site. Empty when the crawler followed a link off it onto somebody else's page. FK to [Page](./page.md) |
| `third_party_website_id` | STRING | Third Party Website ID | The external host the robot went to, when the page fetched belonged to somebody else. FK to [Third Party Websites](./third-party-websites.md) |
| `initiate_index_id` | STRING | Indexing Request ID | The run that caused this fetch, which is how a request is tied to the pages it actually reached. FK to [Initiate Index](./initiate-index.md) |
| `crawler_user_agent` | STRING | Crawler User Agent | Who fetched the page, as it introduced itself. Anyone requesting a page on the internet is obliged to state a user agent, and usually that is more than enough to tell a robot from a person. |
| `crawled_at` | TIMESTAMP | Crawled At | When this fetch happened. |
| `was_allowed` | BOOLEAN | Was Allowed | The crawl rules verdict on this fetch: whether the robot was let into the path it asked for. |
| `links_found` | INTEGER | Links Found | How many links the crawler came away with. Internal ones lead it to pages it then visits too; external ones either credit a page it already knew or send it to crawl one it did not. |

# Example Questions

- Which crawlers are arriving on our `pages`, how often is each one turned away, and how many links does it come away with when it is let in?
- Which of our `pages` are being fetched and refused, and how many paths does the `robots.txt` behind that refusal close off?
- When a crawler follows a link off our site, which external hosts does it end up fetching, and how much of our crawling is that?

## Joins

- [Page](./page.md) — `page_id = page_id` [N:1] — The page fetched, when the fetch was of this site; empty for a third-party page.
  - [Page Website](./website.md) — The site whose page was fetched.
    - [Page Website robots.txt](./robots-txt.md) — The crawling rules of the site whose page was fetched.
    - [Page Website sitemap.xml](./sitemap-xml.md) — The page list of the site whose page was fetched.
- [Third Party Websites](./third-party-websites.md) — `third_party_website_id = third_party_website_id` [N:1] — The external site fetched, when the crawler followed a link off this one.
- [Initiate Index](./initiate-index.md) — `initiate_index_id = initiate_index_id` [N:1] — The indexing run this fetch belongs to.
  - [Initiate Index robots.txt](./robots-txt.md) — The rules this indexing run itself read before fetching.
