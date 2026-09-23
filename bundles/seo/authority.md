---
title: "Authority"
description: |
  How much standing one external site carries in one topic, on one day. A site's
  standing is a combination of the organic traffic it already has and the links pointing
  at it within a context, which is why it is measured per site *and* per topic and never
  per site alone: the same site can have standing on web hosting and none at all on
  washing machines. Two rows for the same site in two topics are not a duplicate — they
  are the point.

  Neither ingredient is invented here. The traffic is held on the
  [host](./third-party-websites.md), because it is true of the site whatever topic is
  being asked about; the links are what makes the reading topical. One exception is real
  and is kept on the host as its own flag: the broadly authoritative sites that count in
  any context.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `authority_id` | STRING | Authority ID | PK. The identifier of this reading — one site, in one topic, on one day. |
| `third_party_website_id` | STRING | Third Party Website ID | The external site whose standing is being measured. FK to [Third Party Websites](./third-party-websites.md) |
| `context_id` | STRING | Context ID | The topic the standing is measured in. The same site can hold standing in one topic and none in another. FK to [Context](./context.md) |
| `authority_score` | FLOAT | Authority Score | How much standing the site carries in this topic — a combination of the organic traffic it already has and the links pointing at it within this context. |
| `measured_on` | DATE | Measured On | The day this reading was taken. A score is comparable with another only alongside its date. |

# Example Questions

- For a topic we are trying to enter, which sites carry standing in that topic — and are they the same sites as the ones with the most traffic?
- Which of the hosts we are paying to appear on have no measured standing in the topic our placement on them sits in?
- Where has a site's standing in a topic moved between readings, and were our placements on it made before or after that?

## Joins

- [Third Party Websites](./third-party-websites.md) — `third_party_website_id = third_party_website_id` [N:1] — The site whose standing is being scored.
- [Context](./context.md) — `context_id = context_id` [N:1] — The topic it is scored in; a site can be authoritative in one and unknown in another.
