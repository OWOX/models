---
type: "OWOX Data Mart"
title: "🥈 Unified Ad Spend (E-Commerce)"
description: "This dataset provides a consolidated view of daily advertising expenditures and performance metrics across multiple marketing platforms. It allows users to analyze spend, clicks, and impressions at the campaign level to evaluate cross-channel marketing efficiency."
tags: ["owox"]
timestamp: 2026-07-23T07:00:35.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | The calendar date when the advertising activity occurred. |
| `source` | STRING | The name of the advertising platform or network where the traffic originated. |
| `medium` | STRING | The marketing channel or payment model used, such as cost-per-click. |
| `campaign` | STRING | The specific marketing campaign name associated with the ad spend. |
| `spend` | FLOAT | The total cost of advertising incurred during the specified period. |
| `clicks` | INTEGER | The total number of times users clicked on the advertisements. |
| `impressions` | INTEGER | The total number of times the advertisements were displayed to users. |
