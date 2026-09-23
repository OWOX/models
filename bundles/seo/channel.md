---
title: "Channel"
description: |
  How a visitor arrived, as an analytics tool classifies it: organic search, a referral
  from another site, direct entry, or an AI assistant. In Google's own terms a visit
  from search is the channel `organic` with the source `google`: the channel says what
  kind of arrival it was, the source says who sent it.

  Search work moves more than one of these at once, which is why the classification is
  kept as its own object rather than as a label on the visit. A placement on a good site
  is read by search engines as a citation, and people follow it: those arrivals are
  `referral`, while the ranking the same placement supports produces `organic` ones. The
  same piece of work arrives under two labels, and a practice reading only their sum
  cannot separate the two effects.
tags: ["owox", "view"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `channel_id` | STRING | Channel ID | PK. The identifier of this way of arriving. |
| `channel_group` | STRING | Channel Group | The kind of arrival: `organic`, `referral`, `direct` or `ai`. |
| `source` | STRING | Source | Who sent the visitor — `google` for organic search from Google, the domain for a referral. |

# Example Questions

- How much of the traffic reaching a `page` arrives through search, and how much through the sites that link to it?
- Which `pages` are entered directly, without any referrer at all, and does that change after a brand is mentioned somewhere prominent?
- Is the traffic an AI assistant sends behaving like search traffic on the same `pages`, or differently?
