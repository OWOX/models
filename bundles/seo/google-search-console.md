---
title: "Google Search Console"
description: |
  The property registered with Google: Google's own facility where a site is entered
  directly, as a claim of ownership and a request that it be crawled — and Google goes
  and crawls it. It is the one place in this model where a site is declared to a search
  engine instead of being discovered by one, which is why it is held as an object of its
  own rather than as a flag on the site.

  It carries no numbers. Impressions, clicks and positions are read *through* this
  property and are kept in [Search Performance](./search-performance.md); what lives
  here is the registration itself — which site, whether the claim was confirmed, and
  when. Search Console is also where searching done by AI is fairly visible, as very
  long queries a normal person would never write.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `property_id` | STRING | Property ID | PK. The identifier of this registered property. |
| `website_id` | STRING | Website ID | The site this property was registered for. FK to [Website](./website.md) |
| `property_url` | STRING | Property URL | The address the property covers, as it was entered when the site was registered. |
| `is_verified` | BOOLEAN | Is Verified | Whether ownership of the site has been confirmed, which is what makes the property a claim rather than an entry. |
| `verified_at` | TIMESTAMP | Verified At | When ownership was confirmed, so a change in crawling or in search numbers can be lined up against the moment the site was declared. |

# Example Questions

- Which of our sites have a verified property, and which are left to be found on their own?
- How long after a site was put into technical order was its property verified, and did its `pages` start being crawled before or after that?
- Are we reading search numbers for every site we run, or only for the ones whose property someone got round to verifying?

## Joins

- [Website](./website.md) — `website_id = website_id` [N:1] — The site this property was verified for.
  - [Website robots.txt](./robots-txt.md) — The crawling rules of the site this property was verified for.
  - [Website sitemap.xml](./sitemap-xml.md) — The page list of the site this property was verified for.
