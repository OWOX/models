---
title: "Search Query"
description: |
  What somebody actually put into a search box. It is the finest of the three levels
  this model keeps for demand: a query is the string that was typed, a
  [keyword](./keyword.md) is — by this model's own convention — the term the practice
  targets, and a [context](./context.md) is the topic both of them sit in.

  The level is where ranking is settled: a position is a position *for a query*. In the
  practitioner's own picture of it, for a given query a site was not taking part in the
  lottery at all, and now it is in it and holding a place.

  The boundary between a query and a keyword has blurred a little. A search made by AI
  is, as a rule, not a keyword but a pile of key words — a very long string a normal
  person would never write — and those searches land in this mart next to the short ones
  a person typed.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `search_query_id` | STRING | Search Query ID | PK. The identifier of this query string. |
| `keyword_id` | STRING | Keyword ID | The term the practice targets that this typed query was matched to. FK to [Keyword](./keyword.md) |
| `query_text` | STRING | Search Query | The string that was actually searched for. |
| `is_ai_generated_query` | BOOLEAN | Is AI-Generated Query | Whether the query looks like a search made by AI rather than typed by a person: as a rule not a keyword but a pile of key words, a very long string a normal person would never write. |

# Example Questions

- Which of the strings people search for in a topic came from an AI assistant rather than from a person, and where do our `pages` sit for each kind?
- Which queries are we picking up that none of the terms on our own list was aimed at?
- Which long, sentence-shaped queries do our `pages` appear for, and are those the pages we meant to answer them?

## Joins

- [Keyword](./keyword.md) — `keyword_id = keyword_id` [N:1] — The term the practice targets that this typed query was matched to.
  - [Keyword Context](./context.md) — The topic this query sits in, reached through the term it was matched to; a query matched to none reaches nothing here.
