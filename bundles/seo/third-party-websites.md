---
title: "Third Party Websites"
description: |
  The sites a practice does not own: the hosts that link to it, mention it, or could.
  Off-site work is the third pillar of search — what the rest of the web says about a
  business.

  It deliberately carries no single standing for the site: standing combines the organic
  traffic a host already has with the links pointing at it within a topic, so it is
  measured per site *and* per topic and kept on [its own object](./authority.md). What
  lives here is what is true of the host whatever the topic — its traffic, and whether
  it is one of the broadly authoritative sites, Forbes and Wikipedia, where being
  mentioned in any context counts heavily in a site's favour.

  Two things have made this work much more complicated than it used to be. Buying links
  by the hundred used to be the whole game, and that is no longer how it works;
  reputation and topical relevance are what count now. And AI does not crawl sites, at
  least not yet: what it responds to is a brand being mentioned in a context, and,
  judging by indirect signals, the reputation of the source matters a great deal.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `third_party_website_id` | STRING | Third Party Website ID | PK. The identifier of this external host. |
| `domain` | STRING | Domain | The host itself, as it appears on the placements that sit on it. |
| `organic_traffic` | INTEGER | Organic Traffic | The search traffic the host already receives — one of the two ingredients behind its standing, the other being the links it holds within a topic. |
| `is_general_authority` | BOOLEAN | Is General Authority | Whether this is one of the broadly authoritative hosts that count in any context, rather than in one topic. |

# Example Questions

- Which hosts is our off-site work concentrated on, and how much of it sits on a handful of them?
- When we place in a topic, are we buying from hosts that carry standing in that topic, or only from hosts that are large?
- How much of what the web says about us sits on generally authoritative sites, and how much on topic-specific ones?
