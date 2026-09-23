---
title: "Content"
description: |
  The text, images and video a site publishes: the first of the three pillars of search
  — what a business says about itself, and the material that gets indexed and served in
  AI answers and in Google. It is also one of the three things an SEO practice pays for,
  alongside the developer work that keeps the site in order and the placements bought on
  other people's sites, so this is where the first of those three cost lines sits.

  Reading content as a volume is the reading this model is built to prevent. What gives
  a piece of content a chance of ranking is not that it exists, and not that a person
  rather than a machine produced it, but whether it adds knowledge to its topic. Content
  that adds nothing still costs what it cost to produce; and a large body of generated
  content that does not rank demonstrably worsens a site's traffic figures, often
  looking like a collapse.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `content_id` | STRING | Content ID | PK. The identifier of this piece of content. |
| `page_id` | STRING | Page ID | The page this text, image or video sits on, and the only route from content to the site that publishes it. FK to [Page](./page.md) |
| `knowledge_gain_id` | STRING | Knowledge Gain ID | The assessment of what new knowledge this content brings into its topic. FK to [Knowledge Gain](./knowledge-gain.md) |
| `content_type` | STRING | Content Type | What kind of content it is: `text`, `image` or `video`. |
| `published_at` | TIMESTAMP | Published At | When this content went live on the page. |
| `is_ai_generated` | BOOLEAN | Is AI Generated | Whether the content was produced by AI. On its own this decides nothing: what matters is whether the content adds knowledge to its topic. |
| `production_cost` | NUMERIC | Production Cost | What it cost to create this content — one of the three things an SEO practice pays for, alongside developer work on the site and placements on other sites. |

# Example Questions

- How much have we spent producing content that adds nothing to its topic, and which topics is that money sitting in?
- Which of our `pages` are built mostly of machine-written text, and does that text rest on data only we hold?
- What have we published over the past year, by type, and are those the `pages` that earn traffic from search?

## Joins

- [Page](./page.md) — `page_id = page_id` [N:1] — The page this text, image or video sits on.
  - [Page Website](./website.md) — The site this content is published on.
    - [Page Website robots.txt](./robots-txt.md) — The crawling rules of the site this content is published on.
    - [Page Website sitemap.xml](./sitemap-xml.md) — The page list of the site this content is published on.
- [Knowledge Gain](./knowledge-gain.md) — `knowledge_gain_id = knowledge_gain_id` [N:1] — The assessment of what new knowledge this content adds.
  - [Knowledge Gain Context](./context.md) — The topic this content's gain was measured against.
