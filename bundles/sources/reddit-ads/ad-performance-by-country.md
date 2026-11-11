---
title: "Ad Performance by Country"
description: |
  Daily ad performance split by country: one row per ad per `date` per `country`. Each row carries impressions, clicks, `spend`, `ctr`, `cpc`, `ecpm`, `reach`, `frequency`, the key conversion count and cost, and click and view counts, cost per action and value for the standard conversion events (purchase, sign up, lead, add to cart, add to wishlist, page visit, search, view content), plus `conversion_roas` and the account `currency`.

  `country` holds the targeted country as the API returns it; the connector loads no table of countries. Join to [Ad Performance](./ad-performance.md) on `ad_id` and `date` for the ungrouped row, or to [Ads](./ads.md) on `ad_id` for the ad. Per the API reference, `spend`, `cpc`, `cpv` and `ecpm` and the `conversion_*_ecpa` fields are to be divided by 1 million, and the `conversion_*_total_value` fields by 100.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/ad-reports-country.js"
    title: "OWOX Data Marts Reddit Ads connector — Ad Performance by Country endpoint (`report-by-COUNTRY`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20Ad%20Metrics"
    title: "Reddit Ads API reference — Ad Performance by Country"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `report-by-COUNTRY`
- **Default destination table:** `reddit_ads_report_by_COUNTRY`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Reddit Ads API version:** v3
- **Unique keys:** `ad_id`, `date`, `country`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ad_id` | STRING | Ad ID | PK. The ID of the ad. FK to [Ad Performance](./ad-performance.md) |
| `date` | DATE | Date | PK. The date for this metric. FK to [Ad Performance](./ad-performance.md) |
| `clicks` | INTEGER | Clicks | The number of clicks detected for this report period. |
| `conversion_add_to_cart_avg_value` | FLOAT | Conversion Add To Cart Average Value | Average value of the shopping cart. |
| `conversion_add_to_cart_clicks` | INTEGER | Conversion Add To Cart Clicks | The click through conversions count. |
| `conversion_add_to_cart_ecpa` | FLOAT | Conversion Add To Cart eCPA | The cost per add to cart conversion. |
| `conversion_add_to_cart_total_items` | INTEGER | Conversion Add To Cart Total Items | Total size of the shopping cart. |
| `conversion_add_to_cart_total_value` | INTEGER | Conversion Add To Cart Total Value | Total value of the shopping cart. |
| `conversion_add_to_cart_views` | INTEGER | Conversion Add To Cart Views | The view through conversions count. |
| `conversion_add_to_wishlist_avg_value` | FLOAT | Conversion Add To Wishlist Average Value | Average value of the wish list. |
| `conversion_add_to_wishlist_clicks` | INTEGER | Conversion Add To Wishlist Clicks | The click through conversions count. |
| `conversion_add_to_wishlist_ecpa` | FLOAT | Conversion Add To Wishlist eCPA | The cost per add to wishlist conversion. |
| `conversion_add_to_wishlist_total_items` | INTEGER | Conversion Add To Wishlist Total Items | Total size of the wish list. |
| `conversion_add_to_wishlist_total_value` | INTEGER | Conversion Add To Wishlist Total Value | Total value of the wish list. |
| `conversion_add_to_wishlist_views` | INTEGER | Conversion Add To Wishlist Views | The view through conversions count. |
| `conversion_lead_avg_value` | FLOAT | Conversion Lead Average Value | Avg value of lead. |
| `conversion_lead_clicks` | INTEGER | Conversion Lead Clicks | The click through conversions count. |
| `conversion_lead_ecpa` | FLOAT | Conversion Lead eCPA | The cost per lead conversion. |
| `conversion_lead_total_value` | INTEGER | Conversion Lead Total Value | Total value of leads. |
| `conversion_lead_views` | INTEGER | Conversion Lead Views | The view through conversions count. |
| `conversion_page_visit_clicks` | INTEGER | Conversion Page Visit Clicks | The click through conversions count. |
| `conversion_page_visit_ecpa` | FLOAT | Conversion Page Visit eCPA | The cost per page visit conversion. |
| `conversion_page_visit_views` | INTEGER | Conversion Page Visit Views | The view through conversions count. |
| `conversion_purchase_avg_value` | FLOAT | Conversion Purchase Average Value | Average value of purchase. |
| `conversion_purchase_clicks` | INTEGER | Conversion Purchase Clicks | The click through conversions count. |
| `conversion_purchase_ecpa` | FLOAT | Conversion Purchase eCPA | The cost per purchase conversion. |
| `conversion_purchase_total_items` | INTEGER | Conversion Purchase Total Items | Total size of the purchase. |
| `conversion_purchase_total_value` | INTEGER | Conversion Purchase Total Value | Total value of the purchase. |
| `conversion_purchase_views` | INTEGER | Conversion Purchase Views | The view through conversions count. |
| `conversion_roas` | FLOAT | Conversion ROAS | Return on ad spend for purchases for this period. |
| `conversion_search_clicks` | INTEGER | Conversion Search Clicks | The click through conversions count. |
| `conversion_search_ecpa` | FLOAT | Conversion Search eCPA | The cost per search conversion. |
| `conversion_search_views` | INTEGER | Conversion Search Views | The view through conversions count. |
| `conversion_sign_up_clicks` | INTEGER | Conversion Sign Up Clicks | The click through conversions count. |
| `conversion_sign_up_ecpa` | FLOAT | Conversion Sign Up eCPA | The cost per sign up conversion. |
| `conversion_sign_up_views` | INTEGER | Conversion Sign Up Views | The view through conversions count. |
| `conversion_signup_avg_value` | FLOAT | Conversion Signup Average Value | Avg value of signup. |
| `conversion_signup_total_value` | INTEGER | Conversion Signup Total Value | Total value of signups. |
| `conversion_view_content_clicks` | INTEGER | Conversion View Content Clicks | The click through conversions count. |
| `conversion_view_content_ecpa` | FLOAT | Conversion View Content eCPA | The cost per view content conversion. |
| `conversion_view_content_views` | INTEGER | Conversion View Content Views | The view through conversions count. |
| `country` | STRING | Country | PK. [ONLY in COUNTRY based report] The country targeted for the report. |
| `cpc` | FLOAT | CPC | The cost-per-click for this period. |
| `ctr` | FLOAT | CTR | The click-through-rate for this period. |
| `cpv` | FLOAT | CPV | [Broken] The cost-per-view for this period. |
| `ecpm` | FLOAT | eCPM | The effective CPM for this period. |
| `engaged_click` | INTEGER | Engaged Click | The number of engaged clicks such as RSVPs. |
| `hour` | STRING | Hour | The hour for this metric in ISO-8601. |
| `impressions` | INTEGER | Impressions | The number of impressions served for this report period. |
| `post_id` | STRING | Post ID | The unique identifier of the post. |
| `spend` | INTEGER | Spend | The amount (in microcurrency) spent for this report period. |
| `key_conversion_ecpa` | FLOAT | Key Conversion eCPA | Key conversion effective cost per action. |
| `key_conversion_total_count` | INTEGER | Key Conversion Total Count | Total count of key conversions for the row; their cost per action is `key_conversion_ecpa`. |
| `reach` | INTEGER | Reach | The number of unique users who saw the ad. |
| `frequency` | FLOAT | Frequency | The average number of times each user saw the ad. |
| `currency` | STRING | Currency | The currency of the account. |

# Example Questions

- Which countries bring the most clicks and conversions?
- What is the cost per click in each country?
- Which countries have the highest return on ad spend for purchases?

## Joins

- [Ad Performance](./ad-performance.md) — `ad_id = ad_id` AND `date = date` [N:1] — The whole ad-day this row is one slice of.
  - [Ad Behind This Row](./ads.md) — The ad this country slice reports on — its settings, not its results.
    - [Ad's Ad Group](./ad-groups.md) — The ad group of the ad behind this row, where its country targeting is set.
      - [Ad's Campaign](./campaigns.md) — The campaign of the ad behind this row — objective, status and spend cap, not results.
        - [Ad's Ad Account](./ad-account.md) — The ad account the ad runs under.
          - [Ad's Account Contact](./ad-account-user.md) — The primary contact of the ad's account, found only when it is the authenticated member.
        - [Ad's Funding Instrument](./funding-instruments.md) — The payment method the ad's campaign spends against.
