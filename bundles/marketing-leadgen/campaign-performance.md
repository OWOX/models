---
title: "Campaign Performance"
description: |
  One row per [campaign](./campaign.md) per day, putting what the campaign cost next to what it
  produced: ad spend, impressions and clicks from [Ad Spend](./ad-spend.md), leads created from
  [Touchpoints](./touchpoints.md), and opportunities, pipeline and closed-won revenue from
  [Opportunities](./opportunities.md). A row exists for every day the campaign spent money or
  produced a lead, an opportunity or a won deal, so leads from organic campaigns and from days
  with no spend are all here. This is the mart for cost per lead, cost per opportunity and
  pipeline per dollar of spend — one number at any date grain, campaign or channel. Each result
  is counted on its own day: spend on the day it was spent, a lead on the day it was created, an
  opportunity on the day it opened, revenue on the day the deal closed.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T10:17:02.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `campaign_id` | STRING | Campaign ID | PK. Composite key together with `activity_date`. Campaign these daily totals belong to. FK to [Campaign](./campaign.md) |
| `activity_date` | DATE | Activity Date | PK. Composite key together with `campaign_id`. Day the spend, leads, opportunities or won deals on this row happened. |
| `channel` | STRING | Channel | Marketing channel of the campaign, copied from [Campaign](./campaign.md)`.channel`. Only `paid_search`, `paid_social` and `display` carry spend. |
| `cost` | NUMERIC | Cost | Ad spend on the campaign that day (USD), summed over its ad groups; 0 on days with no spend and for campaigns that never buy ads. |
| `impressions` | INTEGER | Impressions | Ad impressions the campaign bought that day; 0 without spend. |
| `clicks` | INTEGER | Clicks | Ad clicks the campaign received that day; 0 without spend. |
| `leads_created` | INTEGER | Leads Created | Leads the campaign created that day, counted on the lead's creation date. Each lead counts once, under the campaign of its lead-creating touch. |
| `opportunities_created` | INTEGER | Opportunities Created | Sales opportunities opened that day with this campaign as their primary campaign source. |
| `pipeline_amount` | NUMERIC | Pipeline Created | Deal amount (USD) of the opportunities opened that day, whatever their outcome. |
| `deals_won` | INTEGER | Deals Won | Opportunities from this campaign won that day, counted on their close date. |
| `won_revenue` | NUMERIC | Closed-Won Revenue | Deal amount (USD) of the opportunities from this campaign won that day, counted on their close date. |

## Calculated fields

### `cost_per_lead` · FLOAT · Metric

- **Alias:** Cost per Lead

Ad spend per lead created, USD: summed cost over summed leads, right at any date grain, campaign or channel. A lead counts on the day it was created. Only paid search, paid social and display carry spend, so an organic channel reads $0 and display, with no leads, reads empty; across all channels it divides paid spend by every lead — filter to the paid channels for a paid cost per lead.

```sql
SAFE_DIVIDE(SUM(cost), SUM(leads_created))
```

### `cost_per_opportunity` · FLOAT · Metric

- **Alias:** Cost per Opportunity

Ad spend per opportunity opened, USD: summed cost over summed opportunities, right at any date grain, campaign or channel. An opportunity counts on the day it opened, under its primary campaign source. Organic channels carry no spend and read $0; across all channels it divides paid spend by every opportunity, organic-sourced included.

```sql
SAFE_DIVIDE(SUM(cost), SUM(opportunities_created))
```

### `pipeline_per_dollar` · FLOAT · Metric

- **Alias:** Pipeline per $ of Spend

Pipeline created per $1 of ad spend: summed deal amount of opportunities opened over summed cost. Pipeline counts on the day the opportunity opened, whatever its outcome. Organic channels have pipeline but no spend and read empty; across all channels it credits organic pipeline to paid spend.

```sql
SAFE_DIVIDE(SUM(pipeline_amount), SUM(cost))
```

# Example Questions

- What did a `lead` and an `opportunity` cost on each paid channel last quarter, and how did that move month by month?
- Which paid `campaigns` bring in the most pipeline for every dollar they spend?
- On which days and `campaigns` does spend keep running without producing a single `lead`?

## Joins

- [Campaign](./campaign.md) — `campaign_id = campaign_id` [N:1] — The campaign these daily totals belong to.
