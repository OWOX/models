---
title: "Traffic Sources"
description: |
  Every source, medium and campaign combination that sends traffic to the storefront, grouped
  into the channels the business actually reports on and flagged for whether the traffic was
  paid. It is the vocabulary that makes marketing comparable: the same channel grouping
  applies to sessions, to customers and to advertising spend.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-29T00:40:31.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `traffic_source_id` | INTEGER | Traffic Source ID | Unique internal identifier for a specific combination of traffic source, medium, and campaign. |
| `source` | STRING | Source | The origin of the website traffic, such as a search engine, social network, or domain. |
| `medium` | STRING | Medium | The high-level category of the traffic source, such as organic, cost-per-click, or referral. |
| `campaign` | STRING | Campaign Name | The specific marketing campaign name associated with the traffic. |
| `is_paid` | BOOLEAN | Is Paid Traffic | Indicates whether the traffic was generated through a paid marketing channel. |
| `channel_grouping` | STRING | Channel Grouping | The classification of traffic into broad categories like Paid Marketing, Direct, or Organic. |

# Example Questions

- Which channels bring in the most `sessions`, and which bring in the most revenue?
- How does paid traffic compare with organic and referral on the quality of what it delivers?
- Which campaigns are worth their spend once `orders`, not clicks, are the measure?
