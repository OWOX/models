---
title: "Ad Performance by Country"
description: |
  Daily ad performance split by the user's country: one row per ad per `date` per `country`. Each row carries impressions, clicks, `spend`, `ctr`, `cpc`, `ecpm`, `reach`, `frequency`, the key conversion count and cost, and click and view counts, cost per action and value for the standard conversion events (purchase, sign up, lead, add to cart, add to wishlist, page visit, search, view content), plus `conversion_roas` and the account `currency`.

  `country` holds the targeted country as the API returns it; the connector loads no table of countries. Join to [Ads](./ads.md) on `ad_id` for the ad. Per the API reference, `spend`, `cpc`, `cpv` and `ecpm` and the `conversion_*_ecpa` fields are to be divided by 1 million, and the `conversion_*_total_value` fields by 100.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Reddit Ads connector — Ad Performance by Country endpoint (`report-by-COUNTRY`)"
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20Ad%20Metrics"
    title: "Reddit Ads API reference — List%20Ad%20Metrics"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `report-by-COUNTRY`
- **Default destination table:** `reddit_ads_report_by_COUNTRY`
- **Unique keys:** `ad_id`, `date`, `country`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_id` | STRING | PK. The ID of the ad. |
| `date` | DATE | PK. The date for this metric. |
| `clicks` | INTEGER | The number of clicks detected for this report period. |
| `conversion_add_to_cart_avg_value` | NUMERIC | Average value of the shopping cart. |
| `conversion_add_to_cart_clicks` | INTEGER | The click through conversions count. |
| `conversion_add_to_cart_ecpa` | NUMERIC | The cost per add to cart conversion. |
| `conversion_add_to_cart_total_items` | INTEGER | Total size of the shopping cart. |
| `conversion_add_to_cart_total_value` | INTEGER | Total value of the shopping cart. |
| `conversion_add_to_cart_views` | INTEGER | The view through conversions count. |
| `conversion_add_to_wishlist_avg_value` | NUMERIC | Average value of the wish list. |
| `conversion_add_to_wishlist_clicks` | INTEGER | The click through conversions count. |
| `conversion_add_to_wishlist_ecpa` | NUMERIC | The cost per add to wishlist conversion. |
| `conversion_add_to_wishlist_total_items` | INTEGER | Total size of the wish list. |
| `conversion_add_to_wishlist_total_value` | INTEGER | Total value of the wish list. |
| `conversion_add_to_wishlist_views` | INTEGER | The view through conversions count. |
| `conversion_lead_avg_value` | NUMERIC | Avg value of lead. |
| `conversion_lead_clicks` | INTEGER | The click through conversions count. |
| `conversion_lead_ecpa` | NUMERIC | The cost per lead conversion. |
| `conversion_lead_total_value` | INTEGER | Total value of leads. |
| `conversion_lead_views` | INTEGER | The view through conversions count. |
| `conversion_page_visit_clicks` | INTEGER | The click through conversions count. |
| `conversion_page_visit_ecpa` | NUMERIC | The cost per page visit conversion. |
| `conversion_page_visit_views` | INTEGER | The view through conversions count. |
| `conversion_purchase_avg_value` | NUMERIC | Average value of purchase. |
| `conversion_purchase_clicks` | INTEGER | The click through conversions count. |
| `conversion_purchase_ecpa` | NUMERIC | The cost per purchase conversion. |
| `conversion_purchase_total_items` | INTEGER | Total size of the purchase. |
| `conversion_purchase_total_value` | INTEGER | Total value of the purchase. |
| `conversion_purchase_views` | INTEGER | The view through conversions count. |
| `conversion_roas` | NUMERIC | Return on ad spend for purchases for this period. |
| `conversion_search_clicks` | INTEGER | The click through conversions count. |
| `conversion_search_ecpa` | NUMERIC | The cost per search conversion. |
| `conversion_search_views` | INTEGER | The view through conversions count. |
| `conversion_sign_up_clicks` | INTEGER | The click through conversions count. |
| `conversion_sign_up_ecpa` | NUMERIC | The cost per sign up conversion. |
| `conversion_sign_up_views` | INTEGER | The view through conversions count. |
| `conversion_signup_avg_value` | NUMERIC | Avg value of signup. |
| `conversion_signup_total_value` | INTEGER | Total value of signups. |
| `conversion_view_content_clicks` | INTEGER | The click through conversions count. |
| `conversion_view_content_ecpa` | NUMERIC | The cost per view content conversion. |
| `conversion_view_content_views` | INTEGER | The view through conversions count. |
| `country` | STRING | PK. \[ONLY in COUNTRY based report\] The country targeted for the report. |
| `cpc` | NUMERIC | The cost-per-click for this period. |
| `ctr` | NUMERIC | The click-through-rate for this period. |
| `cpv` | NUMERIC | \[Broken\] The cost-per-view for this period. |
| `ecpm` | NUMERIC | The effective CPM for this period. |
| `engaged_click` | INTEGER | The number of engaged clicks such as RSVPs. |
| `hour` | STRING | The hour for this metric in ISO-8601. |
| `impressions` | INTEGER | The number of impressions served for this report period. |
| `post_id` | STRING | The unique identifier of the post. |
| `spend` | INTEGER | The amount (in microcurrency) spent for this report period. |
| `key_conversion_ecpa` | NUMERIC | Key conversion effective cost per action. |
| `key_conversion_total_count` | INTEGER | Key conversion total count. |
| `reach` | INTEGER | The number of unique users who saw the ad. |
| `frequency` | NUMERIC | The average number of times each user saw the ad. |
| `currency` | STRING | The currency of the account. |

# Example Questions

- Which countries bring the most clicks and conversions?
- What is the cost per click in each country?
- Which countries have the highest conversion_roas?

## Joins

- [Ads](./ads.md) — `ad_id = id` [N:1] — The ad the daily row reports on.
  - Description: The ad the daily row reports on.
