---
title: "Ad Performance"
description: |
  Daily ad performance: impressions, clicks, spend, click-through rate, reach, frequency, conversions with cost per conversion and conversion rate, video play and completion-point views (2s, 6s, 25%, 50%, 75%, 100%), and profile visits, likes, comments, shares and follows. With the default Data Level, one row per ad per `stat_time_day`, keyed by `ad_id`, `stat_time_day` and `advertiser_id`.

  The connector asks the API for a fixed list of metrics, so schema columns such as `cost`, `engagement`, `video_views`, `video_completion`, the `real_time_` columns, `result` and `cost_per_result` are in the table but are not requested; use `spend` for the amount spent. The unit of the amounts is not stated in the table; read it from the advertiser account. Join it to Ads on `ad_id` for the ad's name and creative.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/TikTokAdsFieldsSchema.js"
    title: "OWOX Data Marts TikTok Ads connector — Ad Performance endpoint (`ad_insights`)"
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs?id=1738864915188737"
    title: "TikTok Business API reference — docs?id=1738864915188737"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `ad_insights`
- **Default destination table:** `tiktok_ads_ad_insights`
- **Unique keys:** `ad_id`, `stat_time_day`, `advertiser_id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_id` | STRING | PK. Ad ID |
| `advertiser_id` | STRING | PK. Advertiser ID |
| `campaign_id` | STRING | Campaign ID |
| `adgroup_id` | STRING | Ad Group ID |
| `stat_time_day` | DATE | PK. Statistics Date |
| `date_start` | DATE | Start Date |
| `date_end` | DATE | End Date |
| `impressions` | INTEGER | Impressions |
| `clicks` | INTEGER | Clicks |
| `cost` | NUMERIC | Cost |
| `ctr` | NUMERIC | Click-Through Rate |
| `conversion` | INTEGER | Conversions |
| `cost_per_conversion` | NUMERIC | Cost Per Conversion |
| `conversion_rate` | NUMERIC | Conversion Rate |
| `reach` | INTEGER | Reach |
| `engagement` | INTEGER | Engagement |
| `video_views` | INTEGER | Video Views |
| `video_watched_2s` | INTEGER | 2s Video Views |
| `video_watched_6s` | INTEGER | 6s Video Views |
| `video_completion` | INTEGER | Video Completion |
| `spend` | NUMERIC | Spend |
| `cpc` | NUMERIC | Cost per click |
| `cpm` | NUMERIC | Cost per thousand impressions |
| `frequency` | NUMERIC | Frequency of occurrence |
| `video_play_actions` | INTEGER | Number of video plays |
| `video_views_p25` | INTEGER | Video views at 25% completion |
| `video_views_p50` | INTEGER | Video views at 50% completion |
| `video_views_p75` | INTEGER | Video views at 75% completion |
| `video_views_p100` | INTEGER | Video views at 100% completion |
| `profile_visits` | INTEGER | Profile visits |
| `likes` | INTEGER | Likes count |
| `comments` | INTEGER | Comments count |
| `shares` | INTEGER | Shares count |
| `follows` | INTEGER | Follows count |
| `real_time_conversion` | INTEGER | Real-time conversions |
| `real_time_cost_per_conversion` | NUMERIC | Cost per conversion in real-time |
| `real_time_conversion_rate` | NUMERIC | Real-time conversion rate |
| `result` | INTEGER | Number of results |
| `cost_per_result` | NUMERIC | Cost per result |

# Example Questions

- What did each ad spend and return per day over the last 30 days?
- Which ads have the highest cost per conversion, and how many conversions do they have?
- Which ads keep the most viewers to the end of the video, relative to video plays?

## Joins

- [Ads](./ads.md) — `ad_id = ad_id` [N:1] — The ad the daily row reports on, at the default ad data level.
  - Description: The ad the daily row reports on, at the default ad data level.
