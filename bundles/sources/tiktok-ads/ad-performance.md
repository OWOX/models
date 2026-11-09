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
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_id` | STRING | Ad ID | PK. Ad ID |
| `advertiser_id` | STRING | Advertiser ID | PK. Advertiser ID |
| `campaign_id` | STRING | Campaign ID | Campaign ID |
| `adgroup_id` | STRING | Adgroup ID | Ad Group ID |
| `stat_time_day` | DATE | Stat Time Day | PK. Statistics Date |
| `date_start` | DATE | Date Start | Start Date |
| `date_end` | DATE | Date End | End Date |
| `impressions` | INTEGER | Impressions | Impressions |
| `clicks` | INTEGER | Clicks | Clicks |
| `cost` | NUMERIC | Cost | Cost |
| `ctr` | NUMERIC | CTR | Click-Through Rate |
| `conversion` | INTEGER | Conversion | Conversions |
| `cost_per_conversion` | NUMERIC | Cost per Conversion | Cost Per Conversion |
| `conversion_rate` | NUMERIC | Conversion Rate | Conversion Rate |
| `reach` | INTEGER | Reach | Reach |
| `engagement` | INTEGER | Engagement | Engagement |
| `video_views` | INTEGER | Video Views | Video Views |
| `video_watched_2s` | INTEGER | Video Watched 2s | 2s Video Views |
| `video_watched_6s` | INTEGER | Video Watched 6s | 6s Video Views |
| `video_completion` | INTEGER | Video Completion | Video Completion |
| `spend` | NUMERIC | Spend | Spend |
| `cpc` | NUMERIC | CPC | Cost per click |
| `cpm` | NUMERIC | CPM | Cost per thousand impressions |
| `frequency` | NUMERIC | Frequency | Frequency of occurrence |
| `video_play_actions` | INTEGER | Video Play Actions | Number of video plays |
| `video_views_p25` | INTEGER | Video Views P25 | Video views at 25% completion |
| `video_views_p50` | INTEGER | Video Views P50 | Video views at 50% completion |
| `video_views_p75` | INTEGER | Video Views P75 | Video views at 75% completion |
| `video_views_p100` | INTEGER | Video Views P100 | Video views at 100% completion |
| `profile_visits` | INTEGER | Profile Visits | Profile visits |
| `likes` | INTEGER | Likes | Likes count |
| `comments` | INTEGER | Comments | Comments count |
| `shares` | INTEGER | Shares | Shares count |
| `follows` | INTEGER | Follows | Follows count |
| `real_time_conversion` | INTEGER | Real Time Conversion | Real-time conversions |
| `real_time_cost_per_conversion` | NUMERIC | Real Time Cost per Conversion | Cost per conversion in real-time |
| `real_time_conversion_rate` | NUMERIC | Real Time Conversion Rate | Real-time conversion rate |
| `result` | INTEGER | Result | Number of results |
| `cost_per_result` | NUMERIC | Cost per Result | Cost per result |

# Example Questions

- What did each ad spend and return per day over the last 30 days?
- Which ads have the highest cost per conversion, and how many conversions do they have?
- Which ads keep the most viewers to the end of the video, relative to video plays?

## Joins

- [Ads](./ads.md) — `ad_id = ad_id` [N:1] — The ad the daily row reports on, at the default ad data level.
  - Description: The ad the daily row reports on, at the default ad data level.
