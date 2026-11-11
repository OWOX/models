---
title: "Ad Performance by Country"
description: |
  Daily ad performance split by country: the same impressions, clicks, spend, conversion and video metrics as Ad Performance, with `country_code` (a two-letter ISO country code) added to the key. With the default Data Level, one row per ad, country and `stat_time_day`.

  The connector asks for the same fixed list of metrics as Ad Performance, so `cost`, `engagement`, `video_views` and the `real_time_` columns are not requested; use `spend`. There is no table of countries here, so `country_code` is read as it stands. Join it to Ads on `ad_id` for the ad's name and creative.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/adInsightsByCountryFields.js"
    title: "OWOX Data Marts TikTok Ads connector — Ad Performance by Country endpoint (`ad_insights_by_country`)"
    last_modified: 2026-07-17
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs?id=1738864915188737"
    title: "TikTok Business API reference — Ad Performance by Country"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `ad_insights_by_country`
- **Default destination table:** `tiktok_ads_ad_insights_by_country`
- **Last updated:** 2026-07-17 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([091d50240](https://github.com/OWOX/owox-data-marts/commit/091d50240225379814cb0167b7c496e5b1f053f9))
- **TikTok Business API version:** v1.3
- **Unique keys:** `ad_id`, `stat_time_day`, `country_code`, `advertiser_id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_id` | STRING | Ad ID | PK. ID of the ad. FK to [Ads](./ads.md) |
| `advertiser_id` | STRING | Advertiser ID | PK. ID of the advertiser account the row belongs to. |
| `campaign_id` | STRING | Campaign ID | ID of the campaign. |
| `adgroup_id` | STRING | Adgroup ID | ID of the ad group. |
| `country_code` | STRING | Country Code | PK. Two-letter ISO country code (geographic breakdown dimension) |
| `stat_time_day` | DATE | Stat Time Day | PK. Statistics Date |
| `date_start` | DATE | Date Start | First day of the reporting range; the connector fills it from `stat_time_day` when TikTok does not return it. |
| `date_end` | DATE | Date End | Last day of the reporting range. |
| `impressions` | INTEGER | Impressions | Number of times the ads were shown. |
| `clicks` | INTEGER | Clicks | Number of clicks. |
| `cost` | FLOAT | Cost | Cost. The connector does not request this metric, so the column stays empty; use `spend` for the amount spent. |
| `ctr` | FLOAT | CTR | Click-Through Rate |
| `conversion` | INTEGER | Conversion | Number of conversions. |
| `cost_per_conversion` | FLOAT | Cost Per Conversion | Spend divided by conversions, as TikTok reports it. |
| `conversion_rate` | FLOAT | Conversion Rate | Conversions as a percentage of clicks, as TikTok reports it. |
| `reach` | INTEGER | Reach | Number of unique users who saw the ads at least once. |
| `engagement` | INTEGER | Engagement | Engagement. The connector does not request this metric, so the column stays empty. |
| `video_views` | INTEGER | Video Views | Video views. The connector does not request this metric, so the column stays empty; use `video_play_actions` for video plays. |
| `video_watched_2s` | INTEGER | Video Watched 2s | 2s Video Views |
| `video_watched_6s` | INTEGER | Video Watched 6s | 6s Video Views |
| `video_completion` | INTEGER | Video Completion | Video completions. The connector does not request this metric, so the column stays empty. Use `video_views_p100` for views to the end. |
| `spend` | FLOAT | Spend | Amount spent, in the advertiser account's currency. |
| `cpc` | FLOAT | CPC | Cost per click |
| `cpm` | FLOAT | CPM | Cost per thousand impressions |
| `frequency` | FLOAT | Frequency | Frequency of occurrence |
| `video_play_actions` | INTEGER | Video Play Actions | Number of video plays |
| `video_views_p25` | INTEGER | Video Views 25% | Video views at 25% completion |
| `video_views_p50` | INTEGER | Video Views 50% | Video views at 50% completion |
| `video_views_p75` | INTEGER | Video Views 75% | Video views at 75% completion |
| `video_views_p100` | INTEGER | Video Views 100% | Video views at 100% completion |
| `profile_visits` | INTEGER | Profile Visits | Visits to the advertiser's profile that came from the ads. |
| `likes` | INTEGER | Likes | Number of likes. |
| `comments` | INTEGER | Comments | Comments count |
| `shares` | INTEGER | Shares | Shares count |
| `follows` | INTEGER | Follows | Follows count |
| `real_time_conversion` | INTEGER | Real Time Conversion | Real-time conversions |
| `real_time_cost_per_conversion` | FLOAT | Real Time Cost Per Conversion | Cost per conversion in real-time |
| `real_time_conversion_rate` | FLOAT | Real Time Conversion Rate | Conversion rate as TikTok counts it in real time. The connector does not request this metric, so the column stays empty. |
| `result` | INTEGER | Result | Number of results |
| `cost_per_result` | FLOAT | Cost Per Result | Cost per result. The connector does not request this metric, so the column stays empty. |

# Example Questions

- Which countries bring the most conversions, and at what cost per conversion?
- How does click-through rate differ by country for the same ad?
- Which ads spend in more than one country?

## Joins

- [Ads](./ads.md) — `ad_id = ad_id` [N:1] — The ad the country row reports on, at the default ad data level.
  - [Ad's Ad Group](./ad-groups.md) — The ad group — bids and targeting — of the ad behind this row; absent when that ad was deleted and Include Deleted is off.
    - [Ad's Campaign](./campaigns.md) — The campaign the ad behind this row runs in — settings, not results; absent when that ad was deleted and Include Deleted is off.
      - [Ad's Advertiser Account](./advertiser-account.md) — The advertiser account the ad runs under, where the unit of this row's amounts is read; absent when that ad was deleted and Include Deleted is off.
