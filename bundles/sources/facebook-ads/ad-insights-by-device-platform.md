---
title: "Ad Insights by Device Platform"
description: |
  The ad-day of [Ad Insights](./ad-insights.md), split by the type of device the ad was viewed or clicked on, mobile or desktop. One row per ad per day per `device_platform`, with the same metrics as the base table. Reach, frequency and the `unique_*` columns count people, so do not sum them across the breakdown values.

  The campaign and ad set IDs and names are columns on the row. Join to [Ads](./ads.md) on `ad_id` for the ad's status and creative.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Facebook Ads connector — Ad Insights by Device Platform endpoint (`ad-account/insights-by-device-platform`)"
  - id: "vendor-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/ad-account/insights"
    title: "Meta Marketing API reference — insights"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-account/insights-by-device-platform`
- **Default destination table:** `facebook_ads_ad_account_insights_by_device_platform`
- **Unique keys:** `ad_id`, `date_start`, `date_stop`, `device_platform`
- **Last updated:** 2026-05-18 — last change to this endpoint's fields in the connector ([8a33aca18](https://github.com/OWOX/owox-data-marts/commit/8a33aca183b6dbff95532a723e27803026ba94d9))
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `account_currency` | STRING | Account Currency | Currency that is used by your ad account. |
| `account_id` | STRING | Account ID | The ID number of your ad account, which groups your advertising activity. Your ad account includes your campaigns, ads and billing. |
| `account_name` | STRING | Account Name | The name of your ad account, which groups your advertising activity. Your ad account includes your campaigns, ads and billing. |
| `action_values` | JSON | Action Values | The total value of all conversions attributed to your ads. |
| `actions` | JSON | Actions | The total number of actions people took that are attributed to your ads. Actions may include engagement, clicks or conversions. |
| `ad_click_actions` | JSON | Ad Click Actions | ad_click_actions |
| `ad_id` | STRING | Ad ID | PK. The unique ID of the ad you're viewing in reporting. |
| `ad_impression_actions` | JSON | Ad Impression Actions | ad_impression_actions |
| `ad_name` | STRING | Ad Name | The name of the ad you're viewing in reporting. |
| `adset_id` | STRING | Ad Set ID | The unique ID of the ad set you're viewing in reporting. An ad set is a group of ads that share the same budget, schedule, delivery optimization and targeting. |
| `adset_name` | STRING | Ad Set Name | The name of the ad set you're viewing in reporting. An ad set is a group of ads that share the same budget, schedule, delivery optimization and targeting. |
| `attribution_setting` | STRING | Attribution Setting | The default attribution window to be used when attribution result is calculated. Each ad set has its own attribution setting value. The attribution setting for campaign or account is calculated based on existing ad sets. |
| `auction_bid` | NUMERIC | Auction Bid | auction_bid |
| `auction_competitiveness` | NUMERIC | Auction Competitiveness | auction_competitiveness |
| `auction_max_competitor_bid` | NUMERIC | Auction Max Competitor Bid | auction_max_competitor_bid |
| `buying_type` | STRING | Buying Type | The method by which you pay for and target ads in your campaigns: through dynamic auction bidding, fixed-price bidding, or reach and frequency buying. This field is currently only visible at the campaign level. |
| `campaign_id` | STRING | Campaign ID | The unique ID number of the ad campaign you're viewing in reporting. Your campaign contains ad sets and ads. |
| `campaign_name` | STRING | Campaign Name | The name of the ad campaign you're viewing in reporting. Your campaign contains ad sets and ads. |
| `canvas_avg_view_percent` | NUMERIC | Canvas Avg View Percent | The average percentage of the Instant Experience that people saw. An Instant Experience is a screen that opens after someone interacts with your ad on a mobile device. It may include a series of interactive or multimedia components, including video, images product catalog and more. |
| `canvas_avg_view_time` | NUMERIC | Canvas Avg View Time | The average total time, in seconds, that people spent viewing an Instant Experience. An Instant Experience is a screen that opens after someone interacts with your ad on a mobile device. It may include a series of interactive or multimedia components, including video, images product catalog and more. |
| `catalog_segment_actions` | JSON | Catalog Segment Actions | The number of actions performed attributed to your ads promoting your catalog segment, broken down by action type. |
| `catalog_segment_value` | JSON | Catalog Segment Value | The total value of all conversions from your catalog segment attributed to your ads. |
| `catalog_segment_value_mobile_purchase_roas` | JSON | Catalog Segment Value Mobile Purchase ROAS | The total return on ad spend (ROAS) from mobile app purchases for your catalog segment. |
| `catalog_segment_value_omni_purchase_roas` | JSON | Catalog Segment Value Omni Purchase ROAS | The total return on ad spend (ROAS) from all purchases for your catalog segment. |
| `catalog_segment_value_website_purchase_roas` | JSON | Catalog Segment Value Website Purchase ROAS | The total return on ad spend (ROAS) from website purchases for your catalog segment. |
| `clicks` | NUMERIC | Clicks | The number of clicks on your ads. |
| `conversion_values` | JSON | Conversion Values | conversion_values |
| `conversions` | JSON | Conversions | conversions |
| `converted_product_quantity` | JSON | Converted Product Quantity | The number of products purchased which are recorded by your merchant partner's pixel or app SDK for a given product ID and driven by your ads. Has to be used together with converted product ID breakdown. |
| `converted_product_value` | JSON | Converted Product Value | The value of purchases recorded by your merchant partner's pixel or app SDK for a given product ID and driven by your ads. Has to be used together with converted product ID breakdown. |
| `cost_per_15_sec_video_view` | JSON | Cost per 15 Sec Video View | cost_per_15_sec_video_view |
| `cost_per_2_sec_continuous_video_view` | JSON | Cost per 2 Sec Continuous Video View | cost_per_2_sec_continuous_video_view |
| `cost_per_action_type` | JSON | Cost per Action Type | The average cost of a relevant action. |
| `cost_per_ad_click` | JSON | Cost per Ad Click | cost_per_ad_click |
| `cost_per_conversion` | JSON | Cost per Conversion | cost_per_conversion |
| `cost_per_dda_countby_convs` | NUMERIC | Cost per DDA Countby Convs | cost_per_dda_countby_convs |
| `cost_per_inline_link_click` | NUMERIC | Cost per Inline Link Click | The average cost of each inline link click. |
| `cost_per_inline_post_engagement` | NUMERIC | Cost per Inline Post Engagement | The average cost of each inline post engagement. |
| `cost_per_one_thousand_ad_impression` | JSON | Cost per One Thousand Ad Impression | cost_per_one_thousand_ad_impression |
| `cost_per_outbound_click` | JSON | Cost per Outbound Click | The average cost for each outbound click. |
| `cost_per_result` | JSON | Cost per Result | The average cost per result from your ads. |
| `cost_per_thruplay` | JSON | Cost per ThruPlay | The average cost for each ThruPlay. This metric is in development. |
| `cost_per_unique_action_type` | JSON | Cost per Unique Action Type | The average cost of each unique action. This metric is estimated. |
| `cost_per_unique_click` | NUMERIC | Cost per Unique Click | The average cost for each unique click (all). This metric is estimated. |
| `cost_per_unique_conversion` | JSON | Cost per Unique Conversion | cost_per_unique_conversion |
| `cost_per_unique_inline_link_click` | NUMERIC | Cost per Unique Inline Link Click | The average cost of each unique inline link click. This metric is estimated. |
| `cost_per_unique_outbound_click` | JSON | Cost per Unique Outbound Click | The average cost for each unique outbound click. This metric is estimated. |
| `cpc` | NUMERIC | CPC | The average cost for each click (all). |
| `cpm` | NUMERIC | CPM | The average cost for 1,000 impressions. |
| `cpp` | NUMERIC | CPP | The average cost to reach 1,000 people. This metric is estimated. |
| `created_time` | STRING | Created Time | created_time |
| `ctr` | NUMERIC | CTR | The percentage of times people saw your ad and performed a click (all). |
| `date_start` | DATE | Date Start | PK. The start date for your data. This is controlled by the date range you've selected for your reporting view. |
| `date_stop` | DATE | Date Stop | PK. The end date for your data. This is controlled by the date range you've selected for your reporting view. |
| `dda_countby_convs` | NUMERIC | DDA Countby Convs | dda_countby_convs |
| `dda_results` | JSON | DDA Results | dda_results |
| `device_platform` | STRING | Device Platform | PK. device_platform |
| `frequency` | NUMERIC | Frequency | The average number of times each person saw your ad. This metric is estimated. |
| `full_view_impressions` | NUMERIC | Full View Impressions | The number of Full Views on your Page's posts as a result of your ad. |
| `full_view_reach` | NUMERIC | Full View Reach | The number of people who performed a Full View on your Page's post as a result of your ad. |
| `impressions` | NUMERIC | Impressions | The number of times your ads were on screen. |
| `inline_link_click_ctr` | NUMERIC | Inline Link Click CTR | The percentage of time people saw your ads and performed an inline link click. |
| `inline_link_clicks` | NUMERIC | Inline Link Clicks | The number of clicks on links to select destinations or experiences, on or off Facebook-owned properties. Inline link clicks use a fixed 1-day-click attribution window. |
| `inline_post_engagement` | NUMERIC | Inline Post Engagement | The total number of actions that people take involving your ads. Inline post engagements use a fixed 1-day-click attribution window. |
| `instagram_upcoming_event_reminders_set` | NUMERIC | Instagram Upcoming Event Reminders Set | instagram_upcoming_event_reminders_set |
| `instant_experience_clicks_to_open` | NUMERIC | Instant Experience Clicks to Open | instant_experience_clicks_to_open |
| `instant_experience_clicks_to_start` | NUMERIC | Instant Experience Clicks to Start | instant_experience_clicks_to_start |
| `instant_experience_outbound_clicks` | JSON | Instant Experience Outbound Clicks | instant_experience_outbound_clicks |
| `interactive_component_tap` | JSON | Interactive Component Tap | interactive_component_tap |
| `marketing_messages_delivery_rate` | NUMERIC | Marketing Messages Delivery Rate | The number of messages delivered divided by the number of messages sent. Some messages may not be delivered, such as when a customer's device is out of service. This metric doesn't include messages sent to Europe and Japan. |
| `mobile_app_purchase_roas` | JSON | Mobile App Purchase ROAS | The total return on ad spend (ROAS) from mobile app purchases. This is based on the value that you assigned when you set up the app event. |
| `objective` | STRING | Objective | The objective reflecting the goal you want to achieve with your advertising. It may be different from the selected objective of the campaign in some cases. |
| `optimization_goal` | STRING | Optimization Goal | The optimization goal you selected for your ad or ad set. Your optimization goal reflects what you want to optimize for the ads. |
| `outbound_clicks` | JSON | Outbound Clicks | The number of clicks on links that take people off Facebook-owned properties. |
| `outbound_clicks_ctr` | JSON | Outbound Clicks CTR | The percentage of times people saw your ad and performed an outbound click. |
| `purchase_roas` | JSON | Purchase ROAS | The total return on ad spend (ROAS) from purchases. This is based on information received from one or more of your connected Facebook Business Tools and attributed to your ads. |
| `qualifying_question_qualify_answer_rate` | NUMERIC | Qualifying Question Qualify Answer Rate | qualifying_question_qualify_answer_rate |
| `reach` | NUMERIC | Reach | The number of people who saw your ads at least once. Reach is different from impressions, which may include multiple views of your ads by the same people. This metric is estimated. |
| `result_rate` | JSON | Result Rate | The result rate from your ads. |
| `results` | JSON | Results | The number of results from your ads. |
| `shops_assisted_purchases` | STRING | Shops Assisted Purchases | shops_assisted_purchases |
| `social_spend` | NUMERIC | Social Spend | The total amount you've spent so far for your ads showed with social information. (ex: Jane Doe likes this). |
| `spend` | NUMERIC | Spend | The estimated total amount of money you've spent on your campaign, ad set or ad during its schedule. This metric is estimated. |
| `updated_time` | STRING | Updated Time | updated_time |
| `video_30_sec_watched_actions` | JSON | Video 30 Sec Watched Actions | The number of times your video played for at least 30 seconds, or for nearly its total length if it's shorter than 30 seconds. For each impression of a video, we'll count video views separately and exclude any time spent replaying the video. |
| `video_avg_time_watched_actions` | JSON | Video Avg Time Watched Actions | The average time a video was played, including any time spent replaying the video for a single impression. |
| `video_continuous_2_sec_watched_actions` | JSON | Video Continuous 2 Sec Watched Actions | video_continuous_2_sec_watched_actions |
| `video_p100_watched_actions` | JSON | Video 100% Watched Actions | The number of times your video was played at 100% of its length, including plays that skipped to this point. |
| `video_p25_watched_actions` | JSON | Video 25% Watched Actions | The number of times your video was played at 25% of its length, including plays that skipped to this point. |
| `video_p50_watched_actions` | JSON | Video 50% Watched Actions | The number of times your video was played at 50% of its length, including plays that skipped to this point. |
| `video_p75_watched_actions` | JSON | Video 75% Watched Actions | The number of times your video was played at 75% of its length, including plays that skipped to this point. |
| `video_p95_watched_actions` | JSON | Video 95% Watched Actions | The number of times your video was played at 95% of its length, including plays that skipped to this point. |
| `video_play_actions` | JSON | Video Play Actions | The number of times your video starts to play. This is counted for each impression of a video, and excludes replays. This metric is in development. |
| `video_play_curve_actions` | JSON | Video Play Curve Actions | A video-play based curve graph that illustrates the percentage of video plays that reached a given second. Entries 0 to 14 represent seconds 0 thru 14. Entries 15 to 17 represent second ranges \[15 to 20), \[20 to 25), and \[25 to 30). Entries 18 to 20 represent second ranges \[30 to 40), \[40 to 50), and \[50 to 60). Entry 21 represents plays over 60 seconds. |
| `video_play_retention_0_to_15s_actions` | JSON | Video Play Retention 0 to 15s Actions | video_play_retention_0_to_15s_actions |
| `video_play_retention_20_to_60s_actions` | JSON | Video Play Retention 20 to 60s Actions | video_play_retention_20_to_60s_actions |
| `video_play_retention_graph_actions` | JSON | Video Play Retention Graph Actions | video_play_retention_graph_actions |
| `video_time_watched_actions` | JSON | Video Time Watched Actions | video_time_watched_actions |
| `website_ctr` | JSON | Website CTR | The percentage of times people saw your ad and performed a link click. |
| `website_purchase_roas` | JSON | Website Purchase ROAS | The total return on ad spend (ROAS) from website purchases. This is based on the value of all conversions recorded by the Facebook pixel on your website and attributed to your ads. |
| `wish_bid` | NUMERIC | Wish Bid | wish_bid |

# Example Questions

- Do mobile and desktop differ in click-through rate?
- How does spend split across device platforms for each campaign?
- Which ads depend most on one device platform?

## Joins

- [Ads](./ads.md) — `ad_id = id` [N:1] — The ad the daily row reports on; one ad has many daily rows.
  - Description: The ad the daily row reports on; one ad has many daily rows.
- [Ad Account](./ad-account.md) — `account_id = account_id` [N:1] — The account the spend was charged to.
  - Description: The account the spend was charged to.
