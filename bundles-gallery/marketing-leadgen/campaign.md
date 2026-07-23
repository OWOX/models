---
type: "OWOX Data Mart"
title: "Campaign"
description: |
  Reference of every marketing initiative run — paid and non-paid alike, from search and social
  ads to email nurtures, webinars and content syndication — each carrying its channel, its
  objective and the UTM tags that tie it back to ad-platform and web-analytics data. This is the
  conformed campaign dimension of the model: every channel value that shows up on ad spend, web
  sessions, touchpoints or opportunities agrees with what is declared here, so a channel-level
  report never splits into phantom categories.
tags: ["owox"]
timestamp: 2026-07-23T17:34:31.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `campaign_id` | STRING | PK. Unique identifier for each campaign. |
| `campaign_name` | STRING | Human-readable name of the campaign. |
| `channel` | STRING | Marketing channel. Controlled vocabulary: `paid_search`, `paid_social`, `display`, `organic_search`, `email`, `webinar`, `content_syndication`, `direct`, `referral`. |
| `objective` | STRING | Primary goal. One of: `awareness`, `lead_generation`, `conversion`, `retargeting`. |
| `utm_source` | STRING | UTM source tag identifying where the traffic originates. |
| `utm_medium` | STRING | UTM medium tag describing the type of traffic (e.g. cpc, email). |
| `utm_campaign` | STRING | UTM campaign tag — the key ad-platform ↔ web-analytics join key. |
| `start_date` | DATE | Date the campaign went live. |
| `end_date` | DATE | Date the campaign flight ended (nullable for always-on). Spend/touches fall within `[start_date, end_date]`. |

# Example Questions

- How many campaigns are running per channel and objective, and how does that mix shift over time?
- Which campaigns are actively in-flight versus always-on programs like nurture or content syndication?
- How does spend, traffic and pipeline performance compare across campaigns that share the same objective (e.g. all lead-generation campaigns)?
