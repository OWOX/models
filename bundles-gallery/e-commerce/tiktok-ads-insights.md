---
type: "OWOX Data Mart"
title: "TikTok Ads Insights"
description: "TikTok Ad Insights with ad-level granularity."
tags: ["owox"]
timestamp: 2026-05-26T20:09:01.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_id` | STRING | PK. Ad ID |
| `stat_time_day` | DATE | PK. Statistics Date |
| `campaign_id` | STRING | Campaign ID |
| `adgroup_id` | STRING | Ad Group ID |
| `date_start` | DATE | Start Date |
| `date_end` | DATE | End Date |
| `clicks` | INTEGER | Clicks |
| `impressions` | INTEGER | Impressions |
| `cost` | FLOAT | Cost |
| `ctr` | FLOAT | Click-Through Rate |
| `conversion` | INTEGER | Conversions |
| `cost_per_conversion` | FLOAT | Cost Per Conversion |
| `conversion_rate` | FLOAT | Conversion Rate |
| `reach` | INTEGER | Reach |
| `engagement` | INTEGER | Engagement |
| `video_views` | INTEGER | Video Views |
| `video_watched_2s` | INTEGER | 2s Video Views |
| `video_watched_6s` | INTEGER | 6s Video Views |
| `spend` | FLOAT | Spend |
| `video_completion` | INTEGER | Video Completion |
