---
title: "Ad Set Insights"
description: |
  Daily performance at the ad-set level, requested from Meta at that level so that reach and frequency are deduplicated across the ad set's ads — these numbers match Meta Ads Manager. Use it for audience size and frequency; use [Ad Insights](./ad-insights.md) when you need the ad behind a number. The two should not be joined row to row: they describe the same delivery at two levels, so combining them counts it twice.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/7703667ccad8022f2fc89f8ddc1d27a125c219e0/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/ad-account-insights-fields-by-adset.js"
    title: "OWOX Data Marts Facebook Ads connector — Ad Insights by Ad Set endpoint (`ad-account/insights-by-adset`)"
    last_modified: 2026-09-16
  - id: "meta-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/ad-account/insights"
    title: "Meta Marketing API reference — Ad Insights by Ad Set"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-account/insights-by-adset`
- **Default destination table:** `facebook_ads_ad_account_insights_by_adset`
- **Last updated:** 2026-09-16 — last change to this endpoint's fields in the connector ([3f005422b](https://github.com/OWOX/owox-data-marts/commit/3f005422b6226dd020a5c7ac74278023c33595dc))
- **Meta Graph API version:** v26.0
- **Unique keys:** `adset_id`, `date_start`, `date_stop`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `account_currency` | STRING | Account Currency | Currency that is used by your ad account. |
| `account_id` | STRING | Account ID | The ad account the row belongs to. FK to [Ad Account](./ad-account.md) |
| `account_name` | STRING | Account Name | The name of your ad account, which groups your advertising activity. Your ad account includes your campaigns, ads and billing. |
| `action_values` | STRING | Action Values | The total value of all conversions attributed to your ads. Stored as a JSON string. |
| `actions` | STRING | Actions | The total number of actions people took that are attributed to your ads. Actions may include engagement, clicks or conversions. Stored as a JSON string. |
| `adset_id` | STRING | Ad Set ID | PK. The ad set this row reports on. |
| `adset_name` | STRING | Ad Set Name | The name of the ad set you're viewing in reporting. An ad set is a group of ads that share the same budget, schedule, delivery optimization and targeting. |
| `attribution_setting` | STRING | Attribution Setting | The default attribution window to be used when attribution result is calculated. Each ad set has its own attribution setting value. The attribution setting for campaign or account is calculated based on existing ad sets. |
| `buying_type` | STRING | Buying Type | The method by which you pay for and target ads in your campaigns: through dynamic auction bidding, fixed-price bidding, or reach and frequency buying. This field is currently only visible at the campaign level. |
| `campaign_id` | STRING | Campaign ID | The campaign the ad set sits in; no campaign table is loaded, the name is on the row. |
| `campaign_name` | STRING | Campaign Name | The name of the ad campaign you're viewing in reporting. Your campaign contains ad sets and ads. |
| `canvas_avg_view_percent` | FLOAT | Canvas Avg View Percent | The average percentage of the Instant Experience that people saw. An Instant Experience is a screen that opens after someone interacts with your ad on a mobile device. It may include a series of interactive or multimedia components, including video, images product catalog and more. |
| `canvas_avg_view_time` | FLOAT | Canvas Avg View Time | The average total time, in seconds, that people spent viewing an Instant Experience. An Instant Experience is a screen that opens after someone interacts with your ad on a mobile device. It may include a series of interactive or multimedia components, including video, images product catalog and more. |
| `catalog_segment_actions` | STRING | Catalog Segment Actions | The number of actions performed attributed to your ads promoting your catalog segment, broken down by action type. Stored as a JSON string. |
| `catalog_segment_value` | STRING | Catalog Segment Value | The total value of all conversions from your catalog segment attributed to your ads. Stored as a JSON string. |
| `catalog_segment_value_mobile_purchase_roas` | STRING | Catalog Segment Value Mobile Purchase ROAS | The total return on ad spend (ROAS) from mobile app purchases for your catalog segment. Stored as a JSON string. |
| `catalog_segment_value_omni_purchase_roas` | STRING | Catalog Segment Value Omni Purchase ROAS | The total return on ad spend (ROAS) from all purchases for your catalog segment. Stored as a JSON string. |
| `catalog_segment_value_website_purchase_roas` | STRING | Catalog Segment Value Website Purchase ROAS | The total return on ad spend (ROAS) from website purchases for your catalog segment. Stored as a JSON string. |
| `clicks` | FLOAT | Clicks | The number of clicks on your ads. |
| `conversion_values` | STRING | Conversion Values | The total value of the conversions attributed to your ads, counting conversion events only. Unlike action_values, it excludes engagement and clicks. Stored as a JSON string. |
| `conversions` | STRING | Conversions | The total number of conversions attributed to your ads. Counts conversion events only, unlike actions, which also counts engagement and clicks. Stored as a JSON string. |
| `converted_product_quantity` | STRING | Converted Product Quantity | The number of products purchased which are recorded by your merchant partner's pixel or app SDK for a given product ID and driven by your ads. Has to be used together with converted product ID breakdown. Stored as a JSON string. |
| `converted_product_value` | STRING | Converted Product Value | The value of purchases recorded by your merchant partner's pixel or app SDK for a given product ID and driven by your ads. Has to be used together with converted product ID breakdown. Stored as a JSON string. |
| `cost_per_15_sec_video_view` | STRING | Cost Per 15 Sec Video View | Average cost per video view of at least 15 seconds. Stored as a JSON string. |
| `cost_per_2_sec_continuous_video_view` | STRING | Cost Per 2 Sec Continuous Video View | Average cost per continuous video view of at least 2 seconds. Stored as a JSON string. |
| `cost_per_action_type` | STRING | Cost Per Action Type | The average cost of a relevant action. Stored as a JSON string. |
| `cost_per_ad_click` | STRING | Cost Per Ad Click | Average cost per click on the ad. Stored as a JSON string. |
| `cost_per_conversion` | STRING | Cost Per Conversion | Average cost per conversion, by conversion type. Stored as a JSON string. |
| `cost_per_dda_countby_convs` | FLOAT | Cost Per DDA Countby Convs | Average cost per conversion counted by data-driven attribution. |
| `cost_per_inline_link_click` | FLOAT | Cost Per Inline Link Click | The average cost of each inline link click. |
| `cost_per_inline_post_engagement` | FLOAT | Cost Per Inline Post Engagement | The average cost of each inline post engagement. |
| `cost_per_one_thousand_ad_impression` | STRING | Cost Per One Thousand Ad Impression | Average cost per 1,000 ad impressions. Stored as a JSON string. |
| `cost_per_outbound_click` | STRING | Cost Per Outbound Click | The average cost for each outbound click. Stored as a JSON string. |
| `cost_per_result` | STRING | Cost Per Result | The average cost per result from your ads. Stored as a JSON string. |
| `cost_per_thruplay` | STRING | Cost Per ThruPlay | The average cost for each ThruPlay. This metric is in development. Stored as a JSON string. |
| `cost_per_unique_action_type` | STRING | Cost Per Unique Action Type | The average cost of each unique action. This metric is estimated. Stored as a JSON string. |
| `cost_per_unique_click` | FLOAT | Cost Per Unique Click | The average cost for each unique click (all). This metric is estimated. |
| `cost_per_unique_conversion` | STRING | Cost Per Unique Conversion | Average cost per unique conversion, by conversion type. Not additive across rows. Stored as a JSON string. |
| `cost_per_unique_inline_link_click` | FLOAT | Cost Per Unique Inline Link Click | The average cost of each unique inline link click. This metric is estimated. |
| `cost_per_unique_outbound_click` | STRING | Cost Per Unique Outbound Click | The average cost for each unique outbound click. This metric is estimated. Stored as a JSON string. |
| `cpc` | FLOAT | CPC | The average cost for each click (all). |
| `cpm` | FLOAT | CPM | The average cost for 1,000 impressions. |
| `cpp` | FLOAT | CPP | The average cost to reach 1,000 people. This metric is estimated. |
| `created_time` | STRING | Created Time | When the object this row describes was created, as Meta reports it. |
| `ctr` | FLOAT | CTR | The percentage of times people saw your ad and performed a click (all). |
| `date_start` | DATE | Date Start | PK. The day the row reports on; equal to `date_stop`, because the connector requests one day at a time. |
| `date_stop` | DATE | Date Stop | PK. The day the row reports on; equal to `date_start`. |
| `dda_countby_convs` | FLOAT | DDA Countby Convs | Conversions counted by Meta's data-driven attribution. |
| `dda_results` | STRING | DDA Results | Results counted by Meta's data-driven attribution. Stored as a JSON string. |
| `frequency` | FLOAT | Frequency | The average number of times each person saw your ad. This metric is estimated. |
| `full_view_impressions` | FLOAT | Full View Impressions | The number of Full Views on your Page's posts as a result of your ad. |
| `full_view_reach` | FLOAT | Full View Reach | The number of people who performed a Full View on your Page's post as a result of your ad. |
| `impressions` | FLOAT | Impressions | The number of times your ads were on screen. |
| `inline_link_click_ctr` | FLOAT | Inline Link Click CTR | The percentage of time people saw your ads and performed an inline link click. |
| `inline_link_clicks` | FLOAT | Inline Link Clicks | The number of clicks on links to select destinations or experiences, on or off Facebook-owned properties. Inline link clicks use a fixed 1-day-click attribution window. |
| `inline_post_engagement` | FLOAT | Inline Post Engagement | The total number of actions that people take involving your ads. Inline post engagements use a fixed 1-day-click attribution window. |
| `instagram_upcoming_event_reminders_set` | FLOAT | Instagram Upcoming Event Reminders Set | Reminders people set for an upcoming event promoted on Instagram. |
| `instant_experience_clicks_to_open` | FLOAT | Instant Experience Clicks To Open | Clicks that opened the ad's Instant Experience. |
| `instant_experience_clicks_to_start` | FLOAT | Instant Experience Clicks To Start | Clicks that started the ad's Instant Experience. |
| `instant_experience_outbound_clicks` | STRING | Instant Experience Outbound Clicks | Clicks from the ad's Instant Experience to a destination off Meta. Stored as a JSON string. |
| `interactive_component_tap` | STRING | Interactive Component Tap | Taps on interactive components of the ad, such as polls or sliders. Stored as a JSON string. |
| `marketing_messages_delivery_rate` | FLOAT | Marketing Messages Delivery Rate | The number of messages delivered divided by the number of messages sent. Some messages may not be delivered, such as when a customer's device is out of service. This metric doesn't include messages sent to Europe and Japan. |
| `mobile_app_purchase_roas` | STRING | Mobile App Purchase ROAS | The total return on ad spend (ROAS) from mobile app purchases. This is based on the value that you assigned when you set up the app event. Stored as a JSON string. |
| `objective` | STRING | Objective | The objective reflecting the goal you want to achieve with your advertising. It may be different from the selected objective of the campaign in some cases. |
| `optimization_goal` | STRING | Optimization Goal | The optimization goal you selected for your ad or ad set. Your optimization goal reflects what you want to optimize for the ads. |
| `outbound_clicks` | STRING | Outbound Clicks | The number of clicks on links that take people off Facebook-owned properties. Stored as a JSON string. |
| `outbound_clicks_ctr` | STRING | Outbound Clicks CTR | The percentage of times people saw your ad and performed an outbound click. Stored as a JSON string. |
| `purchase_roas` | STRING | Purchase ROAS | The total return on ad spend (ROAS) from purchases. This is based on information received from one or more of your connected Facebook Business Tools and attributed to your ads. Stored as a JSON string. |
| `qualifying_question_qualify_answer_rate` | FLOAT | Qualifying Question Qualify Answer Rate | Share of lead-form respondents whose answer to a qualifying question marked them as qualified. |
| `reach` | FLOAT | Reach | The number of people who saw your ads at least once, deduplicated at the ad set level. This metric is estimated. |
| `result_rate` | STRING | Result Rate | The percentage of results you received out of all the views of your ads. Stored as a JSON string. |
| `results` | STRING | Results | The number of results you received out of all the views of your ads. Stored as a JSON string. |
| `shops_assisted_purchases` | STRING | Shops Assisted Purchases | Purchases on Meta Shops that the ad assisted. |
| `social_spend` | FLOAT | Social Spend | The total amount you've spent so far for your ads showed with social information. (ex: Jane Doe likes this). |
| `spend` | FLOAT | Spend | The estimated total amount of money you've spent on your campaign, ad set or ad during its schedule. This metric is estimated. |
| `updated_time` | STRING | Updated Time | When the object this row describes was last updated, as Meta reports it. |
| `video_30_sec_watched_actions` | STRING | Video 30 Sec Watched Actions | The number of times your video played for at least 30 seconds, or for nearly its total length if it's shorter than 30 seconds. For each impression of a video, we'll count video views separately and exclude any time spent replaying the video. Stored as a JSON string. |
| `video_avg_time_watched_actions` | STRING | Video Avg Time Watched Actions | The average time a video was played, including any time spent replaying the video for a single impression. Stored as a JSON string. |
| `video_continuous_2_sec_watched_actions` | STRING | Video Continuous 2 Sec Watched Actions | Video plays of at least 2 continuous seconds. Stored as a JSON string. |
| `video_p100_watched_actions` | STRING | Video 100% Watched Actions | The number of times your video was played at 100% of its length, including plays that skipped to this point. Stored as a JSON string. |
| `video_p25_watched_actions` | STRING | Video 25% Watched Actions | The number of times your video was played at 25% of its length, including plays that skipped to this point. Stored as a JSON string. |
| `video_p50_watched_actions` | STRING | Video 50% Watched Actions | The number of times your video was played at 50% of its length, including plays that skipped to this point. Stored as a JSON string. |
| `video_p75_watched_actions` | STRING | Video 75% Watched Actions | The number of times your video was played at 75% of its length, including plays that skipped to this point. Stored as a JSON string. |
| `video_p95_watched_actions` | STRING | Video 95% Watched Actions | The number of times your video was played at 95% of its length, including plays that skipped to this point. Stored as a JSON string. |
| `video_play_actions` | STRING | Video Play Actions | The number of times your video starts to play. This is counted for each impression of a video, and excludes replays. This metric is in development. Stored as a JSON string. |
| `video_play_curve_actions` | STRING | Video Play Curve Actions | A video-play based curve graph that illustrates the percentage of video plays that reached a given second. Entries 0 to 14 represent seconds 0 thru 14. Entries 15 to 17 represent second ranges [15 to 20), [20 to 25), and [25 to 30). Entries 18 to 20 represent second ranges [30 to 40), [40 to 50), and [50 to 60). Entry 21 represents plays over 60 seconds. Stored as a JSON string. |
| `video_play_retention_0_to_15s_actions` | STRING | Video Play Retention 0 To 15s Actions | Viewer retention over the first 15 seconds of the video. Stored as a JSON string. |
| `video_play_retention_20_to_60s_actions` | STRING | Video Play Retention 20 To 60s Actions | Viewer retention between 20 and 60 seconds of the video. Stored as a JSON string. |
| `video_play_retention_graph_actions` | STRING | Video Play Retention Graph Actions | Viewer retention across the whole video, as a curve. Stored as a JSON string. |
| `video_time_watched_actions` | STRING | Video Time Watched Actions | Total time the video was watched. Stored as a JSON string. |
| `website_ctr` | STRING | Website CTR | The percentage of times people saw your ad and performed a link click. Stored as a JSON string. |
| `website_purchase_roas` | STRING | Website Purchase ROAS | The total return on ad spend (ROAS) from website purchases. This is based on the value of all conversions recorded by the Facebook pixel on your website and attributed to your ads. Stored as a JSON string. |

# Example Questions

- How many unique people did each ad set reach last week, and how often did they see our ads?
- Which ad sets push frequency past the point where click-through falls?
- How does an ad set's cost per result change as its reach saturates?

## Joins

- [Ad Account](./ad-account.md) — `account_id = account_id` [N:1] — The account the ad set belongs to.
