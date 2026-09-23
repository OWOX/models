---
title: "Context"
description: |
  The topic a search belongs to — the subject someone is asking about, rather than the
  words they used to ask. Many different queries and many different keywords can be the
  same context: "web analytics for websites", "visit analytics for e-commerce" and "how
  do I find out where my customers came from" are all one topic, and a practice works on
  the topic rather than on the phrasings one at a time.

  It is a mart of its own, with almost nothing on it, because it is what the rest of the
  model is judged against. Authority is contextual — standing is topical, and a site can
  carry it in one subject and none in another — and whether a page adds new knowledge is
  measured against a topic. Leaving the context out is what an entry-level practitioner
  does: calling a site authoritative because it is large and gets traffic, and buying a
  placement on it whose value in Google's eyes turns out to be quite moderate. The more
  often a site is cited within a context, the better its chance of coming up, and coming
  up high, for it.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `context_id` | STRING | Context ID | PK. The identifier of this topic. |
| `topic` | STRING | Topic | The subject itself, in the practice's own words — the thing a set of queries, a set of keywords and a body of content are all about. |

# Example Questions

- Which topics do we already hold positions in, and which are we buying placements in without ranking yet?
- For a topic we want to enter, which `third-party sites` carry standing in that topic rather than standing in general?
- How many distinct `queries` collapse into one topic for us, and are we treating that topic as one job or as several?
