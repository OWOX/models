---
title: "sitemap.xml"
description: |
  The structured list of its own pages a site hands to search engines for indexing. It
  is the site saying, in one place, what it consists of — which is help a crawler can
  use, but not help it depends on: removing the sitemap does not worsen a site's results
  in search, as long as everything else is in order.

  A site may publish none at all, and the absence is a legitimate state rather than a
  gap in the data, which is why the list is held separately rather than folded into the
  site record. Where a sitemap does exist, the number it carries is a claim about what
  the site contains, and a claim that has drifted away from the pages actually published
  is worth knowing about. Publishing [content](./content.md) and telling search engines
  about it are two separate acts, and the gap between them is visible here.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `sitemap_id` | STRING | Sitemap ID | PK. The identifier of this page list. |
| `url` | STRING | Sitemap URL | Where the list is published for search engines to fetch. |
| `listed_page_count` | INTEGER | Listed Pages | How many pages the list offers for indexing — the site's own claim about what it consists of, to be read against the pages it actually publishes. |
| `last_submitted_at` | TIMESTAMP | Last Submitted At | When the list was last handed to search engines, which is a separate act from publishing the pages in it. |

# Example Questions

- How many `pages` does each site offer for indexing, and how does that compare with the pages it actually publishes?
- Which sites have not resubmitted their list since the last round of `content` went live?
- Are the `pages` left out of the list the same pages that are going uncrawled, or is the list beside the point on this site?
