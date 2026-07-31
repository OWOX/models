---
title: "Ad Spend"
description: |
  What the network paid to be found, at the finest grain it is billed: one row per day, channel,
  campaign, keyword, creative and country, with cost in the original currency and converted to a
  single one, alongside impressions and clicks. This is the mart to use when the question is which
  keyword or creative is consuming budget, rather than which channel — that coarser view is already
  rolled up with its outcomes in Attribution. Because healthcare acquisition costs vary enormously
  by channel, keyword-level spend is usually where a blended cost per patient turns out to be
  hiding one very expensive route and one very cheap one.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T11:02:28.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. Calendar date the spend was incurred. FK to [Attribution](./attribution.md) |
| `source` | STRING | Source | PK. Platform or network the spend went to, such as Google or Meta. FK to [Attribution](./attribution.md) |
| `medium` | STRING | Medium | PK. Advertising model used, such as `cpc`. FK to [Attribution](./attribution.md) |
| `campaign` | STRING | Campaign Name | PK. Campaign the spend belongs to. FK to [Attribution](./attribution.md) |
| `keyword` | STRING | Keyword | PK. Search term the advertising bid on. |
| `ad_content` | STRING | Ad Content | PK. Creative or ad variant the spend ran against. |
| `country` | STRING | Country | PK. Country the advertising was targeted at. |
| `cost` | FLOAT | Cost | Spend in the original billing currency. |
| `cost_normalized` | FLOAT | Normalized Cost | Spend converted to USD. Use this whenever markets are compared. |
| `impressions` | INTEGER | Impressions | Times the advertising was displayed. |
| `clicks` | INTEGER | Clicks | Times the advertising was clicked. |

# Example Questions

- Which keywords and creatives absorb the largest share of budget, and does that share match the share of enquiries they produce?
- How much of our spend goes to terms that generate clicks but no enquiries at all?
- Has cost per click drifted over the period for our highest-spend campaigns, and in which market?

## Joins

- [Attribution](./attribution.md) — `date = date`, `source = source`, `medium = medium`, `campaign = campaign`
