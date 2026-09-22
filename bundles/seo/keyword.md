---
title: "Keyword"
description: |
  A term the practice targets — the middle of the three levels this model keeps for
  demand. It is one of the main terms of the trade. A keyword is, to a considerable
  extent, a synonym of a [topic](./context.md): many keywords can be one and the same
  context, and the practice works on the topic rather than on each phrasing separately.

  The word carries two meanings in everyday use, and this model splits them. Asked
  directly whether the thing a user sees is a keyword or a search query, the answer on
  the record was: it is a search query. So the string somebody typed is a [Search
  Query](./search-query.md), and `keyword` is used here by this model's own convention
  for the term the practice targets — the entry on the practice's list, not the entry in
  somebody's search box. Holding the two apart is what makes it possible to ask which of
  the chosen terms nobody searches, and which searches a site picks up that it never
  aimed at.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `keyword_id` | STRING | Keyword ID | PK. The identifier of this term. |
| `context_id` | STRING | Context ID | The topic this term belongs to; a keyword is to a considerable extent a synonym of a context, and many keywords can be one and the same one. FK to [Context](./context.md) |
| `keyword_text` | STRING | Keyword | The term itself, as the practice writes it on its own list. |
| `is_targeted` | BOOLEAN | Is Targeted | Whether the practice is optimising for this term, as opposed to keeping it on the list to watch. |

# Example Questions

- Which of the terms we target sit in topics we already hold positions in, and which are aimed at topics we have never appeared in?
- For a topic we are working on, how many terms are we actively targeting and how many are we only watching?
- Which of our targeted terms do people actually type something matching, and which exist only on our own list?

## Joins

- [Context](./context.md) — `context_id = context_id` [N:1] — The topic this term belongs to; many keywords share one.
