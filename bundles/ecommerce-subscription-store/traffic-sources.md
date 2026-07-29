---
title: "Traffic Sources"
description: |
  Every source, medium and campaign combination that sends traffic to the storefront, down to the
  keyword and the creative, grouped into the channels the business actually reports on and
  flagged for whether the traffic was paid. It is the vocabulary that makes marketing comparable:
  the same grouping applies to sessions, to customers and to advertising spend.

  Keeping the paid flag and the channel grouping here rather than deriving them per report is
  what stops the same channel from being named three different ways in three different places.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-28T16:51:50.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `traffic_source_id` | STRING | Traffic Source ID | PK. Unique identifier of the source, medium and campaign combination. |
| `source` | STRING | Source | Platform or site the traffic originated from. |
| `medium` | STRING | Medium | Channel type of the traffic, such as cost-per-click, organic or referral. |
| `campaign` | STRING | Campaign | Marketing campaign the traffic belongs to. |
| `keyword` | STRING | Keyword | Search term or targeting keyword that triggered the visit. |
| `ad_content` | STRING | Ad Content | Creative or ad variant the visit came from. |
| `channel_grouping` | STRING | Channel Grouping | Reporting channel the combination rolls up to, such as Paid Search, Paid Social, Organic, Email or Direct. |
| `is_paid` | BOOLEAN | Is Paid | Whether the traffic was acquired through a paid channel. |

# Example Questions

- Which channels bring in the most `sessions`, and which bring in the most recurring revenue?
- How does paid traffic compare with organic and referral on the quality of what it delivers?
- Which campaigns and keywords are worth their spend once `subscriptions`, not clicks, are the measure?
