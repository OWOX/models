---
title: "Backlink"
description: |
  One placement of a brand on somebody else's site: a link back to one of its pages, or
  the brand named in their text without one. Both are held here because both are the
  same piece of work — a business appears in someone else's article, in some topic, on a
  host whose standing is what decides the worth. `has_link` tells the two apart, and
  false is not a missing value: it is a brand mention, and a mention points at no page,
  so a count that reads an empty page as a defect is counting mentions as broken links.

  What decides what a placement is worth is the topic it appears in. Standing is
  topical: a host can carry it in one subject and none in another, and a placement whose
  article sits outside the subject its host carries weight in is worth quite moderately
  in Google's eyes. The [broadly authoritative sites](./third-party-websites.md) are the
  exception: a piece on Forbes mentioning a brand counts heavily in its favour in any
  context.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `backlink_id` | STRING | Backlink ID | PK. The identifier of this placement, whether it carries a link or is a mention without one. |
| `page_id` | STRING | Page ID | The page on this site the link points at. Empty when `has_link` is false — a mention points at no page. FK to [Page](./page.md) |
| `third_party_website_id` | STRING | Third Party Website ID | The external site the placement sits on. FK to [Third Party Websites](./third-party-websites.md) |
| `context_id` | STRING | Context ID | The topic the placement appears in, which is what decides what it is worth. FK to [Context](./context.md) |
| `has_link` | BOOLEAN | Has Link | Whether the placement carries a link back to this site. False is a brand mention: the brand named in the text, not linked — the signal AI search responds to. |
| `placed_on` | DATE | Placed On | When the placement went live on the other site. |
| `is_permanent` | BOOLEAN | Is Permanent | Whether it was bought as a permanent placement — the trade's own word for one that lives on the site permanently, rather than a subscription. |
| `min_placement_months` | INTEGER | Minimum Placement Months | How long the placement is expected to stay up at the least. Twelve months is the threshold usually expected. |
| `placement_cost` | NUMERIC | Placement Cost | What was paid to the owner of the site for carrying the placement. |
| `content_cost` | NUMERIC | Content Cost | What it cost to produce the article that carries the placement — the second half of the price, paid to whoever wrote it rather than to the site. |

# Example Questions

- What has a topic's off-site work actually cost us, once the articles we had to produce are counted alongside what we paid the sites?
- How much of what the web says about us in a topic carries a link, and how much of it is our brand named with no link at all?
- Which of our placements sit on sites with standing in the topic they appear in, and which sit on sites that are simply large?

## Joins

- [Page](./page.md) — `page_id = page_id` [N:1] — The page the link points at; empty when the placement is a mention with no link.
  - [Page Website](./website.md) — The site of yours the placement's link points into.
    - [Page Website robots.txt](./robots-txt.md) — The crawling rules of the site the link points into.
    - [Page Website sitemap.xml](./sitemap-xml.md) — The page list of the site the link points into.
- [Third Party Websites](./third-party-websites.md) — `third_party_website_id = third_party_website_id` [N:1] — The site the placement sits on.
- [Context](./context.md) — `context_id = context_id` [N:1] — The topic the placement appears in, which is what decides whether it counts.
