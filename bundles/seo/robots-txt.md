---
title: "robots.txt"
description: |
  The file a site publishes to tell arriving search robots where they may go and where
  they may not, and which of them the owner wants indexed at all. It is its own object
  rather than a field on the site because it decides what everything downstream is even
  allowed to see.

  A site that publishes no sitemap is still crawled, as long as its robots.txt is in
  order. A path closed here is a path the crawler does not fetch, whatever the page
  behind it says about wanting to be indexed — which is why the rules and the pages are
  worth reading together rather than separately. The count of closed paths says nothing
  on its own about whether the closures are right: a site that deliberately keeps part
  of itself out of the index has a high count and a sound setup, and a site that has
  closed a content directory by mistake looks identical from here.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `robots_txt_id` | STRING | Robots File ID | PK. The identifier of this crawl-rules file. |
| `url` | STRING | File URL | Where the file is published, at the root of the site it governs. |
| `is_valid` | BOOLEAN | Is Valid | Whether the file parses as valid crawl rules. When it does not, an arriving crawler is left without the instructions it came for. |
| `disallowed_path_count` | INTEGER | Disallowed Paths | How many paths the file closes to crawlers. Read against what the pages behind them are meant to do, not on its own. |
| `last_modified_at` | TIMESTAMP | Last Modified At | When the rules last changed, so a shift in crawl behaviour can be lined up against a change in what the crawler was told. |

# Example Questions

- For each of our sites, is the file valid, and how much of the site is it holding back from crawlers?
- Which sites changed their crawl rules recently, and did the `pages` behind those rules stop being fetched afterwards?
- Where are we disallowing paths that hold `pages` we are still expecting to see in search results?
