---
type: "OWOX Data Mart"
title: "Ad Spend"
description: |
  Daily cost, impressions and clicks for every paid campaign, broken out by ad group. This is
  the cost side of the funnel — the numbers a demand-gen team reconciles against Google Ads,
  LinkedIn Ads and other platform reports every week to know what a click, a lead and ultimately
  a closed deal actually costs.
tags: ["owox"]
timestamp: 2026-07-23T17:34:31.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `spend_id` | STRING | PK. Unique identifier for each spend record. |
| `spend_date` | DATE | Day the spend was incurred. Within the campaign's `[start_date, end_date]` flight. |
| `campaign_id` | STRING | Campaign this spend belongs to. FK to [Campaign](./campaign.md) |
| `channel` | STRING | Marketing channel where the cost was spent. Denormalized copy of the campaign's `channel`. |
| `ad_group` | STRING | Ad group or ad set within the campaign. |
| `impressions` | INTEGER | Number of times ads were shown. |
| `clicks` | INTEGER | Number of clicks the ads received. Always `≤ impressions`; CTR by channel. |
| `cost` | NUMERIC | Money spent on this ad group for the day (USD). Derived from clicks × per-channel CPC. |

# Example Questions

- What is the blended and per-channel CPC and CTR, and how do they trend week over week?
- Which campaigns or ad groups are burning budget without matching traffic or click performance?
- How does cost per lead and cost per opportunity compare across channels once spend is joined to downstream conversions?

## Joins

- [Campaign](./campaign.md) — `campaign_id = campaign_id`
