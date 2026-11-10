---
title: "Ad Performance by Community"
description: |
  Daily ad performance split by community (subreddit): one row per ad per `date` per `community`. Each row carries impressions, clicks, `spend`, `ctr`, `cpc`, `ecpm`, `reach`, `frequency`, the key conversion count and cost, and click and view counts, cost per action and value for the standard conversion events (purchase, sign up, lead, add to cart, add to wishlist, page visit, search, view content), plus `conversion_roas` and the account `currency`.

  `community` holds the targeted community as the API returns it; the connector loads no table of communities. Join to [Ad Performance](./ad-performance.md) on `ad_id` and `date` for the ungrouped row, or to [Ads](./ads.md) on `ad_id`. Per the API reference, `spend`, `cpc`, `cpv` and `ecpm` and the `conversion_*_ecpa` fields are to be divided by 1 million, and the `conversion_*_total_value` fields by 100.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Reddit Ads connector — Ad Performance by Community endpoint (`report-by-COMMUNITY`)"
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20Ad%20Metrics"
    title: "Reddit Ads API reference — List%20Ad%20Metrics"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `report-by-COMMUNITY`
- **Default destination table:** `reddit_ads_report_by_COMMUNITY`
- **Unique keys:** `ad_id`, `date`, `community`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_id` | STRING | Ad ID | PK. The ID of the ad. |
| `date` | DATE | Date | PK. The date for this metric. |
| `clicks` | INTEGER | Clicks | The number of clicks detected for this report period. |
| `conversion_add_to_cart_avg_value` | NUMERIC | Conversion Add to Cart Avg Value | Average value of the shopping cart. |
| `conversion_add_to_cart_clicks` | INTEGER | Conversion Add to Cart Clicks | The click through conversions count. |
| `conversion_add_to_cart_ecpa` | NUMERIC | Conversion Add to Cart Ecpa | The cost per add to cart conversion. |
| `conversion_add_to_cart_total_items` | INTEGER | Conversion Add to Cart Total Items | Total size of the shopping cart. |
| `conversion_add_to_cart_total_value` | INTEGER | Conversion Add to Cart Total Value | Total value of the shopping cart. |
| `conversion_add_to_cart_views` | INTEGER | Conversion Add to Cart Views | The view through conversions count. |
| `conversion_add_to_wishlist_avg_value` | NUMERIC | Conversion Add to Wishlist Avg Value | Average value of the wish list. |
| `conversion_add_to_wishlist_clicks` | INTEGER | Conversion Add to Wishlist Clicks | The click through conversions count. |
| `conversion_add_to_wishlist_ecpa` | NUMERIC | Conversion Add to Wishlist Ecpa | The cost per add to wishlist conversion. |
| `conversion_add_to_wishlist_total_items` | INTEGER | Conversion Add to Wishlist Total Items | Total size of the wish list. |
| `conversion_add_to_wishlist_total_value` | INTEGER | Conversion Add to Wishlist Total Value | Total value of the wish list. |
| `conversion_add_to_wishlist_views` | INTEGER | Conversion Add to Wishlist Views | The view through conversions count. |
| `conversion_lead_avg_value` | NUMERIC | Conversion Lead Avg Value | Avg value of lead. |
| `conversion_lead_clicks` | INTEGER | Conversion Lead Clicks | The click through conversions count. |
| `conversion_lead_ecpa` | NUMERIC | Conversion Lead Ecpa | The cost per lead conversion. |
| `conversion_lead_total_value` | INTEGER | Conversion Lead Total Value | Total value of leads. |
| `conversion_lead_views` | INTEGER | Conversion Lead Views | The view through conversions count. |
| `conversion_page_visit_clicks` | INTEGER | Conversion Page Visit Clicks | The click through conversions count. |
| `conversion_page_visit_ecpa` | NUMERIC | Conversion Page Visit Ecpa | The cost per page visit conversion. |
| `conversion_page_visit_views` | INTEGER | Conversion Page Visit Views | The view through conversions count. |
| `conversion_purchase_avg_value` | NUMERIC | Conversion Purchase Avg Value | Average value of purchase. |
| `conversion_purchase_clicks` | INTEGER | Conversion Purchase Clicks | The click through conversions count. |
| `conversion_purchase_ecpa` | NUMERIC | Conversion Purchase Ecpa | The cost per purchase conversion. |
| `conversion_purchase_total_items` | INTEGER | Conversion Purchase Total Items | Total size of the purchase. |
| `conversion_purchase_total_value` | INTEGER | Conversion Purchase Total Value | Total value of the purchase. |
| `conversion_purchase_views` | INTEGER | Conversion Purchase Views | The view through conversions count. |
| `conversion_roas` | NUMERIC | Conversion ROAS | Return on ad spend for purchases for this period. |
| `conversion_search_clicks` | INTEGER | Conversion Search Clicks | The click through conversions count. |
| `conversion_search_ecpa` | NUMERIC | Conversion Search Ecpa | The cost per search conversion. |
| `conversion_search_views` | INTEGER | Conversion Search Views | The view through conversions count. |
| `conversion_sign_up_clicks` | INTEGER | Conversion Sign Up Clicks | The click through conversions count. |
| `conversion_sign_up_ecpa` | NUMERIC | Conversion Sign Up Ecpa | The cost per sign up conversion. |
| `conversion_sign_up_views` | INTEGER | Conversion Sign Up Views | The view through conversions count. |
| `conversion_signup_avg_value` | NUMERIC | Conversion Signup Avg Value | Avg value of signup. |
| `conversion_signup_total_value` | INTEGER | Conversion Signup Total Value | Total value of signups. |
| `conversion_view_content_clicks` | INTEGER | Conversion View Content Clicks | The click through conversions count. |
| `conversion_view_content_ecpa` | NUMERIC | Conversion View Content Ecpa | The cost per view content conversion. |
| `conversion_view_content_views` | INTEGER | Conversion View Content Views | The view through conversions count. |
| `community` | STRING | Community | PK. \[ONLY in COMMUNITY based report\] The community/subreddit being targeted. |
| `cpc` | NUMERIC | CPC | The cost-per-click for this period. |
| `ctr` | NUMERIC | CTR | The click-through-rate for this period. |
| `cpv` | NUMERIC | Cpv | \[Broken\] The cost-per-view for this period. |
| `ecpm` | NUMERIC | Ecpm | The effective CPM for this period. |
| `engaged_click` | INTEGER | Engaged Click | The number of engaged clicks such as RSVPs. |
| `hour` | STRING | Hour | The hour for this metric in ISO-8601. |
| `impressions` | INTEGER | Impressions | The number of impressions served for this report period. |
| `post_id` | STRING | Post ID | The unique identifier of the post. |
| `spend` | INTEGER | Spend | The amount (in microcurrency) spent for this report period. |
| `key_conversion_ecpa` | NUMERIC | Key Conversion Ecpa | Key conversion effective cost per action. |
| `key_conversion_total_count` | INTEGER | Key Conversion Total Count | Key conversion total count. |
| `reach` | INTEGER | Reach | The number of unique users who saw the ad. |
| `frequency` | NUMERIC | Frequency | The average number of times each user saw the ad. |
| `currency` | STRING | Currency | The currency of the account. |

# Example Questions

- Which subreddits get the most impressions and clicks?
- Which communities have the lowest cost per click?
- Which communities produce the most key conversions for the money?

## Joins

- [Ad Performance](./ad-performance.md) — `ad_id = ad_id`, `date = date` [N:1] — The ad's day that this row splits by one more dimension; one ad-day has several rows here.
  - Description: The ad's day that this row splits by one more dimension; one ad-day has several rows here.
