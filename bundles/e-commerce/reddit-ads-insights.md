---
type: "OWOX Data Mart"
title: "🥉Reddit Ads | Insights"
description: "OWOX data mart '🥉Reddit Ads | Insights'."
tags: ["owox"]
timestamp: 2026-05-19T15:45:40.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_id` | STRING | PK. The ID of the ad. |
| `date` | DATE | PK. The date for this metric. |
| `clicks` | INTEGER | The number of clicks detected for this report period. |
| `cpc` | FLOAT | The cost-per-click for this period. |
| `post_id` | STRING | The unique identifier of the post. |
| `spend` | INTEGER | The amount (in microcurrency) spent for this report period. |
| `impressions` | INTEGER | The number of impressions served for this report period. |
| `hour` | STRING | The hour for this metric in ISO-8601. |
| `engaged_click` | INTEGER | The number of engaged clicks such as RSVPs. |
| `ecpm` | FLOAT | The effective CPM for this period. |
| `cpv` | FLOAT | [Broken] The cost-per-view for this period. |
| `ctr` | FLOAT | The click-through-rate for this period. |
| `reach` | INTEGER | The number of unique users who saw the ad. |
| `frequency` | FLOAT | The average number of times each user saw the ad. |
| `currency` | STRING | The currency of the account. |
