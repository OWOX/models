---
title: "Knowledge Gain"
description: |
  Whether a piece of content brings new knowledge into a topic — a super-important
  component of ranking. Google holds patented technology for the judgement, published
  information rather than a secret, by which it assesses how valuable a page is in
  bringing new knowledge into a context. It is kept as an object of its own rather than
  as a column on the content because there is a context, there is content other sites
  have already written on that context, and what is being measured is the difference a
  page makes to it.

  It is the brick people fail to understand when they hand content creation over to AI
  and are then surprised at how their site is doing. The term is not much circulated,
  and it stays uncirculated because it gets in the way of selling AI content generators.
  It is not a verdict on the author: content that merely retells what is already
  available carries no gain, and content built on data nobody else holds carries it
  whether or not a machine wrote the words.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `knowledge_gain_id` | STRING | Knowledge Gain ID | PK. The identifier of this assessment. |
| `context_id` | STRING | Context ID | The topic the content is being judged against — there is no such thing as a gain in the abstract. FK to [Context](./context.md) |
| `score` | FLOAT | Knowledge Gain Score | How much new knowledge this content brings into its topic, as a number. It is read against the topic, not against the content on its own. |
| `adds_new_knowledge` | BOOLEAN | Adds New Knowledge | Whether the content brings knowledge that was not already in general circulation, or only retells what other sites have written on the topic. |
| `is_expert_authored` | BOOLEAN | Is Expert Authored | Whether the author is already visible in this topic as the author of content, ideas, opinions and analysis — which gives a page a chance of ranking despite weak support from links. |
| `is_based_on_unique_data` | BOOLEAN | Is Based on Unique Data | Whether the content rests on data that was not otherwise available. Where it does, machine authorship makes no difference to how it ranks. |
| `contradicts_consensus` | BOOLEAN | Contradicts Consensus | Whether the content argues against an established consensus in its topic. Content that does is deranked even when it is right. |

# Example Questions

- In which topics does our `content` add something that was not already in general circulation, and in which are we restating what other sites have written?
- Where does what we publish rest on data only we hold, and where does it rest only on an expert's standing in the topic?
- Which of our `pages` argue against the settled view in their topic, and what did we spend producing them?

## Joins

- [Context](./context.md) — `context_id = context_id` [N:1] — The topic the gain is measured against; the same content scores differently in another.
