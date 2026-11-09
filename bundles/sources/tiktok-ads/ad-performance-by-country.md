---
title: "Ad Performance by Country"
description: |
  Daily ad performance split by country: the same impressions, clicks, spend, conversion and video metrics as Ad Performance, with `country_code` (a two-letter ISO country code) added to the key. With the default Data Level, one row per ad, country and `stat_time_day`.

  The connector asks for the same fixed list of metrics as Ad Performance, so `cost`, `engagement`, `video_views` and the `real_time_` columns are not requested; use `spend`. There is no table of countries here, so `country_code` is read as it stands. Join it to Ads on `ad_id` for the ad's name and creative.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/TikTokAdsFieldsSchema.js"
    title: "OWOX Data Marts TikTok Ads connector — Ad Performance by Country endpoint (`ad_insights_by_country`)"
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs?id=1738864915188737"
    title: "TikTok Business API reference — docs?id=1738864915188737"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `ad_insights_by_country`
- **Default destination table:** `tiktok_ads_ad_insights_by_country`
- **Unique keys:** `ad_id`, `stat_time_day`, `country_code`, `advertiser_id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_id` | STRING | Ad ID | PK. Ad ID |
| `advertiser_id` | STRING | Advertiser ID | PK. Advertiser ID |
| `campaign_id` | STRING | Campaign ID | Campaign ID |
| `adgroup_id` | STRING | Adgroup ID | Ad Group ID |
| `country_code` | STRING | Country Code | PK. Two-letter ISO country code (geographic breakdown dimension) |
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

- Which countries bring the most conversions, and at what cost per conversion?
- How does click-through rate differ by country for the same ad?
- Which ads spend in more than one country?

## Joins

- [Ads](./ads.md) — `ad_id = ad_id` [N:1] — The ad the country row reports on, at the default ad data level.
  - Description: The ad the country row reports on, at the default ad data level.
